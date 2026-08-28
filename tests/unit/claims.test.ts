import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

interface Claim { id:string; test:string }

describe('claims registry', () => {
  it('maps every claim to exactly one tagged test', () => {
    const claims=JSON.parse(readFileSync('.factory/claims.json','utf8')) as Claim[];
    const sources=[readFileSync('tests/e2e/app.spec.ts','utf8'),readFileSync('tests/unit/csv.test.ts','utf8')].join('\n');
    expect(new Set(claims.map(claim=>claim.id)).size).toBe(claims.length);
    for(const claim of claims){
      expect(claim.test).toContain(`@claim:${claim.id}`);
      expect(sources.split(`@claim:${claim.id}`).length-1,claim.id).toBe(1);
    }
  });

  it('keeps the catalog description verb-first and within 120 characters', () => {
    const description=readFileSync('.factory/catalog-description.txt','utf8').trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^Prepare\b/);
  });
});
