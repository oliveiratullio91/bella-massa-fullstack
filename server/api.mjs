import { join } from 'node:path';
import express from 'express';
import { jwtVerify, SignJWT } from 'jose';
import { createPizzariaStore, validSavedState } from '../src/stores/pizzaria.js';
import { money } from '../src/utils/pizzaria.js';
import { createAdminUsers } from './admin-users.mjs';
import { adminResources, errorCodes } from './api-contract.mjs';
import { openDatabase, runtimeDirectory } from './database.mjs';
import { locationRoutes } from './locations.mjs';
import { openApiDocument } from './openapi.mjs';
import { fingerprint, hashPassword, loadAdminPassword, loadJwtKey, sameSecret, token, verifyPassword } from './security.mjs';
import { handleSwagger } from './swagger.mjs';
import { ApiError, requireValue, validateAdminAction, validateRequest } from './validation.mjs';

const day = 24 * 60 * 60 * 1000;
const authCookies = { admin: 'bella_admin', customer: 'bella_customer' };
const jwtIssuer = 'bella-massa';

function field(value, maximum, label, required = false) {
    requireValue(value === undefined || typeof value === 'string', 422, `Confira o campo ${label}.`);
    const result = value?.trim() ?? '';
    requireValue(result.length <= maximum && (!required || result.length > 0), 422, `Confira o campo ${label}.`);
    return result;
}

function phoneNumber(value) {
    return (typeof value === 'string' ? value : '').replace(/\D/g, '');
}

function validPhone(value) {
    const digits = phoneNumber(field(value, 20, 'telefone', true));
    requireValue(/^\d{10,11}$/.test(digits), 422, 'Informe um telefone válido com DDD.');
    return digits;
}

function passwordField(value, registering = false) {
    requireValue(typeof value === 'string' && value.length >= (registering ? 8 : 1) && value.length <= 128, 422, registering ? 'Use uma senha de 8 a 128 caracteres.' : 'Informe a senha.');
    return value;
}

