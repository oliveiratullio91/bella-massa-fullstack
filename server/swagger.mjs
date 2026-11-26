import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import swaggerUi from 'swagger-ui-dist';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Bella Massa API · Swagger</title>
    <link rel="stylesheet" href="/api/docs/swagger-ui.css">
    <script defer src="/api/docs/swagger-ui-bundle.js"></script>
    <script defer src="/api/docs/init.js"></script>
</head>
<body><div id="swagger-ui"></div></body>
</html>`;

const initializer = `SwaggerUIBundle({
    url: '/api/openapi.json',
    dom_id: '#swagger-ui',
    deepLinking: true,
    docExpansion: 'list',
    validatorUrl: null,
    persistAuthorization: false
});`;

const directory = swaggerUi.getAbsoluteFSPath();
const page = { type: 'text/html; charset=utf-8', body: html };
const files = new Map([
    ['/api/docs', page],
    ['/api/docs/', page],
    ['/api/docs/init.js', { type: 'text/javascript; charset=utf-8', body: initializer }],
    ['/api/docs/swagger-ui.css', { type: 'text/css; charset=utf-8', body: readFileSync(join(directory, 'swagger-ui.css')) }],
    ['/api/docs/swagger-ui-bundle.js', { type: 'text/javascript; charset=utf-8', body: readFileSync(join(directory, 'swagger-ui-bundle.js')) }]
]);

export function handleSwagger(request, response, route) {
    const file = files.get(route);
    if (!file) return false;

    if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'application/json; charset=utf-8' });
        response.end(JSON.stringify({ error: 'Método indisponível na documentação.', code: 'METHOD_NOT_ALLOWED' }));
        return true;
    }

    response.writeHead(200, {
        'Content-Type': file.type,
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
    });
    response.end(request.method === 'HEAD' ? undefined : file.body);
    return true;
}
