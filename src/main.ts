import './style.css';
import './a11y.css';
import { delimiterLabel, parseCsv, transformCsv } from './csv';
import { deleteProfile, listProfiles, putProfile, replaceProfiles } from './db';
import type { DateFormat, DecimalMark, Delimiter, Mapping, ParsedCsv, RecipientProfile, TransformResult } from './types';

const SLUG = 'small-business-export-map';
const API_BASE = 'https://api.sociobot.in/api/v1';
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERIFY_KEY = `${LICENSE_KEY}:verified`;
const FREE_PROFILE_LIMIT = 2;

const app = document.querySelector<HTMLDivElement>('#app')!;
let profiles: RecipientProfile[] = [];
let profile = blankProfile();
let parsed: ParsedCsv | null = null;
let activeFile: File | null = null;
let fileHash = '';
let result: TransformResult | null = null;
let isPro = false;

function blankProfile(): RecipientProfile {
  return { id: crypto.randomUUID(), name: '', delimiter: ',', sourceDecimal: '.', outputDecimal: '.', sourceDate: 'YYYY-MM-DD', outputDate: 'YYYY-MM-DD', protectFormulas: false, mappings: [], updatedAt: new Date().toISOString() };
}

function esc(value: unknown): string {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function option(value: string, label: string, selected: string): string {
  return `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(label)}</option>`;
}

app.innerHTML = `
  <header class="site-header">
    <a class="brand" href="/" aria-label="Export Map home"><span class="brand-mark" aria-hidden="true">↗</span> Export Map</a>
    <div class="header-tools"><span id="network-status" class="status-pill"><span class="status-dot"></span><span>Ready offline</span></span><a class="small-link" href="#pro">Get Pro</a></div>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="page-title">
      <div><p class="eyebrow">Private CSV preflight</p><h1 id="page-title">Make the handoff fit.</h1><p class="hero-copy">Map your admin export to the columns, separators, and dates your accountant actually asked for—then send the CSV with a plain record of every change.</p><a class="button primary" href="#workspace">Check a CSV <span aria-hidden="true">↓</span></a><ul class="trust-line"><li>Files stay here</li><li>Originals untouched</li><li>Works offline</li></ul></div>
      <figure class="hero-art"><picture><source media="(max-width: 800px)" srcset="/assets/export-route-768.webp"><img src="/assets/export-route-1280.webp" width="1280" height="853" alt="A tactile paper collage showing scattered data cells following a blue route into a checked handoff packet" fetchpriority="high" decoding="async"></picture><figcaption class="art-note">From loose fields to a documented route. Original AI-assisted risograph artwork.</figcaption></figure>
    </section>
    <div class="route-wrap" aria-label="Workflow"><ol class="route"><li>1. Open file</li><li>2. Choose recipient</li><li>3. Map fields</li><li>4. Review</li><li>5. Download</li></ol></div>
    <section class="workspace" id="workspace" aria-labelledby="workspace-title">
      <div class="workspace-heading"><div><p class="eyebrow">Working table</p><h2 id="workspace-title">Preflight a handoff</h2></div><p>No upload leaves this browser. Start with a copy of your source CSV; Export Map never overwrites it.</p></div>
      <div id="app-message" aria-live="polite"></div>
      <div class="work-grid">
        <section class="panel" aria-labelledby="file-title"><h3 class="step-title" id="file-title"><span class="step-number">1</span> Open your source</h3><div class="dropzone" id="dropzone"><label for="csv-file"><span class="drop-icon" aria-hidden="true">↳</span><strong>Choose or drop a CSV</strong><span>Up to 10 MB · CSV or text</span></label><input id="csv-file" type="file" accept=".csv,text/csv,text/plain"></div><div id="file-summary"></div></section>
        <section class="panel" aria-labelledby="profile-title"><h3 class="step-title" id="profile-title"><span class="step-number">2</span> Declare the recipient</h3><div class="profile-bar"><select id="profile-select" aria-label="Saved recipient profile"></select><button class="button" id="new-profile" type="button">New profile</button></div><div class="field"><label for="profile-name">Recipient profile name</label><input id="profile-name" maxlength="80" autocomplete="off" placeholder="e.g. Patel & Co quarterly import"></div><div class="settings"><div class="field"><label for="delimiter">Output delimiter</label><select id="delimiter">${option(',', 'Comma (,)', ',')}${option(';', 'Semicolon (;)', ',')}${option('\t', 'Tab', ',')}${option('|', 'Pipe (|)', ',')}</select></div><div class="field"><label for="source-decimal">Source decimal mark</label><select id="source-decimal">${option('.', 'Point (1.25)', '.')}${option(',', 'Comma (1,25)', '.')}</select></div><div class="field"><label for="output-decimal">Output decimal mark</label><select id="output-decimal">${option('.', 'Point (1.25)', '.')}${option(',', 'Comma (1,25)', '.')}</select></div><div></div><div class="field"><label for="source-date">Source date format</label><select id="source-date"></select></div><div class="field"><label for="output-date">Output date format</label><select id="output-date"></select></div></div><div class="check-field"><input type="checkbox" id="protect-formulas"><label for="protect-formulas"><strong>Protect formula-like values</strong><br><span class="muted">Explicitly prefix cells beginning =, +, or @ with an apostrophe for spreadsheet handoff.</span></label></div><div class="button-row"><button type="button" class="button primary" id="save-profile">Save recipient</button><button type="button" class="button danger" id="delete-profile">Delete</button><button type="button" class="button" id="export-profiles">Export profiles</button><label class="button" for="import-profiles">Import profiles</label><input class="sr-only" type="file" id="import-profiles" accept="application/json"></div><p class="muted" id="profile-limit"></p></section>
      </div>
      <hr class="divider">
      <section aria-labelledby="map-title"><h3 class="step-title" id="map-title"><span class="step-number">3</span> Map recipient columns</h3><p>Only assign a number or date format when the recipient has declared it. Export Map never guesses accounting meaning.</p><div class="button-row"><button class="button" type="button" id="add-mapping">Add recipient column</button><button class="button" type="button" id="copy-headers">Use source headers</button></div><div class="mapping-wrap"><table><thead><tr><th scope="col">Recipient column</th><th scope="col">Source column</th><th scope="col">Treat as</th><th scope="col">Required</th><th scope="col"><span class="sr-only">Remove</span></th></tr></thead><tbody id="mapping-body"></tbody></table><div id="empty-map" class="empty-map">Add the columns your recipient expects, or open a file and use its headers.</div></div><div class="button-row"><button class="button primary" type="button" id="run-review">Run preflight</button></div></section>
      <section class="review" id="review" aria-labelledby="review-title" hidden><h3 class="step-title" id="review-title"><span class="step-number">4</span> Review every change</h3><div class="review-grid"><div><h4>Checks</h4><ul id="checks" class="check-list"></ul><h4>Transformation record</h4><ol id="changes" class="change-list"></ol></div><div><h4>Output preview</h4><div id="preview" class="preview"></div><p class="muted">Preview shows up to 8 rows. Your full file is included in the download.</p></div></div><div id="download-panel"></div></section>
    </section>
    <section class="pro" id="pro" aria-labelledby="pro-title"><div class="pro-card"><div><p class="eyebrow">One-time unlock</p><h2 id="pro-title">Keep every recipient route</h2><p>The free version saves two recipient profiles and always includes CSV export, manifests, offline use, and profile backup. Export Map Pro unlocks unlimited saved profiles for a one-time US$19 purchase.</p><div id="license-notice" aria-live="polite"></div><div class="restore"><input id="license-input" aria-label="License token" placeholder="Paste a license token"><button class="button" id="restore-license" type="button">Restore purchase</button></div><p><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · Sociobot/Dodo is the merchant of record.</p></div><div><div class="price">US$19</div><a class="button primary" href="${API_BASE}/products/${SLUG}/checkout">Buy Pro</a></div></div></section>
  </main>
  <footer class="site-footer"><div><strong>Export Map</strong><br>Private, local-first export hygiene.</div><nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav><div>Artwork generated for this product · © 2026 Sociobot</div></footer>
  <div class="toast" id="update-toast" hidden><strong>Update available</strong><br>Reload for the latest Export Map.<br><button class="button" id="apply-update">Reload app</button></div>`;

const dateFormats: DateFormat[] = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY', 'DD.MM.YYYY'];
for (const id of ['source-date', 'output-date']) (document.querySelector<HTMLSelectElement>(`#${id}`)!).innerHTML = dateFormats.map((format) => option(format, format, 'YYYY-MM-DD')).join('');

function syncForm(): void {
  (document.querySelector('#profile-name') as HTMLInputElement).value = profile.name;
  (document.querySelector('#delimiter') as HTMLSelectElement).value = profile.delimiter;
  (document.querySelector('#source-decimal') as HTMLSelectElement).value = profile.sourceDecimal;
  (document.querySelector('#output-decimal') as HTMLSelectElement).value = profile.outputDecimal;
  (document.querySelector('#source-date') as HTMLSelectElement).value = profile.sourceDate;
  (document.querySelector('#output-date') as HTMLSelectElement).value = profile.outputDate;
  (document.querySelector('#protect-formulas') as HTMLInputElement).checked = profile.protectFormulas;
  const select = document.querySelector<HTMLSelectElement>('#profile-select')!;
  select.innerHTML = `<option value="">${profiles.length ? 'Choose a saved recipient…' : 'No saved recipients yet'}</option>${profiles.map((item) => option(item.id, item.name, profile.id)).join('')}`;
  select.value = profiles.some((item) => item.id === profile.id) ? profile.id : '';
  document.querySelector('#profile-limit')!.textContent = isPro ? `Pro active · ${profiles.length} profiles saved on this device.` : `${profiles.length} of ${FREE_PROFILE_LIMIT} free recipient profiles saved on this device.`;
  renderMappings();
}

function readForm(): void {
  profile.name = (document.querySelector('#profile-name') as HTMLInputElement).value.trim();
  profile.delimiter = (document.querySelector('#delimiter') as HTMLSelectElement).value as Delimiter;
  profile.sourceDecimal = (document.querySelector('#source-decimal') as HTMLSelectElement).value as DecimalMark;
  profile.outputDecimal = (document.querySelector('#output-decimal') as HTMLSelectElement).value as DecimalMark;
  profile.sourceDate = (document.querySelector('#source-date') as HTMLSelectElement).value as DateFormat;
  profile.outputDate = (document.querySelector('#output-date') as HTMLSelectElement).value as DateFormat;
  profile.protectFormulas = (document.querySelector('#protect-formulas') as HTMLInputElement).checked;
}

function renderMappings(): void {
  const body = document.querySelector('#mapping-body')!;
  body.innerHTML = profile.mappings.map((mapping) => `<tr data-id="${esc(mapping.id)}"><td><label class="sr-only" for="target-${esc(mapping.id)}">Recipient column</label><input id="target-${esc(mapping.id)}" data-key="target" value="${esc(mapping.target)}" placeholder="Required header"></td><td><label class="sr-only" for="source-${esc(mapping.id)}">Source column for ${esc(mapping.target || 'new field')}</label><select id="source-${esc(mapping.id)}" data-key="source"><option value="">Not mapped</option>${(parsed?.headers ?? []).map((header) => option(header, header, mapping.source)).join('')}</select></td><td><label class="sr-only" for="kind-${esc(mapping.id)}">Format for ${esc(mapping.target || 'new field')}</label><select id="kind-${esc(mapping.id)}" data-key="kind">${option('text', 'Text / unchanged', mapping.kind)}${option('number', 'Number', mapping.kind)}${option('date', 'Date', mapping.kind)}</select></td><td><label><input data-key="required" type="checkbox"${mapping.required ? ' checked' : ''}> <span class="sr-only">Required</span></label></td><td><button type="button" class="icon-button remove-mapping" aria-label="Remove ${esc(mapping.target || 'recipient column')}">×</button></td></tr>`).join('');
  document.querySelector('#empty-map')!.toggleAttribute('hidden', profile.mappings.length > 0);
}

function message(text: string, kind: 'error' | 'success' | 'notice' = 'notice'): void {
  document.querySelector('#app-message')!.innerHTML = `<div class="notice ${kind}"><p>${esc(text)}</p></div>`;
}

async function handleFile(file: File): Promise<void> {
  if (file.size > 10 * 1024 * 1024) { message('That file is over 10 MB. Split it into smaller handoffs and try again.', 'error'); return; }
  try {
    const text = await file.text();
    parsed = parseCsv(text);
    activeFile = file;
    result = null;
    fileHash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', await file.arrayBuffer()))).map((byte) => byte.toString(16).padStart(2, '0')).join('');
    document.querySelector('#file-summary')!.innerHTML = `<div class="file-card"><strong>${esc(file.name)}</strong><div class="file-stats"><span>${parsed.rows.length.toLocaleString()} records</span><span>${parsed.headers.length} columns</span><span>${esc(delimiterLabel(parsed.delimiter))}</span><span>${(file.size / 1024).toFixed(1)} KB</span></div></div>`;
    document.querySelector('#review')!.toggleAttribute('hidden', true);
    renderMappings();
    message(`Read ${file.name} locally. Now confirm the recipient map.`, 'success');
  } catch (error) { parsed = null; activeFile = null; document.querySelector('#file-summary')!.innerHTML = ''; message(error instanceof Error ? error.message : 'The CSV could not be read.', 'error'); }
}

function updateMapping(target: HTMLElement): void {
  const row = target.closest<HTMLTableRowElement>('tr[data-id]');
  if (!row) return;
  const mapping = profile.mappings.find((item) => item.id === row.dataset.id);
  const key = target.dataset.key as keyof Mapping | undefined;
  if (!mapping || !key) return;
  if (target instanceof HTMLInputElement && target.type === 'checkbox') mapping.required = target.checked;
  else if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) Object.assign(mapping, { [key]: target.value });
}

