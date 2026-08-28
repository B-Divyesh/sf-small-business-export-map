import { readFile } from 'node:fs/promises';
import { expect, test, type Download, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function downloadText(download: Download): Promise<string> {
  const path = await download.path();
  if (!path) throw new Error('Download had no local path');
  return readFile(path, 'utf8');
}

async function openDemo(page: Page) {
  await page.goto('/demo');
  await expect(page.getByRole('complementary', { name: 'Demo mode' })).toContainText('nothing is saved');
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await expect(page.getByText('CSV and change record are ready')).toBeVisible();
}

async function saveProfile(page: Page, name: string) {
  await page.getByLabel('Recipient profile name').fill(name);
  await page.getByRole('button', { name: 'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('Saved');
}

test('@claim:demo-isolation opens a finished sample and never changes real profiles', async ({ page }) => {
  await page.goto('/');
  await saveProfile(page, 'Real accountant');
  await expect(page.locator('#app-message')).toContainText('Saved');
  await page.goto('/demo');
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.locator('#profile-select')).toContainText('Patel & Co monthly import');
  const databases = await page.evaluate(async () => (await indexedDB.databases()).map(db => db.name));
  expect(databases).toEqual(expect.arrayContaining(['export-map', 'demo:export-map']));
  await page.getByRole('link', { name: 'Start for real' }).click();
  await expect(page.locator('#profile-select')).toContainText('Real accountant');
});

test('@claim:offline-demo reloads the finished sample after the first visit', async ({ page, context }) => {
  await openDemo(page);
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Check output' })).toBeVisible();
  await expect(page.locator('#network-status')).toContainText('Offline');
});

test('@claim:csv-change-record downloads complete transformed CSV and change evidence', async ({ page }) => {
  await openDemo(page);
  const csvEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download CSV' }).click();
  const csvDownload = await csvEvent;
  expect(csvDownload.suggestedFilename()).toBe('august-invoices-prepared.csv');
  const csv = (await downloadText(csvDownload)).replace(/^\uFEFF/, '');
  const lines = csv.trim().split(/\r?\n/);
  expect(lines[0]).toBe('Invoice date,Client name,Net amount,VAT rate,Invoice reference,Notes');
  expect(lines).toHaveLength(4);
  expect(lines[1]).toContain('2026-08-28,River & Pine,1250.50,20,INV-1042');
  expect(lines[3]).toContain('2026-08-30,Moss Café,78.25,0,INV-1044');
  const recordEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download change record' }).click();
  const record = JSON.parse(await downloadText(await recordEvent));
  expect(record.source).toMatchObject({ fileName:'august-invoices.csv', rows:3, columns:['Invoice date','Customer','Net amount','VAT rate','Reference','Notes'] });
  expect(record.source.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(record.fieldMap).toHaveLength(6);
  expect(record.checks).toEqual(expect.arrayContaining([expect.objectContaining({ title:'Ready to download' })]));
  expect(record.transformations.length).toBeGreaterThanOrEqual(4);
  expect(record.transformations.every((item: { reversible:string }) => item.reversible.length > 10)).toBe(true);
});

test('@claim:privacy-demo keeps the complete sample flow same-origin', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await openDemo(page);
  for (const name of ['Download CSV', 'Download change record']) {
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name }).click({ force:true });
    await event;
  }
  await page.getByRole('button', { name:'Reset demo' }).click();
  expect(external).toEqual([]);
});

test('@claim:privacy-real-workflow keeps a real CSV flow same-origin', async ({ page }) => {
  await page.emulateMedia({ reducedMotion:'reduce' });
  const external: string[] = [];
  const requests: Array<{method:string;body:string|null}> = [];
  page.on('request', request => {
    requests.push({method:request.method(),body:request.postData()});
    if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url());
  });
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({ name:'real.csv', mimeType:'text/csv', buffer:Buffer.from('Date,Amount\n2026-08-28,12.50') });
  await page.getByRole('button', { name:'Use source headers' }).click();
  await page.getByRole('button', { name:'Check output' }).click();
  for (const name of ['Download CSV', 'Download change record']) {
    const event = page.waitForEvent('download');
    await page.getByRole('button', { name }).click({ force:true });
    await event;
  }
  expect(external).toEqual([]);
  expect(requests.every(request=>request.method==='GET'&&request.body===null)).toBe(true);
  expect(requests.some(request=>request.body?.includes('12.50'))).toBe(false);
});

