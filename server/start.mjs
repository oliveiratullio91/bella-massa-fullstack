import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { createPizzariaApi } from './api.mjs';

const dist = resolve('dist');
if (!existsSync(resolve(dist, 'index.html'))) throw new Error('Execute npm run build antes de iniciar o servidor.');

const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};
const api = createPizzariaApi();
const host = process.env.BELLA_MASSA_HOST || (process.env.RENDER === 'true' ? '0.0.0.0' : '127.0.0.1');
const port = Number(process.env.PORT || 5173);
const server = createServer((request, response) => {
    if (api.handle(request, response)) return;
    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405).end();
        return;
    }
    let path;
    try {
        path = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    } catch {
        response.writeHead(400).end();
        return;
    }
    const candidate = resolve(dist, '.' + path);
    if (path.includes('\0') || (candidate !== dist && !candidate.startsWith(dist + sep))) {
        response.writeHead(404).end();
        return;
    }
    const file = statSync(candidate, { throwIfNoEntry: false })?.isFile() ? candidate : resolve(dist, 'index.html');
    if (file.endsWith('index.html') && extname(path)) {
        response.writeHead(404).end();
        return;
    }
    response.writeHead(200, {
        'Content-Type': types[extname(file)] || 'application/octet-stream',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': file.startsWith(resolve(dist, 'assets') + sep) ? 'public, max-age=31536000, immutable' : 'no-cache'
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
});
server.once('close', () => api.close());
process.once('SIGINT', () => server.close());
process.once('SIGTERM', () => server.close());
server.listen(port, host, () => console.log(`Bella Massa em http://${host}:${port}/`));
