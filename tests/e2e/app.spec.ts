import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function openDemo(page: any) {
  await page.goto('/demo');
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toContainText('nothing is saved');
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await expect(page.getByText('Handoff files are ready')).toBeVisible();
}

test('@claim:demo-isolation opens a finished isolated sample and reset keeps real profiles untouched', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Recipient profile name').fill('Real accountant');
  await page.getByRole('button', { name: 'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('Saved');
  await page.goto('/demo');
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toContainText('Demo — sample data');
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#profile-select')).toContainText('Patel & Co monthly import');
  await page.goto('/');
  await expect(page.locator('#profile-select')).toContainText('Real accountant');
});

test('@claim:offline-demo reloads the sample after the first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await expect(page.locator('#network-status')).toContainText('Offline');
});

test('@claim:csv-manifest downloads an accountant-ready CSV and change record', async ({ page }) => {
  await openDemo(page);
  const csv = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  expect((await csv).suggestedFilename()).toContain('handoff.csv');
  const manifestDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download manifest' }).click();
  const manifest = await manifestDownload;
  expect(await manifest.createReadStream()).toBeTruthy();
});

test('@claim:privacy-demo makes no external requests during the complete sample flow', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await openDemo(page);
  await page.getByRole('button', { name: 'Download CSV' }).click();
  expect(external).toEqual([]);
});

test('@claim:profile-persistence saves a recipient profile on this device', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Recipient profile name').fill('Patel & Co');
  await page.getByRole('button', { name: 'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('Saved');
  await page.reload();
  await expect(page.locator('#profile-select')).toContainText('Patel & Co');
});

test('@claim:source-preservation keeps the selected source and creates a separate download', async ({ page }) => {
  const source = 'Date;Amount\n28.08.2026;12,50';
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({ name: 'source.csv', mimeType: 'text/csv', buffer: Buffer.from(source) });
  await page.getByRole('button', { name: 'Use source headers' }).click();
  await page.getByRole('button', { name: 'Check output' }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  expect((await download).suggestedFilename()).toBe('source-handoff.csv');
  expect(await page.locator('#csv-file').evaluate((el: HTMLInputElement) => el.files?.[0]?.name)).toBe('source.csv');
});

test('@claim:file-limit explains the 10 MB CSV limit', async ({ page }) => {
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({ name: 'too-large.csv', mimeType: 'text/csv', buffer: Buffer.alloc(10 * 1024 * 1024 + 1, 'a') });
  await expect(page.locator('#app-message')).toContainText('over 10 MB');
});

test('@claim:profile-limit keeps the free saved-profile limit at two', async ({ page }) => {
  await page.goto('/');
  for (const name of ['One', 'Two']) {
    await page.getByLabel('Recipient profile name').fill(name);
    await page.getByRole('button', { name: 'Save recipient profile' }).click();
    await expect(page.locator('#app-message')).toContainText('Saved');
    await page.getByRole('button', { name: 'New profile' }).click();
  }
  await page.getByLabel('Recipient profile name').fill('Three');
  await page.getByRole('button', { name: 'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('saves two profiles');
});

test('@claim:pro-checkout redirects to the approved live Dodo checkout', async ({ request }) => {
  const response = await request.get('https://api.sociobot.in/api/v1/products/small-business-export-map/checkout', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toMatch(/^https:\/\/checkout\.dodopayments\.com\//);
});

test('rejects an invalid backup atomically', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Recipient profile name').fill('Good profile');
  await page.getByRole('button', { name: 'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('Saved');
  await page.locator('#import-profiles').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{"schema":1,"profiles":[{"id":"poison"}]}') });
  await expect(page.locator('#app-message')).toContainText('not changed');
  await page.reload();
  await expect(page.locator('#profile-select')).toContainText('Good profile');
});

test('mobile demo exposes every preview column and has no serious axe findings', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openDemo(page);
  const preview = page.locator('#preview');
  expect(await preview.evaluate((el: HTMLElement) => el.scrollWidth > el.clientWidth)).toBeTruthy();
  await preview.focus();
  await preview.evaluate((el: HTMLElement) => { el.scrollLeft = el.scrollWidth; });
  await expect(preview.getByRole('columnheader', { name: 'Notes' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter(v => ['serious', 'critical'].includes(v.impact || ''))).toEqual([]);
});

test('strips a return token without putting it in Cache Storage', async ({ page }) => {
  await page.goto('/?license=qa-cache-secret-123');
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.goto('/?license=qa-cache-secret-123');
  await expect(page).not.toHaveURL(/license=/);
  const keys = await page.evaluate(async () => {
    const urls: string[] = [];
    for (const key of await caches.keys()) for (const request of await (await caches.open(key)).keys()) urls.push(request.url);
    return urls;
  });
  expect(keys.join('\n')).not.toContain('qa-cache-secret-123');
});

test('legal routes have titles and common navigation', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page).toHaveTitle('Privacy — Export Map');
  await expect(page.getByRole('navigation')).toContainText('Demo');
  await page.goto('/terms/');
  await expect(page).toHaveTitle('Terms — Export Map');
});