test('@claim:profile-persistence saves a recipient profile in IndexedDB across reloads', async ({ page }) => {
  await page.goto('/');
  await saveProfile(page, 'Patel & Co');
  await expect(page.locator('#app-message')).toContainText('Saved');
  await page.reload();
  await expect(page.locator('#profile-select')).toContainText('Patel & Co');
  const stored = await page.evaluate(async () => await new Promise<any[]>((resolve, reject) => { const open=indexedDB.open('export-map'); open.onsuccess=()=>{const get=open.result.transaction('profiles').objectStore('profiles').getAll();get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);};open.onerror=()=>reject(open.error); }));
  expect(stored.map(profile => profile.name)).toContain('Patel & Co');
});

test('@claim:source-preservation leaves the selected bytes and name unchanged', async ({ page }) => {
  const source = 'Date;Amount\n28.08.2026;12,50';
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({ name:'source.csv', mimeType:'text/csv', buffer:Buffer.from(source) });
  await page.getByRole('button', { name:'Use source headers' }).click();
  await page.getByRole('button', { name:'Check output' }).click();
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name:'Download CSV' }).click();
  expect((await event).suggestedFilename()).toBe('source-prepared.csv');
  const selected = await page.locator('#csv-file').evaluate(async (el: HTMLInputElement) => ({ name:el.files?.[0]?.name, text:await el.files?.[0]?.text() }));
  expect(selected).toEqual({ name:'source.csv', text:source });
  await page.reload();
  expect(await page.locator('#csv-file').evaluate((el:HTMLInputElement)=>el.files?.length)).toBe(0);
});

test('@claim:file-limit accepts exactly 10 MB and rejects 10 MB plus one byte', async ({ page }) => {
  const limit = 10 * 1024 * 1024;
  const prefix = Buffer.from('Notes\n"');
  const suffix = Buffer.from('"\n');
  const exact = Buffer.concat([prefix, Buffer.alloc(limit-prefix.length-suffix.length, 'x'), suffix]);
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({ name:'exact.csv', mimeType:'text/csv', buffer:exact });
  await expect(page.locator('#file-summary')).toContainText('1 records', { timeout:30_000 });
  await page.locator('#csv-file').setInputFiles({ name:'too-large.csv', mimeType:'text/csv', buffer:Buffer.alloc(limit+1, 'a') });
  await expect(page.locator('#app-message')).toContainText('over 10 MB');
});

test('@claim:profile-limit keeps the free saved-profile limit at two', async ({ page }) => {
  await page.goto('/');
  for (const name of ['One','Two']) { await saveProfile(page,name); await expect(page.locator('#app-message')).toContainText('Saved'); await page.getByRole('button',{name:'Create recipient profile'}).click(); }
  await page.getByLabel('Recipient profile name').fill('Three');
  await page.getByRole('button', { name:'Save recipient profile' }).click();
  await expect(page.locator('#app-message')).toContainText('saves two profiles');
  await expect(page.locator('#profile-select option')).toHaveCount(3);
});

test('@claim:no-accounting-inference leaves ambiguous tax data unchanged until the user maps it', async ({ page }) => {
  await openDemo(page);
  await page.getByRole('button',{name:'Create recipient profile'}).click();
  await expect(page.locator('#mapping-body tr')).toHaveCount(0);
  await page.locator('#csv-file').setInputFiles({
    name:'ambiguous-tax.csv',
    mimeType:'text/csv',
    buffer:Buffer.from('VAT,Tax code,Amount\n20,A20,20'),
  });
  await expect(page.getByText('You choose the accounting meaning.').first()).toBeVisible();
  await page.getByRole('button',{name:'Use source headers'}).click();
  await expect(page.locator('#mapping-body tr')).toHaveCount(3);
  expect(await page.locator('#mapping-body [data-key="target"]').evaluateAll(inputs=>inputs.map(input=>(input as HTMLInputElement).value))).toEqual(['VAT','Tax code','Amount']);
  expect(await page.locator('#mapping-body [data-key="kind"]').evaluateAll(selects=>selects.map(select=>(select as HTMLSelectElement).value))).toEqual(['text','text','text']);
  await page.getByRole('button',{name:'Check output'}).click();
  expect(await page.locator('#preview tbody tr').first().locator('td').allTextContents()).toEqual(['20','A20','20']);
  const event=page.waitForEvent('download');
  await page.getByRole('button',{name:'Download CSV'}).click();
  expect((await downloadText(await event)).replace(/^\uFEFF/,'').trim()).toBe('VAT,Tax code,Amount\r\n20,A20,20');
});

