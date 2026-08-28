import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('completes an accountant-ready handoff', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make the handoff fit.');
  await page.locator('#csv-file').setInputFiles({
    name: 'invoices.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('Date;Amount;Memo\n28.08.2026;12,50;Consulting\n29.08.2026;7,25;Hosting'),
  });
  await expect(page.locator('#file-summary')).toContainText('2 records');
  await page.getByLabel('Recipient profile name').fill('Patel & Co');
  await page.getByLabel('Source decimal mark').selectOption(',');
  await page.getByLabel('Source date format').selectOption('DD.MM.YYYY');
  await page.getByRole('button', { name: 'Use source headers' }).click();
  await page.locator('tr[data-id]').filter({ has: page.locator('input[value="Date"]') }).locator('select[data-key="kind"]').selectOption('date');
  await page.locator('tr[data-id]').filter({ has: page.locator('input[value="Amount"]') }).locator('select[data-key="kind"]').selectOption('number');
  await page.getByRole('button', { name: 'Save recipient' }).click();
  await expect(page.locator('#app-message')).toContainText('Saved “Patel & Co”');
  await page.getByRole('button', { name: 'Run preflight' }).click();
  await expect(page.getByText('Ready for handoff')).toBeVisible();
  await expect(page.locator('#preview')).toContainText('2026-08-28');
  await expect(page.locator('#preview')).toContainText('12.50');
  await expect(page.getByRole('button', { name: 'Download CSV' })).toBeEnabled();
  await expect(page.getByRole('button', { name: 'Download manifest' })).toBeEnabled();
});

test('has no serious accessibility violations on the working screen', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('legal pages are available', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('records stay on this device');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('not accounting advice');
});

test('reloads the app while offline after the first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make the handoff fit.');
  await expect(page.locator('#network-status')).toContainText('Offline');
});
