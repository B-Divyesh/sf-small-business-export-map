import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = join(process.cwd(), 'dist');
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.ico':'image/x-icon', '.xml':'application/xml; charset=utf-8', '.txt':'text/plain; charset=utf-8' };
const headers = { 'Content-Security-Policy': "default-src 'self'; img-src 'self' blob:; style-src 'self'; script-src 'self'; connect-src 'self' https://api.sociobot.in; worker-src 'self'; manifest-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'", 'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()', 'Referrer-Policy':'strict-origin-when-cross-origin', 'X-Content-Type-Options':'nosniff' };

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
  const relative = pathname === '/' ? 'index.html' : pathname === '/demo' ? 'demo/index.html' : pathname.replace(/^\//, '');
  let file = normalize(join(root, relative));
  if (!file.startsWith(root) || !existsSync(file)) { file = join(root, '404.html'); response.statusCode = 404; }
  else if (statSync(file).isDirectory()) { file = join(file, 'index.html'); if (!existsSync(file)) { file = join(root, '404.html'); response.statusCode = 404; } }
  Object.entries(headers).forEach(([key, value]) => response.setHeader(key, value));
  response.setHeader('Content-Type', mime[extname(file)] ?? 'application/octet-stream');
  if (/\/assets\//.test(file)) response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  createReadStream(file).pipe(response);
}).listen(4173, '127.0.0.1');