test('@claim:preview-full-download caps preview at eight and downloads every row once', async ({ page }) => {
  const rows=Array.from({length:11},(_,i)=>`ROW-${i+1}`).join('\n');
  await page.goto('/');
  await page.locator('#csv-file').setInputFiles({name:'eleven.csv',mimeType:'text/csv',buffer:Buffer.from(`ID\n${rows}`)});
  await page.getByRole('button',{name:'Use source headers'}).click();
  await page.getByRole('button',{name:'Check output'}).click();
  await expect(page.locator('#preview tbody tr')).toHaveCount(8);
  const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download CSV'}).click();
  const lines=(await downloadText(await event)).replace(/^\uFEFF/,'').trim().split(/\r?\n/);
  expect(lines).toHaveLength(12);expect(new Set(lines.slice(1)).size).toBe(11);expect(lines.at(-1)).toBe('ROW-11');
});

test('@claim:profile-backup round-trips every profile field and keeps demo storage separate', async ({ page }) => {
  await page.goto('/');
  for (const name of ['One accountant','Two accountant']) { await saveProfile(page,name); await page.getByRole('button',{name:'Create recipient profile'}).click(); }
  const event=page.waitForEvent('download');await page.getByRole('button',{name:'Export profiles'}).click();
  const backup=await downloadText(await event);const exported=JSON.parse(backup);
  expect(exported.profiles).toHaveLength(2);
  let optionCount=3;
  for (const name of ['Two accountant','One accountant']) { await page.locator('#profile-select').selectOption({label:name});page.once('dialog',dialog=>dialog.accept());await page.getByRole('button',{name:'Delete profile'}).click();optionCount-=1;await expect(page.locator('#profile-select option')).toHaveCount(optionCount); }
  await expect(page.locator('#profile-select option')).toHaveCount(1);
  await page.locator('#import-profiles').setInputFiles({name:'profiles.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await expect(page.locator('#profile-select')).toContainText('One accountant');
  await page.goto('/demo');
  await page.locator('#import-profiles').setInputFiles({name:'profiles.json',mimeType:'application/json',buffer:Buffer.from(backup)});
  await expect(page.locator('#profile-select')).toContainText('Two accountant');
  await page.goto('/');
  await expect(page.locator('#profile-select')).toContainText('One accountant');
  const restored=await page.evaluate(async()=>await new Promise<any[]>((resolve,reject)=>{const open=indexedDB.open('export-map');open.onsuccess=()=>{const get=open.result.transaction('profiles').objectStore('profiles').getAll();get.onsuccess=()=>resolve(get.result);get.onerror=()=>reject(get.error);};open.onerror=()=>reject(open.error);}));
  expect(restored.sort((a,b)=>a.name.localeCompare(b.name))).toEqual(exported.profiles.sort((a:any,b:any)=>a.name.localeCompare(b.name)));
});

test('@claim:checkout-host sends the US$19 one-time purchase to Sociobot/Dodo', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'Save unlimited recipient profiles'})).toBeVisible();
  await expect(page.locator('#pro')).toContainText('one-time US$19');
  await expect(page.locator('#pro')).toContainText('Sociobot/Dodo takes payment and handles receipts and refunds');
  const response=await request.get('https://api.sociobot.in/api/v1/products/small-business-export-map/checkout',{maxRedirects:0});
  expect(response.status()).toBe(303);const location=response.headers().location;expect(location).toMatch(/^https:\/\/checkout\.dodopayments\.com\//);
  const checkout=await request.get(location);const checkoutHtml=await checkout.text();expect(checkoutHtml).toContain('Small Business Export Map');expect(checkoutHtml).toContain('$19.00');expect(checkoutHtml).toContain('One-time unlock');expect(checkoutHtml).toContain('Sociobot | Checkout');
});

