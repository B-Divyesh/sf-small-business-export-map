import { describe, expect, it } from 'vitest';
import { detectDelimiter, parseCsv, parseTemplateHeaders, transformCsv } from '../../src/csv';
import type { DateFormat, Delimiter, RecipientProfile } from '../../src/types';

function profile(overrides: Partial<RecipientProfile> = {}): RecipientProfile {
  return {
    id: 'profile-1', name: 'Accountant', delimiter: ',', sourceDecimal: ',', outputDecimal: '.',
    sourceDate: 'DD.MM.YYYY', outputDate: 'YYYY-MM-DD', protectFormulas: false, updatedAt: '2026-08-28T00:00:00.000Z',
    mappings: [
      { id: 'a', target: 'Invoice date', source: 'Date', kind: 'date', required: true },
      { id: 'b', target: 'Net amount', source: 'Amount', kind: 'number', required: true },
      { id: 'c', target: 'Note', source: 'Memo', kind: 'text', required: false },
    ],
    ...overrides,
  };
}

describe('CSV preparation', () => {
  it('detects common separators outside quotes', () => {
    expect(detectDelimiter('Name;Amount\nAcme;12,50')).toBe(';');
    expect(detectDelimiter('Name\tAmount\nAcme\t12.50')).toBe('\t');
  });

  it('parses quoted separators and line breaks', () => {
    const parsed = parseCsv('Name,Note\r\nAcme,"hello, world"\r\nBeta,"two\nlines"');
    expect(parsed.headers).toEqual(['Name', 'Note']);
    expect(parsed.rows).toEqual([['Acme', 'hello, world'], ['Beta', 'two\nlines']]);
  });

  it('accepts a valid quoted field beyond the separator sample boundary', () => {
    const parsed = parseCsv(`ID,Notes\n1,"${'x'.repeat(70_000)}"`);
    expect(parsed.rows[0][1]).toHaveLength(70_000);
  });

  it('@claim:explicit-formatting changes typed fields and leaves text-mapped dates and numbers unchanged', () => {
    const parsed = parseCsv('Date;Amount;Date text;Amount text\n28.08.2026;12,50;28.08.2026;12,50');
    const result = transformCsv(parsed, profile({ mappings: [
      { id:'a', target:'Typed date', source:'Date', kind:'date', required:true },
      { id:'b', target:'Typed amount', source:'Amount', kind:'number', required:true },
      { id:'c', target:'Date as text', source:'Date text', kind:'text', required:true },
      { id:'d', target:'Amount as text', source:'Amount text', kind:'text', required:true },
    ] }));
    expect(result.rows[0]).toEqual(['2026-08-28', '12.50', '28.08.2026', '12,50']);
    expect(result.changes.every(change => change.reversible.length > 0)).toBe(true);
  });

  it('@claim:formula-protection handles =, +, and @ only when protection is on', () => {
    const parsed = parseCsv('A;B;C\n=SUM(A1);+44123;@name');
    const mappings = parsed.headers.map((source, index) => ({ id:String(index), target:source, source, kind:'text' as const, required:true }));
    expect(transformCsv(parsed, profile({ mappings, protectFormulas:true })).rows[0]).toEqual(["'=SUM(A1)", "'+44123", "'@name"]);
    expect(transformCsv(parsed, profile({ mappings, protectFormulas:false })).rows[0]).toEqual(['=SUM(A1)', '+44123', '@name']);
  });

  it('@claim:core-format-matrix supports every advertised separator, decimal mark, date format, and column order', () => {
    const separators: Delimiter[] = [',', ';', '\t', '|'];
    for (const delimiter of separators) {
      const result = transformCsv(parseCsv('First;Second\nA;B'), profile({ delimiter, mappings:[
        { id:'2', target:'Renamed second', source:'Second', kind:'text', required:true },
        { id:'1', target:'Renamed first', source:'First', kind:'text', required:true },
      ] }));
      expect(result.rows[0]).toEqual(['B','A']);
      expect(result.csv).toContain(`Renamed second${delimiter}Renamed first`);
    }
    expect(transformCsv(parseCsv('Amount;Note\n12.50;x'), profile({ sourceDecimal:'.', outputDecimal:',', mappings:[{id:'n',target:'Amount',source:'Amount',kind:'number',required:true}] })).rows[0][0]).toBe('12,50');
    expect(transformCsv(parseCsv('Amount;Note\n12,50;x'), profile({ sourceDecimal:',', outputDecimal:'.', mappings:[{id:'n',target:'Amount',source:'Amount',kind:'number',required:true}] })).rows[0][0]).toBe('12.50');
    const values: Record<DateFormat,string> = {'YYYY-MM-DD':'2026-08-28','DD/MM/YYYY':'28/08/2026','MM/DD/YYYY':'08/28/2026','DD.MM.YYYY':'28.08.2026'};
    for (const [sourceDate, value] of Object.entries(values) as [DateFormat,string][]) {
      const result=transformCsv(parseCsv(`Date\n${value}`),profile({sourceDate,outputDate:'YYYY-MM-DD',mappings:[{id:'d',target:'Date',source:'Date',kind:'date',required:true}]}));
      expect(result.rows[0][0]).toBe('2026-08-28');
    }
  });

  it('reads only ordered headers from an accountant template', () => {
    expect(parseTemplateHeaders('Invoice ID,Net total,Payment date\n,,')).toEqual(['Invoice ID','Net total','Payment date']);
    expect(() => parseTemplateHeaders('Invoice ID,Invoice ID')).toThrow(/repeats/);
  });

  it('blocks malformed declared dates', () => {
    const result = transformCsv(parseCsv('Date;Amount;Memo\n2026/08/28;12,50;ok'), profile());
    expect(result.issues).toContainEqual(expect.objectContaining({ level: 'error', title: 'Check values in “Invoice date”' }));
  });

  it('rejects duplicate and empty headers', () => {
    expect(() => parseCsv('Name,Name\nA,B')).toThrow(/Duplicate/);
    expect(() => parseCsv('Name,\nA,B')).toThrow(/empty column name/);
  });
});
