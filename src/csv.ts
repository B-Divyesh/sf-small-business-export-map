import type { DateFormat, Delimiter, Mapping, ParsedCsv, RecipientProfile, TransformResult, ValidationIssue } from './types';

const CANDIDATES: Delimiter[] = [',', ';', '\t', '|'];

export function detectDelimiter(text: string): Delimiter {
  // Never hand the detector a fragment which ends inside a quoted field. A
  // long, valid Notes column used to make the 64 KB sample look malformed.
  const limit = Math.min(text.length, 64_000);
  let end = limit;
  let quoted = false;
  for (let i = 0; i < limit; i += 1) {
    if (text[i] === '"') {
      if (quoted && text[i + 1] === '"') { i += 1; continue; }
      quoted = !quoted;
    }
    if (!quoted && text[i] === '\n') end = i + 1;
  }
  // A first record can itself be larger than the usual sample. In that case
  // parsing the whole file is safer than rejecting a file below the limit.
  const sample = end > 0 ? text.slice(0, end) : text;
  let best: { delimiter: Delimiter; score: number } = { delimiter: ',', score: -Infinity };
  for (const delimiter of CANDIDATES) {
    const rows = parseRows(sample, delimiter).slice(0, 20).filter((row) => row.some(Boolean));
    if (rows.length === 0) continue;
    const widths = rows.map((row) => row.length);
    const mode = widths.sort((a, b) => widths.filter((v) => v === b).length - widths.filter((v) => v === a).length)[0];
    const consistent = widths.filter((width) => width === mode).length;
    const score = mode > 1 ? mode * 2 + consistent / rows.length : 0;
    if (score > best.score) best = { delimiter, score };
  }
  return best.delimiter;
}

export function parseRows(text: string, delimiter: Delimiter): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"' && field.length === 0) quoted = true;
    else if (char === delimiter) { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  if (quoted) throw new Error('A quoted field is not closed. Check the final row in the file.');
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

export function parseCsv(text: string): ParsedCsv {
  const clean = text.replace(/^\uFEFF/, '');
  if (!clean.trim()) throw new Error('This file is empty. Choose a CSV with a header row.');
  const delimiter = detectDelimiter(clean);
  const allRows = parseRows(clean, delimiter);
  if (allRows.length < 2) throw new Error('Only a header row was found. Add at least one record and try again.');
  const headers = allRows[0].map((value) => value.trim());
  if (headers.some((header) => !header)) throw new Error('The header row has an empty column name. Name every column before continuing.');
  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicates.length) throw new Error(`Duplicate column name: ${duplicates[0]}. Rename it in the source file first.`);
  const warnings: string[] = [];
  const rows = allRows.slice(1).filter((row) => row.some((value) => value !== ''));
  const mismatched = rows.filter((row) => row.length !== headers.length).length;
  if (mismatched) warnings.push(`${mismatched} row${mismatched === 1 ? '' : 's'} have a different number of fields from the header.`);
  return { headers, rows, delimiter, warnings };
}

export function delimiterLabel(value: Delimiter): string {
  return value === ',' ? 'Comma (,)' : value === ';' ? 'Semicolon (;)' : value === '\t' ? 'Tab' : 'Pipe (|)';
}

function parseDate(value: string, format: DateFormat): { y: string; m: string; d: string } | null {
  const patterns: Record<DateFormat, RegExp> = {
    'YYYY-MM-DD': /^(\d{4})-(\d{2})-(\d{2})$/,
    'DD/MM/YYYY': /^(\d{2})\/(\d{2})\/(\d{4})$/,
    'MM/DD/YYYY': /^(\d{2})\/(\d{2})\/(\d{4})$/,
    'DD.MM.YYYY': /^(\d{2})\.(\d{2})\.(\d{4})$/,
  };
  const match = value.trim().match(patterns[format]);
  if (!match) return null;
  const [y, m, d] = format === 'YYYY-MM-DD' ? [match[1], match[2], match[3]] : format === 'MM/DD/YYYY' ? [match[3], match[1], match[2]] : [match[3], match[2], match[1]];
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return date.getUTCFullYear() === Number(y) && date.getUTCMonth() + 1 === Number(m) && date.getUTCDate() === Number(d) ? { y, m, d } : null;
}

function formatDate(parts: { y: string; m: string; d: string }, format: DateFormat): string {
  if (format === 'YYYY-MM-DD') return `${parts.y}-${parts.m}-${parts.d}`;
  if (format === 'MM/DD/YYYY') return `${parts.m}/${parts.d}/${parts.y}`;
  if (format === 'DD.MM.YYYY') return `${parts.d}.${parts.m}.${parts.y}`;
  return `${parts.d}/${parts.m}/${parts.y}`;
}