function record(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function publicCustomer(customer) {
    const { id, name, phone, address, neighborhood, postalCode = '', uf = '', municipalityId = '', municipality = '' } = customer;
    return { id, name, phone, address, neighborhood, postalCode, uf, municipalityId, municipality };
}

function addressFields(data, previous = {}) {
    return {
        address: field(data.address ?? previous.address, 200, 'endereço'),
        neighborhood: field(data.neighborhood ?? previous.neighborhood, 80, 'bairro'),
        postalCode: data.postalCode ?? previous.postalCode,
        uf: data.uf ?? previous.uf,
        municipalityId: data.municipalityId ?? previous.municipalityId,
        municipality: field(data.municipality ?? previous.municipality, 100, 'município')
    };
}
function checked(work) {
    try {
        return work();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(422, error.message);
    }
}

async function body(request, limit = 65536) {
    requireValue(!(Number(request.headers['content-length']) > limit), 413, 'Os dados enviados excedem o limite.');
    let length = 0;
    const chunks = [];
    for await (const chunk of request.iterator({ destroyOnReturn: false })) {
        length += chunk.length;
        requireValue(length <= limit, 413, 'Os dados enviados excedem o limite.');
        chunks.push(chunk);
    }
    if (length === 0) return {};
    const contentType = request.headers['content-type']?.split(';')[0].trim().toLowerCase();
    requireValue(contentType === 'application/json' || /^application\/[a-z0-9.+-]+\+json$/.test(contentType ?? ''), 415, 'Use Content-Type application/json para enviar dados.');
    let parsed;
    try {
        parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } catch {
        throw new ApiError(400, 'Não foi possível ler os dados enviados.');
    }
    requireValue(record(parsed), 400, 'Envie os dados em formato de objeto.');
    return parsed;
}

function send(response, status, payload) {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(JSON.stringify(payload));
}

export function createPizzariaApi({
    databasePath = join(runtimeDirectory, 'bella-massa.sqlite'),
    adminPassword = loadAdminPassword(join(runtimeDirectory, 'acesso-admin.txt')),
    now = () => new Date(),
    secureCookies = process.env.BELLA_MASSA_SECURE_COOKIES === '1' || process.env.RENDER === 'true',
    allowedOrigins = (process.env.BELLA_MASSA_ALLOWED_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    crossSiteCookies = process.env.BELLA_MASSA_CROSS_SITE_COOKIES === '1',
    fetchAddress
} = {}) {
    if (crossSiteCookies && !secureCookies) throw new Error('Cookies entre sites exigem HTTPS e configuração de cookies seguros.');
    const jwtKey = loadJwtKey(databasePath);
    const repository = openDatabase(databasePath, now);
    const { db } = repository;
    const users = createAdminUsers(repository, adminPassword);
    const failedAttempts = new Map();
    const accountFor = db.prepare('SELECT password_hash FROM customer_accounts WHERE customer_id = ?');
    const sessionFor = db.prepare('SELECT role, customer_id, expires_at FROM sessions WHERE token_hash = ?');

    function limited(request, group, limit) {
        const timestamp = now().getTime();
        if (failedAttempts.size >= 1000) {
            for (const [key, entry] of failedAttempts) if (entry.until <= timestamp) failedAttempts.delete(key);
            requireValue(failedAttempts.size < 1000, 429, 'Aguarde alguns minutos antes de tentar novamente.');
        }
        const key = group + ':' + request.socket.remoteAddress;
        const previous = failedAttempts.get(key);
        const attempt = previous?.until > timestamp ? previous : { count: 0, until: timestamp + 15 * 60 * 1000 };
        requireValue(attempt.count < limit, 429, 'Muitas tentativas. Aguarde alguns minutos.');
        attempt.count++;
        failedAttempts.set(key, attempt);
    }

    function cookieToken(request, role) {
        return request.headers.cookie
            ?.split(';')
            .map((item) => item.trim())
            .find((item) => item.startsWith(authCookies[role] + '='))
            ?.slice(authCookies[role].length + 1);
    }

    function cookie(response, request, role, value, maxAge) {
        const secure = secureCookies || request.socket.encrypted ? '; Secure' : '';
        response.setHeader('Set-Cookie', `${authCookies[role]}=${value}; Path=/api; HttpOnly; SameSite=${crossSiteCookies ? 'None' : 'Lax'}; Max-Age=${maxAge}${secure}`);
    }

    async function issueSession(response, request, role, subject) {
        const duration = role === 'admin' ? day : 7 * day;
        const timestamp = now().getTime();
        const value = await new SignJWT({ role })
            .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
            .setIssuer(jwtIssuer)
            .setAudience(role)
            .setSubject(subject)
            .setJti(token(16))
            .setIssuedAt(Math.floor(timestamp / 1000))
            .setExpirationTime(Math.floor((timestamp + duration) / 1000))
            .sign(jwtKey);
        if (role === 'admin') requireValue(users.active(subject), 401, 'Usuário sem acesso ao painel.');
        else requireValue(accountFor.get(subject), 401, 'Conta do cliente indisponível.');
        db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(timestamp);
        const previous = cookieToken(request, role);
        if (previous) db.prepare('DELETE FROM sessions WHERE token_hash = ? AND role = ?').run(fingerprint(previous), role);
        db.prepare('INSERT INTO sessions (token_hash, role, customer_id, expires_at) VALUES (?, ?, ?, ?)').run(fingerprint(value), role, subject, timestamp + duration);
        cookie(response, request, role, value, duration / 1000);
    }

    async function session(request, role) {
        const value = cookieToken(request, role);
        if (!value) return null;
        let claims;
        try {
            const { payload } = await jwtVerify(value, jwtKey, { algorithms: ['HS256'], typ: 'JWT', issuer: jwtIssuer, audience: role, currentDate: now(), requiredClaims: ['sub', 'jti', 'iat', 'exp'] });
            claims = payload;
        } catch {
            return null;
        }
        const current = sessionFor.get(fingerprint(value));
        if (claims.role !== role || current?.role !== role || current.customer_id !== claims.sub || current.expires_at <= now().getTime()) return null;
        if (role === 'admin' && !users.active(claims.sub)) return null;
        return current;
    }

    function customerFrom(request, state, required = true) {
        const current = request.customerSession;
        const customer = current && state.customers.find((item) => item.id === current.customer_id);
        if (required) requireValue(customer, 401, 'Entre na sua conta para continuar.');
        return customer || null;
    }

    function customerMatches(state, phone) {
        return state.customers.filter((customer) => phoneNumber(customer.phone) === phone);
    }

    function adminState() {
        const { state, revision } = repository.read();
        return { state, revision, canImport: revision === 0 };
    }

    function mutate(work) {
        return repository.transaction(() => {
            const store = createPizzariaStore({ now, initialState: repository.read().state });
            const result = work(store);
            repository.write(store.state);
            return result;
        });
    }

    async function register(request, response, data) {
        limited(request, 'conta', 30);
        const phone = validPhone(data.phone);
        const password = passwordField(data.password, true);
        const code = field(data.code, 60, 'código de ativação');
        const passwordHash = hashPassword(password);
        const customer = mutate((store) => {
            const matches = customerMatches(store.state, phone);
            const existing = matches[0];
            requireValue(matches.length < 2, 409, 'Fale com a pizzaria para conferir seu cadastro.');
            let result = existing;
            if (existing) {
                const activation = db.prepare('SELECT code_hash, expires_at FROM activations WHERE customer_id = ?').get(existing.id);
                requireValue(!accountFor.get(existing.id) && code && activation?.expires_at > now().getTime() && sameSecret(activation.code_hash, fingerprint(code)), 409, 'Confira o código de ativação com a pizzaria ou entre na sua conta.');
                db.prepare('DELETE FROM activations WHERE customer_id = ?').run(existing.id);
            } else {
                requireValue(!code, 422, 'O código não corresponde a esse telefone. Confira os dados com a pizzaria.');
                result = checked(() =>
                    store.saveCustomer({
                        name: field(data.name, 100, 'nome', true),
                        phone,
                        ...addressFields(data)
                    })
                );
            }
            db.prepare('INSERT INTO customer_accounts (customer_id, password_hash) VALUES (?, ?)').run(result.id, passwordHash);
            return publicCustomer(result);
        });
        await issueSession(response, request, 'customer', customer.id);
        return { customer };
    }

    const dummyPasswordHash = hashPassword(token());
    async function logInCustomer(request, response, data) {
        limited(request, 'conta', 30);
        const phone = validPhone(data.phone);
        const password = passwordField(data.password);
        const matches = customerMatches(repository.read().state, phone);
        const account = matches.length === 1 ? accountFor.get(matches[0].id) : null;
        const matchesPassword = verifyPassword(password, account?.password_hash ?? dummyPasswordHash);
        requireValue(account && matchesPassword, 401, 'Telefone ou senha incorretos.');
        await issueSession(response, request, 'customer', matches[0].id);
        return { customer: publicCustomer(matches[0]) };
    }

    function logOut(request, response, role) {
        const value = cookieToken(request, role);
        if (value) db.prepare('DELETE FROM sessions WHERE token_hash = ? AND role = ?').run(fingerprint(value), role);
        cookie(response, request, role, '', 0);
        return { ok: true };
    }

    function submitOrder(request, data) {
        const requestId = field(data.requestId, 70, 'identificação do pedido', true);
        requireValue(/^[a-zA-Z0-9-]{16,70}$/.test(requestId), 422, 'Atualize a página e tente novamente.');
        requireValue(['Entrega', 'Retirada'].includes(data.type), 422, 'Escolha entrega ou retirada.');
        requireValue(Array.isArray(data.items) && data.items.length <= 30 && data.items.every(record), 422, 'Confira os itens do carrinho.');
        requireValue(Number.isFinite(data.expectedTotal), 422, 'Confira o valor do pedido.');

        return repository.transaction(() => {
            const store = createPizzariaStore({ now, initialState: repository.read().state });
            const customer = customerFrom(request, store.state);
            // A mesma tentativa de compra devolve o recibo já salvo e evita criar um segundo pedido. [Tullio e Tassiana Oliveira]
            const original = db.prepare('SELECT response FROM order_requests WHERE customer_id = ? AND request_id = ?').get(customer.id, requestId);
            if (original) return JSON.parse(original.response);
            requireValue(store.state.settings.isOpen, 409, 'A pizzaria está fechada neste momento.');
            const order = checked(() =>
                store.createOrder({
                    customerId: customer.id,
                    address: field(data.address, 250, 'endereço'),
                    notes: field(data.notes, 400, 'observações'),
                    type: data.type,
                    payment: data.payment,
                    items: data.items
                })
            );
            requireValue(order.total === money(data.expectedTotal), 409, 'O valor do carrinho mudou. Confira o novo total antes de continuar.');
            order.source = 'site';
            const result = { id: order.id, total: order.total, status: order.status };
            repository.write(store.state);
            db.prepare('INSERT INTO order_requests (customer_id, request_id, response) VALUES (?, ?, ?)').run(customer.id, requestId, JSON.stringify(result));
            return result;
        });
    }

    function applyAdminAction(action, getArgs) {
        const result = mutate((store) => {
            const args = getArgs(store.state);
            validateAdminAction(action, args);
            if (action === 'saveCustomer') {
                const draft = args[0];
                requireValue(record(draft), 422, 'Confira o cadastro do cliente.');
                const phone = validPhone(draft.phone);
                requireValue(!customerMatches(store.state, phone).some((customer) => customer.id !== draft.id), 409, 'Já existe um cliente com esse telefone.');
                const previous = store.state.customers.find((customer) => customer.id === draft.id);
                if (previous && phoneNumber(previous.phone) !== phone) {
                    db.prepare('DELETE FROM activations WHERE customer_id = ?').run(previous.id);
                    db.prepare("DELETE FROM sessions WHERE role = 'customer' AND customer_id = ?").run(previous.id);
                }
            }
            if (action === 'resetDemo') {
                const hasAccounts = db.prepare('SELECT 1 FROM customer_accounts LIMIT 1').get();
                const hasOrders = db.prepare('SELECT 1 FROM order_requests LIMIT 1').get();
                requireValue(!hasAccounts && !hasOrders, 409, 'A restauração de exemplos está indisponível depois que o site começa a receber cadastros ou pedidos.');
                db.exec('DELETE FROM activations');
            }
            const value = checked(() => store[action](...args));
            if (action === 'deleteCustomer') {
                db.prepare('DELETE FROM customer_accounts WHERE customer_id = ?').run(args[0]);
                db.prepare('DELETE FROM activations WHERE customer_id = ?').run(args[0]);
                db.prepare("DELETE FROM sessions WHERE role = 'customer' AND customer_id = ?").run(args[0]);
            }
            return value ?? null;
        });
        return { ...adminState(), result };
    }

    function activationCode(data) {
        return repository.transaction(() => {
            const customer = repository.read().state.customers.find((item) => item.id === data.customerId);
            requireValue(customer, 404, 'Cliente não encontrado.');
            requireValue(!accountFor.get(customer.id), 409, 'Esse cliente já ativou a conta no site.');
            const code = token(12);
            const expiresAt = now().getTime() + day;
            db.prepare('INSERT OR REPLACE INTO activations (customer_id, code_hash, expires_at) VALUES (?, ?, ?)').run(customer.id, fingerprint(code), expiresAt);
            return { code, expiresAt };
        });
    }

    const routes = {
        ...locationRoutes(fetchAddress),
        'GET /api/health': () => {
            let ready = false;
            try {
                ready = repository.isReady();
            } catch (error) {
                console.error('Falha na verificação do banco Bella Massa.', error);
            }
            requireValue(ready, 503, 'O banco da pizzaria está indisponível.');
            return { status: 'ok', database: 'ok' };
        },
        'GET /api/openapi.json': () => openApiDocument,
        'GET /api/menu': () => {
            const { state } = repository.read();
            const { name, subtitle, isOpen, deliveryFee, estimatedTime, address } = state.settings;
            return { products: state.products.filter((product) => product.active), settings: { name, subtitle, isOpen, deliveryFee, estimatedTime, address } };
        },
        'GET /api/customer/session': (request) => {
            const customer = customerFrom(request, repository.read().state, false);
            return { customer: customer ? publicCustomer(customer) : null };
        },
        'POST /api/customer/register': register,
        'POST /api/customer/login': logInCustomer,
        'POST /api/customer/logout': (request, response) => logOut(request, response, 'customer'),
        'PATCH /api/customer/profile': (request, response, data) =>
            mutate((store) => {
                const customer = customerFrom(request, store.state);
                const updated = checked(() =>
                    store.saveCustomer({
                        ...customer,
                        name: field(data.name, 100, 'nome', true),
                        ...addressFields(data, customer)
                    })
                );
                return { customer: publicCustomer(updated) };
            }),
        'GET /api/customer/orders': (request) => {
            const { state } = repository.read();
            const customer = customerFrom(request, state);
            return {
                orders: state.orders
                    .filter((order) => order.customerId === customer.id)
                    .slice(0, 30)
                    .map(({ id, createdAt, total, status }) => ({ id, createdAt, total, status }))
            };
        },
        'POST /api/customer/orders': (request, response, data) => submitOrder(request, data),
        'POST /api/admin/login': async (request, response, data) => {
            limited(request, 'painel', 15);
            const user = users.authenticate(data.username, passwordField(data.password));
            requireValue(user, 401, 'Usuário ou senha do painel incorretos.');
            await issueSession(response, request, 'admin', user.id);
            return adminState();
        },
        'POST /api/admin/logout': (request, response) => logOut(request, response, 'admin'),
        'GET /api/admin/state': adminState,
        'GET /api/admin/users': () => ({ users: users.list() }),
        'GET /api/admin/users/:id': ({ params }) => users.find(params.id),
        'POST /api/admin/users': (request, response, data) => users.save(null, data, request.adminSession.customer_id),
        'PATCH /api/admin/users/:id': (request, response, data) => users.save(request.params.id, data, request.adminSession.customer_id),
        'DELETE /api/admin/users/:id': (request) => users.remove(request.params.id, request.adminSession.customer_id),
        'POST /api/admin/action': (request, response, data) => applyAdminAction(data.action, () => data.args),
        'POST /api/admin/activation': (request, response, data) => activationCode(data),
        'POST /api/admin/import': (request, response, data) => {
            requireValue(validSavedState(data.state), 422, 'Os dados antigos não puderam ser lidos.');
            repository.transaction(() => {
                requireValue(repository.read().revision === 0, 409, 'O banco já tem alterações. Os dados antigos ainda estão no navegador.');
                const entries = data.state.orders;
                const nextOrderId = entries.reduce((next, order) => Math.max(next, order.id + 1), data.state.nextOrderId);
                repository.write({ ...data.state, nextOrderId });
            });
            return adminState();
        }
    };

    for (const { path, collection, create, update, remove, numericId } of adminResources) {
        const base = `/api/admin/${path}`;
        function findRecord(state, request) {
            const value = numericId && /^\d+$/.test(request.params.id) ? Number(request.params.id) : request.params.id;
            const current = state[collection].find((item) => item.id === value);
            requireValue(current, 404, 'Cadastro não encontrado.');
            return current;
        }
        routes[`GET ${base}`] = () => ({ [collection]: repository.read().state[collection] });
        routes[`GET ${base}/:id`] = (request) => findRecord(repository.read().state, request);
        routes[`POST ${base}`] = (request, response, data) => applyAdminAction(create, () => [{ ...data, id: undefined }]);
        routes[`PATCH ${base}/:id`] = (request, response, data) =>
            applyAdminAction(update, (state) => {
                const current = findRecord(state, request);
                const draft = { ...current, ...data, id: current.id };
                return numericId ? [current.id, draft] : [draft];
            });
        routes[`DELETE ${base}/:id`] = (request) => applyAdminAction(remove, (state) => [findRecord(state, request).id]);
    }

    const creationRoutes = new Set(['/api/admin/users', ...adminResources.map(({ path }) => '/api/admin/' + path)]);
    const app = express();
    app.disable('x-powered-by');
    app.enable('case sensitive routing');
    app.use((request, response, next) => {
        const { origin, host } = request.headers;
        response.vary('Origin');
        if (origin) {
            const trusted = origin === 'http://' + host || origin === 'https://' + host || allowedOrigins.includes(origin);
            if (!trusted && request.method !== 'GET' && request.method !== 'HEAD') return next(new ApiError(403, 'Origem da solicitação inválida.'));
            if (trusted) {
                response.setHeader('Access-Control-Allow-Origin', origin);
                response.setHeader('Access-Control-Allow-Credentials', 'true');
                response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PATCH, DELETE, OPTIONS');
                response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            }
        }
        if (request.method === 'OPTIONS') return response.status(204).end();
        if (!handleSwagger(request, response, request.path)) next();
    });
    for (const [operation, callback] of Object.entries(routes)) {
        const [method, route] = operation.split(' ');
        app[method.toLowerCase()](route, async (request, response) => {
            const input = method === 'GET' || method === 'DELETE' ? {} : await body(request, route === '/api/admin/import' ? 1048576 : undefined);
            if (route.startsWith('/api/admin/') && route !== '/api/admin/login') {
                request.adminSession = await session(request, 'admin');
                requireValue(request.adminSession, 401, 'Entre no painel para continuar.');
            }
            if (route.startsWith('/api/customer/')) request.customerSession = await session(request, 'customer');
            validateRequest(operation, input);
            const result = await callback(request, response, input);
            send(response, method === 'POST' && creationRoutes.has(route) ? 201 : 200, result);
        });
    }
    app.use((request, response) => send(response, 404, { error: 'Operação não encontrada.', code: errorCodes[404] }));
    app.use((error, request, response, next) => {
        request.resume();
        if (response.headersSent) return next(error);
        if (response.destroyed) return;
        if (error instanceof ApiError) return send(response, error.status, { error: error.message, code: errorCodes[error.status], ...(error.details ? { details: error.details } : {}) });
        if (error instanceof URIError) return send(response, 400, { error: 'Endereço da solicitação inválido.', code: errorCodes[400] });
        console.error('Falha interna da API Bella Massa.', error);
        send(response, 500, { error: 'Ocorreu um erro ao salvar ou carregar os dados.', code: errorCodes[500] });
    });
    return {
        close: () => db.close(),
        handle(request, response) {
            const route = request.url.split('?')[0];
            if (route !== '/api' && !route.startsWith('/api/')) return false;
            app(request, response);
            return true;
        }
    };
}
