import { chromium } from '@playwright/test';

const url = process.argv[2] ?? 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
await page.goto(url, { waitUntil: 'networkidle' });
const result = await page.evaluate(() => ({ lang: document.documentElement.lang, title: document.title, mains: document.querySelectorAll('main').length, headings: document.querySelectorAll('h1').length, imagesWithoutAlt: [...document.images].filter(image => !image.hasAttribute('alt')).length }));
await browser.close();
if (result.lang !== 'en' || !result.title || result.mains !== 1 || result.headings !== 1 || result.imagesWithoutAlt || errors.length) throw new Error(`verify-url failed: ${JSON.stringify({ ...result, errors })}`);
console.log(`verify-url: rendered title, lang, main, h1, alt text, and console passed at ${url}`);