function quote(value: string, delimiter: Delimiter): string {
  return value.includes(delimiter) || /["\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function normaliseNumber(value: string, source: '.' | ',', output: '.' | ','): string | null {
  const trimmed = value.trim().replace(/\s/g, '');
  if (!trimmed) return '';
  const escaped = source === '.' ? '\\.' : ',';
  if (!new RegExp(`^[+-]?\\d+(?:${escaped}\\d+)?$`).test(trimmed)) return null;
  return source === output ? trimmed : trimmed.replace(source, output);
}

export function transformCsv(parsed: ParsedCsv, profile: RecipientProfile): TransformResult {
  const issues: ValidationIssue[] = [];
  const active = profile.mappings.filter((mapping) => mapping.target.trim());
  const targets = active.map((mapping) => mapping.target.trim());
  const duplicate = targets.find((target, index) => targets.indexOf(target) !== index);
  if (!active.length) issues.push({ level: 'error', title: 'No recipient columns', detail: 'Add at least one column to the recipient map.' });
  if (duplicate) issues.push({ level: 'error', title: 'Duplicate recipient column', detail: `“${duplicate}” appears more than once.` });
  for (const mapping of active) {
    if (mapping.required && !mapping.source) issues.push({ level: 'error', title: `Map “${mapping.target}”`, detail: 'This required recipient column has no source column.' });
    if (mapping.source && !parsed.headers.includes(mapping.source)) issues.push({ level: 'error', title: `Source column missing`, detail: `“${mapping.source}” is not in this file.` });
  }
  const outputRows: string[][] = [];
  const invalidByTarget = new Map<string, string[]>();
  let renamed = 0, dates = 0, numbers = 0, formulas = 0;
  for (const row of parsed.rows) {
    const out = active.map((mapping: Mapping) => {
      const sourceIndex = parsed.headers.indexOf(mapping.source);
      let value = sourceIndex >= 0 ? (row[sourceIndex] ?? '') : '';
      if (mapping.kind === 'number' && value) {
        const converted = normaliseNumber(value, profile.sourceDecimal, profile.outputDecimal);
        if (converted === null) {
          const samples = invalidByTarget.get(mapping.target) ?? [];
          if (samples.length < 3) samples.push(value);
          invalidByTarget.set(mapping.target, samples);
        } else { if (converted !== value.trim()) numbers += 1; value = converted; }
      }
      if (mapping.kind === 'date' && value) {
        const parsedDate = parseDate(value, profile.sourceDate);
        if (!parsedDate) {
          const samples = invalidByTarget.get(mapping.target) ?? [];
          if (samples.length < 3) samples.push(value);
          invalidByTarget.set(mapping.target, samples);
        } else { const converted = formatDate(parsedDate, profile.outputDate); if (converted !== value) dates += 1; value = converted; }
      }
      if (profile.protectFormulas && /^[=+@]/.test(value)) { value = `'${value}`; formulas += 1; }
      if (mapping.source && mapping.source !== mapping.target) renamed += 1;
      return value;
    });
    outputRows.push(out);
  }
  invalidByTarget.forEach((samples, target) => issues.push({ level: 'error', title: `Check values in “${target}”`, detail: `These do not match the declared ${active.find((item) => item.target === target)?.kind} format: ${samples.map((v) => `“${v}”`).join(', ')}.` }));
  parsed.warnings.forEach((detail) => issues.push({ level: 'warning', title: 'Uneven source rows', detail }));
  if (parsed.delimiter !== profile.delimiter) issues.push({ level: 'warning', title: 'Delimiter will change', detail: `${delimiterLabel(parsed.delimiter)} → ${delimiterLabel(profile.delimiter)}.` });
  if (!issues.some((issue) => issue.level === 'error')) issues.push({ level: 'pass', title: 'Ready for handoff', detail: `${outputRows.length.toLocaleString()} records match the declared map.` });
  const lines = [targets, ...outputRows].map((row) => row.map((value) => quote(value, profile.delimiter)).join(profile.delimiter));
  const changes = [
    { action: `Select and order ${active.length} recipient columns`, affected: outputRows.length, reversible: 'Use each manifest source → recipient mapping in reverse.' },
    ...(parsed.delimiter !== profile.delimiter ? [{ action: `Change delimiter from ${delimiterLabel(parsed.delimiter)} to ${delimiterLabel(profile.delimiter)}`, affected: outputRows.length + 1, reversible: `Parse with ${delimiterLabel(profile.delimiter)} and write with ${delimiterLabel(parsed.delimiter)}.` }] : []),
    ...(renamed ? [{ action: 'Rename mapped column headers', affected: active.filter((m) => m.source !== m.target).length, reversible: 'Rename each recipient header back to its recorded source header.' }] : []),
    ...(numbers ? [{ action: `Convert decimal mark ${profile.sourceDecimal} → ${profile.outputDecimal} in number columns`, affected: numbers, reversible: `Apply ${profile.outputDecimal} → ${profile.sourceDecimal} only to the listed number columns.` }] : []),
    ...(dates ? [{ action: `Convert dates ${profile.sourceDate} → ${profile.outputDate}`, affected: dates, reversible: `Parse ${profile.outputDate} and format as ${profile.sourceDate} only in listed date columns.` }] : []),
    ...(formulas ? [{ action: 'Prefix formula-like cells with an apostrophe', affected: formulas, reversible: 'Remove one leading apostrophe from the listed protected values.' }] : []),
  ];
  return { csv: `\uFEFF${lines.join('\r\n')}\r\n`, rows: outputRows, issues, changes };
}
