export type Delimiter = ',' | ';' | '\t' | '|';
export type DecimalMark = '.' | ',';
export type DateFormat = 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'DD.MM.YYYY';
export type FieldKind = 'text' | 'number' | 'date';

export interface Mapping {
  id: string;
  target: string;
  source: string;
  kind: FieldKind;
  required: boolean;
}

export interface RecipientProfile {
  id: string;
  name: string;
  delimiter: Delimiter;
  sourceDecimal: DecimalMark;
  outputDecimal: DecimalMark;
  sourceDate: DateFormat;
  outputDate: DateFormat;
  protectFormulas: boolean;
  mappings: Mapping[];
  updatedAt: string;
}

export interface ParsedCsv {
  headers: string[];
  rows: string[][];
  delimiter: Delimiter;
  warnings: string[];
}

export interface ValidationIssue {
  level: 'error' | 'warning' | 'pass';
  title: string;
  detail: string;
}

export interface TransformResult {
  csv: string;
  rows: string[][];
  issues: ValidationIssue[];
  changes: Array<{ action: string; affected: number; reversible: string }>;
}
