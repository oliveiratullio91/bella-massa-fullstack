import assert from 'node:assert/strict';
import Ajv2020 from 'ajv/dist/2020.js';
import { openApiDocument } from '../../server/openapi.mjs';

const schemaId = 'urn:bella-massa:openapi';
const validator = new Ajv2020({ strict: false, allErrors: true, formats: { password: true, 'date-time': (s) => /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(s) && Number.isFinite(Date.parse(s)) } });
validator.addSchema(openApiDocument, schemaId);
const paths = Object.entries(openApiDocument.paths).map(([path, methods]) => ({ path, parts: path.split('/'), methods }));

export function checkResponse(method, pathname, response, data) {
    const parts = pathname.split('/');
    const match = paths.find((entry) => entry.parts.length === parts.length && entry.parts.every((part, i) => part === parts[i] || part.startsWith('{')));
    const label = method + ' ' + (match?.path ?? pathname) + ' → ' + response.status;
    const schema = match?.methods[method.toLowerCase()]?.responses[response.status]?.content['application/json']?.schema;
    assert.ok(schema, label + ' sem resposta documentada');
    assert.match(response.headers.get('content-type') ?? '', /^application\/json\b/, label);
    const validate = validator.getSchema(schemaId + schema.$ref);
    assert.ok(validate, label + ' sem esquema de resposta');
    assert.ok(validate(data), label + ' ' + validator.errorsText(validate.errors));
}