test('@claim:pro-license stores and strips a token, caches for 24 hours, unlocks extra profiles, and relocks when revoked', async ({ page }) => {
  let checks=0;
  await page.route('https://api.sociobot.in/api/v1/products/small-business-export-map/verify**',async route=>{checks+=1;const valid=!route.request().url().includes('revoked-fixture');await route.fulfill({json:{valid,reason:valid?'ok':'revoked',expires_at:null}});});
  await page.goto('/?license=valid-fixture');
  await expect(page).not.toHaveURL(/license=/);await expect(page.locator('#license-notice')).toContainText('Pro is active');
  expect(await page.evaluate(()=>localStorage.getItem('sb_license:small-business-export-map'))).toBe('valid-fixture');
  for (const name of ['One','Two','Three']) { await saveProfile(page,name); await expect(page.locator('#app-message')).toContainText('Saved'); await page.getByRole('button',{name:'Create recipient profile'}).click(); }
  expect(checks).toBe(1);await page.reload();await expect(page.locator('#license-notice')).toContainText('Pro is active');expect(checks).toBe(1);
  await page.getByPlaceholder('Paste a license token').fill('revoked-fixture');await page.getByRole('button',{name:'Restore purchase'}).click();
  await expect(page.locator('#license-notice')).toContainText('not active');expect(checks).toBe(2);
  await page.getByRole('button',{name:'Create recipient profile'}).click();await page.getByLabel('Recipient profile name').fill('Four');await page.getByRole('button',{name:'Save recipient profile'}).click();await expect(page.locator('#app-message')).toContainText('saves two profiles');
  const cacheKeys=await page.evaluate(async()=>{const urls:string[]=[];for(const key of await caches.keys())for(const req of await(await caches.open(key)).keys())urls.push(req.url);return urls;});
  expect(cacheKeys.join('\n')).not.toContain('valid-fixture');
});

test('@claim:template-import reads accountant headers in order, saves only to demo storage, and makes no external request', async ({ page }) => {
  await page.goto('/');await saveProfile(page,'Real profile');
  const external:string[]=[];page.on('request',request=>{if(!request.url().startsWith('http://127.0.0.1:4173'))external.push(request.url());});
  await page.goto('/demo');
  await page.locator('#template-file').setInputFiles({name:'monthly-template.csv',mimeType:'text/csv',buffer:Buffer.from('Reference,Invoice date,Client name,Net amount\n,,,')});
  await expect(page.locator('#app-message')).toContainText('Imported 4 accountant columns');
  await expect(page.locator('#mapping-body [data-key="target"]')).toHaveCount(4);
  expect(await page.locator('#mapping-body [data-key="target"]').evaluateAll(inputs=>inputs.map(input=>(input as HTMLInputElement).value))).toEqual(['Reference','Invoice date','Client name','Net amount']);
  await page.goto('/');await expect(page.locator('#profile-select')).toContainText('Real profile');expect(external).toEqual([]);
});

test('demo banner stays visible with reset and exit controls throughout the mobile workspace', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});await openDemo(page);await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));
  const banner=page.getByRole('complementary',{name:'Demo mode'});await expect(banner).toBeInViewport();await expect(page.getByRole('button',{name:'Reset demo'})).toBeInViewport();await expect(page.getByRole('link',{name:'Start for real'})).toBeInViewport();
});

