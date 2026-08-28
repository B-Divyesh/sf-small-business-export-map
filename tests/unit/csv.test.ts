import { describe, expect, it } from 'vitest';
import { detectDelimiter, parseCsv, transformCsv } from '../../src/csv';
import type { RecipientProfile } from '../../src/types';

function profile(): RecipientProfile {
  return {
    id: 'profile-1', name: 'Accountant', delimiter: ',', sourceDecimal: ',', outputDecimal: '.',
    sourceDate: 'DD.MM.YYYY', outputDate: 'YYYY-MM-DD', protectFormulas: true, updatedAt: '2026-08-28T00:00:00.000Z',
    mappings: [
      { id: 'a', target: 'Invoice date', source: 'Date', kind: 'date', required: true },
      { id: 'b', target: 'Net amount', source: 'Amount', kind: 'number', required: true },
      { id: 'c', target: 'Note', source: 'Memo', kind: 'text', required: false },
    ],
  };
}

describe('CSV preflight', () => {
  it('detects common delimiters outside quotes', () => {
    expect(detectDelimiter('Name;Amount\nAcme;12,50')).toBe(';');
    expect(detectDelimiter('Name\tAmount\nAcme\t12.50')).toBe('\t');
  });

  it('parses quoted delimiters and line breaks', () => {
    const parsed = parseCsv('Name,Note\r\nAcme,"hello, world"\r\nBeta,"two\nlines"');
    expect(parsed.headers).toEqual(['Name', 'Note']);
    expect(parsed.rows).toEqual([['Acme', 'hello, world'], ['Beta', 'two\nlines']]);
  });

  it('accepts a valid quoted field beyond the delimiter sample boundary', () => {
    const parsed = parseCsv(`ID,Notes\n1,"${'x'.repeat(70_000)}"`);
    expect(parsed.headers).toEqual(['ID', 'Notes']);
    expect(parsed.rows[0][1]).toHaveLength(70_000);
  });

  it('@claim:explicit-formatting converts only explicitly typed fields and records reversals', () => {
    const parsed = parseCsv('Date;Amount;Memo\n28.08.2026;12,50;=SUM(A1)');
    const result = transformCsv(parsed, profile());
    expect(result.issues.some((issue) => issue.level === 'error')).toBe(false);
    expect(result.csv).toContain('2026-08-28,12.50');
    expect(result.csv).toContain("'=SUM(A1)");
    expect(result.changes.map((change) => change.action).join(' ')).toContain('Convert dates');
    expect(result.changes.every((change) => change.reversible.length > 0)).toBe(true);
  });

  it('blocks malformed declared dates', () => {
    const parsed = parseCsv('Date;Amount;Memo\n2026/08/28;12,50;ok');
    const result = transformCsv(parsed, profile());
    expect(result.issues).toContainEqual(expect.objectContaining({ level: 'error', title: 'Check values in “Invoice date”' }));
  });

  it('rejects duplicate and empty headers', () => {
    expect(() => parseCsv('Name,Name\nA,B')).toThrow(/Duplicate/);
    expect(() => parseCsv('Name,\nA,B')).toThrow(/empty column name/);
  });
});