function renderReview(): void {
  if (!parsed) { message('Open a CSV before running the preflight.', 'error'); return; }
  readForm();
  result = transformCsv(parsed, profile);
  const review = document.querySelector<HTMLElement>('#review')!;
  review.hidden = false;
  document.querySelector('#checks')!.innerHTML = result.issues.map((issue) => `<li class="check-item ${issue.level}"><span class="check-icon" aria-hidden="true">${issue.level === 'pass' ? '✓' : issue.level === 'warning' ? '!' : '×'}</span><div><strong>${esc(issue.title)}</strong><p>${esc(issue.detail)}</p></div></li>`).join('');
  document.querySelector('#changes')!.innerHTML = result.changes.map((change) => `<li><strong>${esc(change.action)}</strong><span class="badge">${change.affected.toLocaleString()} affected</span><p>Reverse: ${esc(change.reversible)}</p></li>`).join('');
  const active = profile.mappings.filter((mapping) => mapping.target.trim());
  document.querySelector('#preview')!.innerHTML = `<table><thead><tr>${active.map((mapping) => `<th scope="col">${esc(mapping.target)}</th>`).join('')}</tr></thead><tbody>${result.rows.slice(0, 8).map((row) => `<tr>${row.map((value) => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  const hasErrors = result.issues.some((issue) => issue.level === 'error');
  document.querySelector('#download-panel')!.innerHTML = hasErrors ? `<div class="notice error"><strong>Downloads are paused.</strong><p>Fix the errors above and run the preflight again. Your source file is unchanged.</p></div>` : `<div class="download-panel"><h3>Handoff packet ready</h3><p>Download the reshaped CSV and its manifest together. The manifest records the source fingerprint, field map, checks, every transformation, and how to reverse it.</p><div class="button-row"><button class="button primary" id="download-csv" type="button">Download CSV</button><button class="button" id="download-manifest" type="button">Download manifest</button></div></div>`;
  review.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

function download(name: string, content: string, type: string): void {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = Object.assign(document.createElement('a'), { href: url, download: name });
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeBase(): string { return (activeFile?.name.replace(/\.csv$/i, '') || 'export').replace(/[^a-z0-9_-]+/gi, '-'); }

function manifest(): string {
  const active = profile.mappings.filter((mapping) => mapping.target.trim());
  return JSON.stringify({ schema: 'https://small-business-export-map.sociobot.in/manifest/v1', createdAt: new Date().toISOString(), tool: 'Export Map 1.0.0', source: { fileName: activeFile?.name, bytes: activeFile?.size, sha256: fileHash, delimiter: parsed && delimiterLabel(parsed.delimiter), rows: parsed?.rows.length, columns: parsed?.headers }, recipientProfile: { name: profile.name || 'Unsaved recipient', delimiter: delimiterLabel(profile.delimiter), decimal: { source: profile.sourceDecimal, output: profile.outputDecimal }, date: { source: profile.sourceDate, output: profile.outputDate }, formulaProtection: profile.protectFormulas }, fieldMap: active.map((mapping) => ({ recipient: mapping.target, source: mapping.source || null, required: mapping.required, treatment: mapping.kind, conversion: mapping.kind === 'number' ? `${profile.sourceDecimal} → ${profile.outputDecimal}` : mapping.kind === 'date' ? `${profile.sourceDate} → ${profile.outputDate}` : 'unchanged text' })), checks: result?.issues, transformations: result?.changes, reversibility: 'The source file was not changed. Apply each recorded reverse instruction to reconstruct its representation; excluded source columns remain only in the original.' }, null, 2);
}

async function saveProfile(): Promise<void> {
  readForm();
  if (!profile.name) { message('Give this recipient profile a name before saving.', 'error'); (document.querySelector('#profile-name') as HTMLInputElement).focus(); return; }
  const isExisting = profiles.some((item) => item.id === profile.id);
  if (!isExisting && !isPro && profiles.length >= FREE_PROFILE_LIMIT) { message('The free version saves two profiles. Delete one or unlock Pro for unlimited recipients.', 'error'); document.querySelector('#pro')!.scrollIntoView(); return; }
  profile.updatedAt = new Date().toISOString();
  await putProfile(structuredClone(profile));
  profiles = await listProfiles();
  syncForm();
  message(`Saved “${profile.name}” on this device.`, 'success');
}

document.querySelector('#csv-file')!.addEventListener('change', (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) void handleFile(file); });
const dropzone = document.querySelector<HTMLElement>('#dropzone')!;
dropzone.addEventListener('dragover', (event) => { event.preventDefault(); dropzone.classList.add('dragging'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragging'));
dropzone.addEventListener('drop', (event) => { event.preventDefault(); dropzone.classList.remove('dragging'); const file = event.dataTransfer?.files[0]; if (file) void handleFile(file); });
document.querySelector('#mapping-body')!.addEventListener('input', (event) => updateMapping(event.target as HTMLElement));
document.querySelector('#mapping-body')!.addEventListener('change', (event) => updateMapping(event.target as HTMLElement));
document.querySelector('#mapping-body')!.addEventListener('click', (event) => { const button = (event.target as HTMLElement).closest('.remove-mapping'); if (!button) return; const row = button.closest<HTMLTableRowElement>('tr[data-id]'); profile.mappings = profile.mappings.filter((item) => item.id !== row?.dataset.id); renderMappings(); });
document.querySelector('#add-mapping')!.addEventListener('click', () => { profile.mappings.push({ id: crypto.randomUUID(), target: '', source: '', kind: 'text', required: true }); renderMappings(); (document.querySelector('#mapping-body tr:last-child input') as HTMLInputElement)?.focus(); });
document.querySelector('#copy-headers')!.addEventListener('click', () => { if (!parsed) { message('Open a CSV before copying its headers.', 'error'); return; } if (profile.mappings.length && !confirm('Replace the current map with the source headers?')) return; profile.mappings = parsed.headers.map((header) => ({ id: crypto.randomUUID(), target: header, source: header, kind: 'text', required: true })); renderMappings(); });
document.querySelector('#save-profile')!.addEventListener('click', () => void saveProfile());
document.querySelector('#new-profile')!.addEventListener('click', () => { profile = blankProfile(); syncForm(); (document.querySelector('#profile-name') as HTMLInputElement).focus(); });
document.querySelector('#profile-select')!.addEventListener('change', (event) => { const selected = profiles.find((item) => item.id === (event.target as HTMLSelectElement).value); if (selected) { profile = structuredClone(selected); syncForm(); } });
document.querySelector('#delete-profile')!.addEventListener('click', async () => { if (!profiles.some((item) => item.id === profile.id)) { message('This recipient has not been saved.', 'error'); return; } if (!confirm(`Delete “${profile.name}” from this device?`)) return; await deleteProfile(profile.id); profiles = await listProfiles(); profile = blankProfile(); syncForm(); message('Recipient profile deleted. Your active CSV was not changed.', 'success'); });
document.querySelector('#run-review')!.addEventListener('click', renderReview);
document.querySelector('#download-panel')!.addEventListener('click', (event) => { if (!result) return; const id = (event.target as HTMLElement).id; if (id === 'download-csv') download(`${safeBase()}-handoff.csv`, result.csv, 'text/csv;charset=utf-8'); if (id === 'download-manifest') download(`${safeBase()}-manifest.json`, manifest(), 'application/json'); });
document.querySelector('#export-profiles')!.addEventListener('click', () => download(`export-map-profiles-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ schema: 1, exportedAt: new Date().toISOString(), profiles }, null, 2), 'application/json'));
document.querySelector('#import-profiles')!.addEventListener('change', async (event) => { try { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; const data = JSON.parse(await file.text()) as { schema: number; profiles: RecipientProfile[] }; if (data.schema !== 1 || !Array.isArray(data.profiles)) throw new Error(); const allowed = isPro ? data.profiles : data.profiles.slice(0, FREE_PROFILE_LIMIT); await replaceProfiles(allowed); profiles = await listProfiles(); profile = profiles[0] ? structuredClone(profiles[0]) : blankProfile(); syncForm(); message(`Imported ${allowed.length} recipient profile${allowed.length === 1 ? '' : 's'}.`, 'success'); } catch { message('That profile backup is not valid Export Map JSON.', 'error'); } });

function setLicenseUi(note = ''): void {
  document.querySelector('#license-notice')!.innerHTML = isPro ? `<div class="notice success"><strong>Pro is active.</strong><p>Unlimited recipient profiles are unlocked on this device.</p></div>` : note ? `<div class="notice"><p>${esc(note)}</p></div>` : '';
  syncForm();
}

async function verifyLicense(token: string, force = false): Promise<void> {
  const cached = JSON.parse(localStorage.getItem(VERIFY_KEY) || 'null') as { valid: boolean; checkedAt: number } | null;
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) { isPro = cached.valid; setLicenseUi(); return; }
  if (!navigator.onLine) { isPro = Boolean(cached?.valid); setLicenseUi(isPro ? '' : 'Connect once to verify this license. The free workspace remains available.'); return; }
  try {
    const response = await fetch(`${API_BASE}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error();
    const verdict = await response.json() as { valid: boolean; reason: string };
    localStorage.setItem(VERIFY_KEY, JSON.stringify({ valid: verdict.valid, checkedAt: Date.now() }));
    isPro = verdict.valid;
    setLicenseUi(verdict.valid ? '' : 'This license is no longer active. You can keep using the free workspace or purchase a new license.');
  } catch { isPro = Boolean(cached?.valid); setLicenseUi(isPro ? '' : 'License verification is temporarily unavailable. The free workspace is ready.'); }
}

async function initLicense(): Promise<void> {
  const url = new URL(location.href);
  const incoming = url.searchParams.get('license');
  if (incoming) { localStorage.setItem(LICENSE_KEY, incoming); url.searchParams.delete('license'); history.replaceState({}, '', url); }
  const token = incoming || localStorage.getItem(LICENSE_KEY);
  const cached = JSON.parse(localStorage.getItem(VERIFY_KEY) || 'null') as { valid: boolean } | null;
  isPro = Boolean(cached?.valid);
  if (token) await verifyLicense(token, Boolean(incoming)); else setLicenseUi();
}

document.querySelector('#restore-license')!.addEventListener('click', () => { const token = (document.querySelector('#license-input') as HTMLInputElement).value.trim(); if (!token) { setLicenseUi('Paste the license token from your receipt first.'); return; } localStorage.setItem(LICENSE_KEY, token); localStorage.removeItem(VERIFY_KEY); void verifyLicense(token, true); });

function updateNetwork(): void { const badge = document.querySelector('#network-status')!; badge.classList.toggle('offline', !navigator.onLine); badge.querySelector('span:last-child')!.textContent = navigator.onLine ? 'Ready offline' : 'Offline · local mode'; }
addEventListener('online', updateNetwork); addEventListener('offline', updateNetwork); updateNetwork();

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const show = () => { document.querySelector<HTMLElement>('#update-toast')!.hidden = false; };
  if (registration.waiting) show();
  registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => { if (registration.waiting && navigator.serviceWorker.controller) show(); }));
  document.querySelector('#apply-update')!.addEventListener('click', () => registration.waiting?.postMessage('SKIP_WAITING'));
  navigator.serviceWorker.addEventListener('controllerchange', () => location.reload());
}

Promise.all([listProfiles(), initLicense()]).then(([saved]) => { profiles = saved; profile = profiles[0] ? structuredClone(profiles[0]) : blankProfile(); syncForm(); }).catch(() => message('Saved profiles are unavailable in this browser session. You can still preflight and export a CSV.', 'error'));
void registerServiceWorker();