test('routes return real statuses, complete metadata, valid links, and restore h1 focus', async ({ page, request }) => {
  const browserErrors:string[]=[];page.on('console',message=>{if(message.type()==='error')browserErrors.push(message.text());});page.on('pageerror',error=>browserErrors.push(error.message));
  const routes=[['/','Export Map — prepare CSVs for your accountant','https://small-business-export-map.sociobot.in/'],['/demo','Demo — Export Map','https://small-business-export-map.sociobot.in/demo'],['/privacy/','Privacy — Export Map','https://small-business-export-map.sociobot.in/privacy/'],['/terms/','Terms — Export Map','https://small-business-export-map.sociobot.in/terms/']];
  for(const [path,title,canonical] of routes){const response=await page.goto(path);expect(response?.status()).toBe(200);await expect(page).toHaveTitle(title);await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',canonical);await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content',canonical);await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content',title);await expect(page.locator('h1')).toBeFocused();expect(await page.locator('header .brand-mark').count()).toBe(1);await expect(page.locator('footer')).toContainText('build polish-4');}
  await page.goto('/?demo=1');await expect(page).toHaveTitle('Demo — Export Map');await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://small-business-export-map.sociobot.in/demo');
  expect(browserErrors).toEqual([]);browserErrors.length=0;
  const missing=await page.goto('/missing-review-route');expect(missing?.status()).toBe(404);await expect(page).toHaveTitle('Page not found — Export Map');await expect(page.getByRole('heading',{name:'This page does not exist.'})).toBeFocused();await expect(page.getByRole('link',{name:'Prepare a CSV'})).toHaveAttribute('href','/#workspace');
  await page.goto('/privacy/');await page.getByRole('link',{name:'Terms'}).first().click();await expect(page.locator('h1')).toBeFocused();await page.goBack();await expect(page.locator('h1')).toBeFocused();
  expect((await request.get('/sitemap.xml')).ok()).toBe(true);expect(await (await request.get('/sitemap.xml')).text()).toContain('/demo');
  for(const path of ['/','/demo','/privacy/','/terms/','/missing-review-route']){await page.goto(path);const hrefs=await page.locator('a[href]').evaluateAll(links=>[...new Set(links.map(link=>(link as HTMLAnchorElement).getAttribute('href')||'').filter(href=>href.startsWith('/'))) ]);for(const href of hrefs){const url=new URL(href,'http://127.0.0.1:4173');expect((await request.get(url.pathname)).status(),`${path} → ${href}`).toBe(200);if(url.hash){await page.goto(href);await expect(page.locator(url.hash)).toHaveCount(1);}}}
  expect(browserErrors.filter(error=>!error.startsWith('Failed to load resource: the server responded with a status of 404'))).toEqual([]);
});

test('mobile routes, six-column preview, and 200% text have no serious accessibility defects', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  for(const path of ['/','/demo','/privacy/','/terms/','/missing-review-route']){await page.goto(path);if(path==='/demo'){const preview=page.locator('#preview');expect(await preview.evaluate((el:HTMLElement)=>el.scrollWidth>el.clientWidth)).toBe(true);await preview.focus();await preview.evaluate((el:HTMLElement)=>{el.scrollLeft=el.scrollWidth;});await expect(preview.getByRole('columnheader',{name:'Notes'})).toBeVisible();}const results=await new AxeBuilder({page}).analyze();expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||''))).toEqual([]);}
  await page.goto('/');await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});const overflow=await page.evaluate(()=>[...document.querySelectorAll('*')].filter(element=>{const rect=element.getBoundingClientRect();return (rect.left < -1 || rect.right > document.documentElement.clientWidth + 1) && !element.closest('.mapping-wrap,.preview');}).length);expect(overflow).toBe(0);
});

test('rejects an invalid backup atomically and accepts a long quoted field', async ({ page }) => {
  await page.goto('/');await saveProfile(page,'Good profile');
  await page.locator('#import-profiles').setInputFiles({name:'broken.json',mimeType:'application/json',buffer:Buffer.from('{"schema":1,"profiles":[{"id":"poison"}]}')});
  await expect(page.locator('#app-message')).toContainText('not changed');await page.reload();await expect(page.locator('#profile-select')).toContainText('Good profile');
  await page.locator('#csv-file').setInputFiles({name:'long.csv',mimeType:'text/csv',buffer:Buffer.from(`ID,Notes\n1,"${'x'.repeat(70_000)}"`)});await expect(page.locator('#file-summary')).toContainText('2 columns');
});
