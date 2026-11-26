import assert from 'node:assert/strict';
import { once } from 'node:events';
import { mkdtemp, rmdir, unlink } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { decodeJwt } from 'jose';
import { createPizzariaApi } from '../server/api.mjs';
import { createDemoData } from '../src/data/pizzaria.js';
import { checkResponse } from './support/contrato.mjs';

const adminPassword = 'senha-administrativa-de-teste';
const now = () => new Date('2026-11-19T18:00:00-03:00');
const customerPassword = 'senha-cliente-de-teste';

async function listen(databasePath = ':memory:', options = {}) {
    const api = createPizzariaApi({ databasePath, adminPassword, now, ...options });
    const server = createServer((request, response) => {
        if (!api.handle(request, response)) response.writeHead(404).end();
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const url = `http://127.0.0.1:${server.address().port}/api`;
    return {
        url,
        async close() {
            await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
            api.close();
        }
    };
}

function client(server, initialCookies = '') {
    const cookies = new Map(initialCookies ? initialCookies.split('; ').map((cookie) => cookie.split('=')) : []);
    const cookieHeader = () => [...cookies].map(([key, value]) => `${key}=${value}`).join('; ');
    return {
        cookieHeader,
        async request(path, body, options = {}) {
            const method = options.method ?? (body === undefined ? 'GET' : 'POST');
            const response = await fetch(server.url + path, {
                method,
                headers: { Cookie: cookieHeader(), 'Content-Type': 'application/json', ...options.headers },
                body: body === undefined ? undefined : JSON.stringify(body)
            });
            for (const raw of response.headers.getSetCookie()) {
                const [name, value] = raw.split(';')[0].split('=');
                if (value) cookies.set(name, value);
                else cookies.delete(name);
            }
            const data = await response.json();
            checkResponse(method, path, response, data);
            return { status: response.status, data, cookies: response.headers.getSetCookie() };
        }
    };
}

const registration = (phone) => ({ name: 'Pessoa de Teste', phone, password: customerPassword });
const draftOrder = (requestId) => ({
    requestId,
    type: 'Entrega',
    payment: 'Pix',
    address: 'Rua da Demonstração, 18',
    notes: 'Pedido sintético',
    items: [{ productId: 'pizza-1', size: 'Média', quantity: 1 }],
    expectedTotal: 48.42
});
const saveCustomer = (admin, customer) => admin.request('/admin/action', { action: 'saveCustomer', args: [customer] });

test('saúde e Swagger são públicos e o contrato descreve os cookies de sessão', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const guest = client(server);
    const health = await guest.request('/health');
    assert.equal(health.status, 200);
    assert.deepEqual(health.data, { status: 'ok', database: 'ok' });

    const contract = await guest.request('/openapi.json');
    assert.equal(contract.status, 200);
    assert.equal(contract.data.openapi, '3.1.2');
    assert.deepEqual(contract.data.paths['/admin/action'].post.security, [{ adminSession: [] }]);
    assert.equal(contract.data.components.securitySchemes.customerSession.in, 'cookie');
    assert.ok(contract.data.paths['/customer/orders'].post.responses[422]);

    for (const [path, contentType] of [
        ['/docs', 'text/html'],
        ['/docs/init.js', 'text/javascript'],
        ['/docs/swagger-ui-bundle.js', 'text/javascript'],
        ['/docs/swagger-ui.css', 'text/css']
    ]) {
        const asset = await fetch(server.url + path);
        assert.equal(asset.status, 200);
        assert.ok(asset.headers.get('content-type').startsWith(contentType));
        assert.ok((await asset.text()).length > 100);
    }
});

test('validação descreve campos incorretos e não altera o banco', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    const signedIn = await admin.request('/admin/login', { password: adminPassword });
    const wrongPrice = await admin.request('/admin/action', { action: 'saveProduct', args: [{ name: 'Produto inválido', category: 'Tradicionais', price: '49,90' }] });
    assert.equal(wrongPrice.status, 422);
    assert.equal(wrongPrice.data.code, 'VALIDATION_ERROR');
    assert.deepEqual(wrongPrice.data.details, [{ field: '/args/0/price', rule: 'type' }]);

    const wrongArgs = await admin.request('/admin/action', { action: 'changeStatus', args: [1027, 'sim'] });
    assert.equal(wrongArgs.status, 422);
    assert.deepEqual(wrongArgs.data.details, [{ field: '/args/1', rule: 'type' }]);
    assert.equal((await admin.request('/admin/state')).data.revision, signedIn.data.revision);

    const registrationWithoutName = await admin.request('/customer/register', { phone: '85900001234', password: customerPassword });
    assert.equal(registrationWithoutName.status, 422);
    assert.equal(registrationWithoutName.data.code, 'VALIDATION_ERROR');
    assert.ok(registrationWithoutName.data.details.some(({ field }) => field === '/name'));
});

test('a API diferencia JSON inválido, tipo de conteúdo errado e corpo acima do limite', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    for (const [body, type, status, code] of [
        ['{"password":', 'application/json', 400, 'BAD_REQUEST'],
        ['{"password":"teste"}', 'text/plain', 415, 'UNSUPPORTED_MEDIA_TYPE'],
        [JSON.stringify({ password: 'x'.repeat(70 * 1024) }), 'application/json', 413, 'PAYLOAD_TOO_LARGE']
    ]) {
        const response = await fetch(server.url + '/admin/login', { method: 'POST', headers: { 'Content-Type': type }, body });
        assert.equal(response.status, status);
        assert.equal((await response.json()).code, code);
    }
});

test('catálogo é público, cadastros e pedidos exigem a sessão correta', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const guest = client(server);
    const menu = await guest.request('/menu');
    assert.equal(menu.status, 200);
    assert.ok(menu.data.products.length > 0 && menu.data.products.every((product) => product.active));
    assert.deepEqual(Object.keys(menu.data).sort(), ['products', 'settings']);
    assert.equal((await guest.request('/admin/state')).status, 401);
    assert.equal((await guest.request('/customer/orders', draftOrder('pedido-teste-12345'))).status, 401);
    assert.equal((await guest.request('/admin/login', { password: adminPassword }, { headers: { Origin: 'https://origem-invalida.example' } })).status, 403);
    const login = await guest.request('/admin/login', { password: adminPassword });
    assert.equal(login.status, 200);
    assert.match(login.cookies[0], /HttpOnly/);
    assert.equal((await guest.request('/customer/orders')).status, 401);
    await guest.request('/admin/logout', {});
    assert.equal((await guest.request('/admin/state')).status, 401);
});

test('cliente entra novamente após sair e consulta somente seus próprios pedidos', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const first = client(server);
    const second = client(server);
    const credentials = { phone: '85900003111', password: customerPassword };
    const account = await first.request('/customer/register', { name: 'Cliente da loja', ...credentials });
    assert.equal(account.status, 200);
    const order = await first.request('/customer/orders', draftOrder('pedido-login-12345'));
    assert.equal(order.status, 200);
    const logout = await first.request('/customer/logout', {});
    assert.equal(logout.status, 200);
    assert.equal((await first.request('/customer/session')).data.customer, null);
    assert.equal((await first.request('/customer/orders')).status, 401);
    assert.equal((await first.request('/customer/login', { ...credentials, password: 'incorreta' })).status, 401);
    assert.deepEqual((await first.request('/customer/login', credentials)).data.customer, account.data.customer);
    assert.deepEqual((await first.request('/customer/orders')).data.orders.map(({ id }) => id), [order.data.id]);
    assert.equal((await second.request('/customer/register', registration('85900003112'))).status, 200);
    assert.deepEqual((await second.request('/customer/orders')).data.orders, []);
});

test('HEAD e OPTIONS respondem sem corpo e operações inexistentes retornam erro', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    for (const path of ['/menu', '/health', '/openapi.json', '/docs']) {
        const response = await fetch(server.url + path, { method: 'HEAD' });
        assert.equal(response.status, 200);
        assert.equal(await response.text(), '');
    }
    const options = await fetch(server.url + '/admin/products', { method: 'OPTIONS', headers: { Origin: new URL(server.url).origin, 'Access-Control-Request-Method': 'PATCH' } });
    assert.equal(options.status, 204);
    assert.equal(await options.text(), '');
    assert.match(options.headers.get('access-control-allow-methods'), /PATCH/);
    const missing = await fetch(server.url + '/inexistente');
    assert.equal(missing.status, 404);
    assert.equal((await missing.json()).code, 'NOT_FOUND');
    const unsupported = await fetch(server.url + '/menu', { method: 'PUT' });
    assert.ok([404, 405].includes(unsupported.status));
    const docs = await fetch(server.url + '/docs', { method: 'POST' });
    assert.equal(docs.status, 405);
    assert.equal(docs.headers.get('allow'), 'GET, HEAD');
});

test('cada operação marcada como protegida no Swagger exige a sessão correspondente', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const guest = client(server);
    const { data: contract } = await guest.request('/openapi.json');
    for (const [path, methods] of Object.entries(contract.paths)) {
        for (const [method, operation] of Object.entries(methods)) {
            if (!operation.security?.length) continue;
            let data;
            if (method === 'post' || method === 'patch') {
                if (path === '/customer/orders') data = draftOrder('pedido-do-visitante');
                else if (path === '/customer/profile') data = { name: 'Cliente de teste' };
                else data = {};
            }
            const result = await guest.request(path.replace('{id}', '1'), data, { method: method.toUpperCase() });
            assert.equal(result.status, 401, method + ' ' + path);
        }
    }
});

test('configuração e disponibilidade do painel são respeitadas pelo carrinho da loja', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    const customer = client(server);
    const login = await admin.request('/admin/login', { password: adminPassword });
    const settings = login.data.state.settings;
    const product = login.data.state.products.find(({ id }) => id === 'pizza-1');
    const cart = draftOrder('pedido-em-revisao-001');
    await customer.request('/customer/register', registration('85900003113'));
    const configure = (changes) => admin.request('/admin/action', { action: 'saveSettings', args: [{ ...settings, ...changes }] });
    assert.equal((await configure({ isOpen: false })).status, 200);
    assert.equal((await customer.request('/menu')).data.settings.isOpen, false);
    assert.equal((await customer.request('/customer/orders', cart)).status, 409);
    assert.equal((await configure({ isOpen: true, deliveryFee: settings.deliveryFee + 2 })).status, 200);
    assert.equal((await customer.request('/customer/orders', cart)).status, 409);
    assert.deepEqual((await customer.request('/customer/orders')).data.orders, []);
    const revised = { ...cart, expectedTotal: cart.expectedTotal + 2 };
    assert.equal((await admin.request('/admin/products/' + product.id, { ...product, active: false }, { method: 'PATCH' })).status, 200);
    assert.ok(!(await customer.request('/menu')).data.products.some(({ id }) => id === product.id));
    assert.equal((await customer.request('/customer/orders', revised)).status, 422);
    assert.equal((await admin.request('/admin/products/' + product.id, product, { method: 'PATCH' })).status, 200);
    assert.equal((await customer.request('/customer/orders', revised)).data.total, revised.expectedTotal);
    assert.equal((await customer.request('/customer/orders')).data.orders.length, 1);
});

test('o cadastro criado no painel é ativado sem duplicatas e alterações se refletem nos dois lados', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    const customer = client(server);
    await admin.request('/admin/login', { password: adminPassword });
    const saved = await saveCustomer(admin, { name: 'Cadastro da equipe', phone: '(85) 90000-1001', address: 'Rua de Teste, 120', neighborhood: 'Centro', notes: 'Nota da equipe' });
    assert.equal(saved.status, 200);
    const id = saved.data.result.id;
    assert.equal((await customer.request('/customer/register', registration('85900001001'))).status, 409);
    const activation = await admin.request('/admin/activation', { customerId: id });
    assert.equal(activation.status, 200);
    const activated = await customer.request('/customer/register', { ...registration('85900001001'), code: activation.data.code });
    assert.equal(activated.status, 200);
    assert.equal(activated.data.customer.id, id);
    assert.equal(activated.data.customer.address, 'Rua de Teste, 120');
    assert.ok(!('notes' in activated.data.customer));
    assert.equal((await customer.request('/admin/state')).status, 401);
    assert.equal((await customer.request('/customer/register', { ...registration('85900001001'), code: activation.data.code })).status, 409);
    assert.equal((await saveCustomer(admin, { name: 'Duplicado', phone: '85900001001' })).status, 409);
    const changed = await customer.request('/customer/profile', { name: 'Cadastro atualizado', address: 'Rua Nova, 420', neighborhood: 'Centro' }, { method: 'PATCH' });
    assert.equal(changed.status, 200);
    const panel = await admin.request('/admin/state');
    assert.equal(panel.data.state.customers.find((item) => item.id === id).address, 'Rua Nova, 420');
    assert.equal(panel.data.state.customers.find((item) => item.id === id).notes, 'Nota da equipe');
    await saveCustomer(admin, { ...panel.data.state.customers.find((item) => item.id === id), name: 'Nome ajustado no painel' });
    assert.equal((await customer.request('/customer/session')).data.customer.name, 'Nome ajustado no painel');
});

test('cadastro do site e pedido aparecem no painel e sobrevivem ao reinício sem duplicar envios', async (t) => {
    const folder = await mkdtemp(join(tmpdir(), 'bella-massa-http-'));
    const filename = join(folder, 'teste.sqlite');
    let server = await listen(filename);
    t.after(async () => {
        await server?.close();
        for (const file of [filename, filename + '-shm', filename + '-wal', filename + '.jwt-key'])
            await unlink(file).catch((error) => {
                if (error.code !== 'ENOENT') throw error;
            });
        await rmdir(folder);
    });
    let customer = client(server);
    let admin = client(server);
    await admin.request('/admin/login', { password: adminPassword });
    const account = await customer.request('/customer/register', registration('85900001002'));
    assert.equal(account.status, 200);
    const initial = await admin.request('/admin/state');
    assert.ok(initial.data.state.customers.some((entry) => entry.id === account.data.customer.id));

    const order = { ...draftOrder('pedido-teste-persistente-1234'), customerId: 'cliente-1', total: 0 };
    assert.equal((await customer.request('/customer/orders', { ...order, expectedTotal: 0 })).status, 409);
    const [first, retry] = await Promise.all([customer.request('/customer/orders', order), customer.request('/customer/orders', order)]);
    assert.equal(first.status, 200);
    assert.deepEqual(first.data, retry.data);
    const current = await admin.request('/admin/state');
    const stored = current.data.state.orders.find((entry) => entry.id === first.data.id);
    assert.equal(stored.source, 'site');
    assert.equal(stored.status, 'Recebido');
    assert.equal(stored.customerId, account.data.customer.id);
    assert.equal(stored.total, 48.42);
    assert.equal(current.data.state.orders.length, initial.data.state.orders.length + 1);
    assert.equal((await admin.request('/admin/action', { action: 'resetDemo', args: [] })).status, 409);

    const customerCookies = customer.cookieHeader();
    const adminCookies = admin.cookieHeader();
    await server.close();
    server = null;
    server = await listen(filename);
    customer = client(server, customerCookies);
    admin = client(server, adminCookies);
    assert.equal((await customer.request('/customer/orders')).data.orders[0].id, stored.id);
    assert.equal((await admin.request('/admin/state')).data.state.orders[0].id, stored.id);
    assert.deepEqual((await customer.request('/customer/orders', order)).data, first.data);
    assert.equal((await admin.request('/admin/action', { action: 'changeStatus', args: [stored.id] })).data.result.status, 'Em preparo');
    assert.equal((await customer.request('/customer/orders')).data.orders[0].status, 'Em preparo');
});

test('importação da versão local protege alterações feitas no banco compartilhado', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    await admin.request('/admin/login', { password: adminPassword });
    const snapshot = createDemoData(now());
    snapshot.customers[0].name = 'Cadastro da versão anterior';
    const result = await admin.request('/admin/import', { state: snapshot });
    assert.equal(result.status, 200);
    assert.equal(result.data.state.customers[0].name, 'Cadastro da versão anterior');
    assert.equal(result.data.canImport, false);
    assert.equal((await admin.request('/admin/import', { state: snapshot })).status, 409);
});

test('JWT do painel é assinado, expira e é revogado no logout', async (t) => {
    let currentTime = now();
    const server = await listen(':memory:', { now: () => currentTime });
    t.after(() => server.close());
    const admin = client(server);
    const login = await admin.request('/admin/login', { username: 'admin', password: adminPassword });
    assert.equal(login.status, 200);
    const cookie = admin.cookieHeader();
    assert.match(login.cookies[0], /HttpOnly; SameSite=Lax/);
    const encoded = cookie.slice('bella_admin='.length);
    const { role, sub, aud, exp, iat } = decodeJwt(encoded);
    assert.deepEqual([role, sub, aud, exp - iat], ['admin', 'principal', 'admin', 86400]);
    const [header, payload, signature] = encoded.split('.');
    const tampered = client(server, `bella_admin=${header}.${payload}.${signature[0] === 'a' ? 'b' : 'a'}${signature.slice(1)}`);
    assert.equal((await tampered.request('/admin/state')).status, 401);
    assert.equal((await client(server, 'bella_customer=' + encoded).request('/customer/orders')).status, 401);
    await admin.request('/admin/logout', {});
    assert.equal((await client(server, cookie).request('/admin/state')).status, 401);
    assert.equal((await admin.request('/admin/login', { username: 'admin', password: adminPassword })).status, 200);
    currentTime = new Date(currentTime.getTime() + 86400000);
    assert.equal((await admin.request('/admin/state')).status, 401);
});

test('usuários do painel têm CRUD, credenciais individuais e revogação de acesso', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    const employee = client(server);
    assert.equal((await employee.request('/admin/users')).status, 401);
    await admin.request('/admin/login', { password: adminPassword });
    const draft = { name: 'Operadora de teste', username: 'operadora.qa', active: true, password: 'senha-operadora-teste' };
    const created = await admin.request('/admin/users', draft);
    assert.equal(created.status, 201);
    assert.equal(created.data.username, draft.username);
    assert.ok(!JSON.stringify(created.data).includes('password'));
    const path = '/admin/users/' + created.data.id;
    assert.equal((await admin.request('/admin/users')).data.users.length, 2);
    assert.deepEqual((await admin.request(path)).data, created.data);
    assert.equal((await admin.request('/admin/users', draft)).status, 409);
    const { username, password } = draft;
    assert.equal((await employee.request('/admin/login', { username, password })).status, 200);
    assert.equal((await employee.request('/admin/state')).status, 200);
    assert.equal((await employee.request(path, undefined, { method: 'DELETE' })).status, 409);
    assert.equal((await admin.request(path, { username, name: 'Operadora editada', active: false }, { method: 'PATCH' })).data.name, 'Operadora editada');
    assert.equal((await employee.request('/admin/state')).status, 401);
    assert.equal((await employee.request('/admin/login', { username, password })).status, 401);
    assert.equal((await admin.request(path, undefined, { method: 'DELETE' })).data.ok, true);
    assert.equal((await admin.request(path)).status, 404);
});

test('rotas REST executam os quatro passos dos CRUDs de clientes, produtos e pedidos', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    await admin.request('/admin/login', { password: adminPassword });
    const customer = { name: 'Cadastro REST', phone: '85900004567', postalCode: '01001-000', uf: 'SP', municipalityId: '3550308', municipality: 'São Paulo', address: 'Praça da Sé, 10', neighborhood: 'Sé' };
    const createdCustomer = await admin.request('/admin/customers', customer);
    assert.equal(createdCustomer.status, 201);
    const clientId = createdCustomer.data.result.id;
    assert.equal(createdCustomer.data.result.postalCode, '01001000');
    const product = { name: 'Pudim de teste', price: 13.5, description: 'Sobremesa de teste', category: 'Sobremesas', art: 'pudim', active: true };
    const createdProduct = await admin.request('/admin/products', product);
    assert.equal(createdProduct.status, 201);
    const productId = createdProduct.data.result.id;
    assert.equal(createdProduct.data.result.kind, 'sobremesa');
    const order = { type: 'Retirada', payment: 'Pix', customerId: clientId, items: [{ productId, quantity: 2 }] };
    const createdOrder = await admin.request('/admin/orders', order);
    assert.equal(createdOrder.status, 201);
    const orderId = createdOrder.data.result.id;
    assert.equal(createdOrder.data.result.total, 27);
    assert.equal(createdOrder.data.result.createdAt, now().toISOString());
    assert.equal(createdOrder.data.result.status, 'Recebido');
    assert.equal((await admin.request('/admin/customers/' + clientId)).data.municipality, 'São Paulo');
    assert.ok((await admin.request('/admin/customers')).data.customers.some(({ id }) => id === clientId));
    assert.ok((await admin.request('/admin/products')).data.products.some(({ id }) => id === productId));
    assert.equal((await admin.request('/admin/products/' + productId)).data.name, product.name);
    assert.ok((await admin.request('/admin/orders')).data.orders.some(({ id }) => id === orderId));
    assert.equal((await admin.request('/admin/orders/' + orderId)).data.customerId, clientId);
    const changedCustomer = await admin.request('/admin/customers/' + clientId, { ...customer, name: 'Cadastro alterado' }, { method: 'PATCH' });
    assert.equal(changedCustomer.data.result.name, 'Cadastro alterado');
    assert.equal((await admin.request('/admin/products/' + productId, { ...product, price: 16 }, { method: 'PATCH' })).data.result.price, 16);
    const changedOrder = await admin.request('/admin/orders/' + orderId, { ...order, items: [{ productId, size: 'Unidade', quantity: 1 }] }, { method: 'PATCH' });
    assert.equal(changedOrder.data.result.total, 13.5);
    for (const [collection, id] of [
        ['orders', orderId],
        ['products', productId],
        ['customers', clientId]
    ]) {
        const path = `/admin/${collection}/${id}`;
        assert.equal((await admin.request(path, undefined, { method: 'DELETE' })).status, 200);
        assert.equal((await admin.request(path)).status, 404);
    }
});

test('PATCH parcial preserva campos omitidos e permite limpar um campo explicitamente', async (t) => {
    const server = await listen();
    t.after(() => server.close());
    const admin = client(server);
    await admin.request('/admin/login', { password: adminPassword });
    const patch = (path, changes) => admin.request(path, changes, { method: 'PATCH' });
    const customer = { name: 'Cliente da aula', phone: '85900003114', address: 'Rua de Exemplo, 125', neighborhood: 'Centro', notes: 'Interfone 12' };
    const original = (await admin.request('/admin/customers', customer)).data.result;
    const path = '/admin/customers/' + original.id;
    const renamed = await patch(path, { name: 'Novo nome', phone: customer.phone });
    assert.deepEqual(renamed.data.result, { ...original, name: 'Novo nome' });
    const simultaneous = await Promise.all([patch(path, { name: 'Nome final' }), patch(path, { notes: '' })]);
    assert.ok(simultaneous.every(({ status }) => status === 200));
    const persisted = { ...original, name: 'Nome final', notes: '' };
    assert.deepEqual((await admin.request(path)).data, persisted);
    const revision = (await admin.request('/admin/state')).data.revision;
    for (const invalid of [{}, { id: original.id }, { phone: '1' }]) assert.equal((await patch(path, invalid)).status, 422);
    assert.deepEqual((await admin.request(path)).data, persisted);
    assert.equal((await admin.request('/admin/state')).data.revision, revision);

    const product = (await admin.request('/admin/products', { name: 'Pudim da casa', price: 14, category: 'Sobremesas', description: 'Com calda', art: 'pudim', active: true, featured: true })).data.result;
    const productPath = '/admin/products/' + product.id;
    assert.deepEqual((await patch(productPath, { price: 15 })).data.result, { ...product, price: 15 });
    const order = (await admin.request('/admin/orders', { type: 'Entrega', payment: 'Pix', customerId: original.id, address: customer.address, notes: 'Tocar a campainha', items: [{ productId: product.id, quantity: 2 }] })).data.result;
    assert.equal((await patch(productPath, { active: false, featured: false })).status, 200);
    assert.deepEqual((await admin.request(productPath)).data, { ...product, price: 15, active: false, featured: false });
    const orderPath = '/admin/orders/' + order.id;
    assert.equal((await patch(orderPath, { payment: 'Dinheiro' })).status, 200);
    const updated = (await admin.request(orderPath)).data;
    assert.equal(updated.history.length, order.history.length + 1);
    assert.deepEqual(updated, { ...order, payment: 'Dinheiro', history: updated.history });
    assert.equal((await patch(orderPath, { items: [] })).status, 422);
    assert.deepEqual((await admin.request(orderPath)).data, updated);
});

test('ViaCEP e IBGE preenchem endereços e tratam CEP inexistente e indisponibilidade', async (t) => {
    const calls = [];
    const fetchAddress = async (url) => {
        calls.push(url);
        if (url.includes('01001000')) return Response.json({ logradouro: 'Praça da Sé', bairro: 'Sé', uf: 'SP', ibge: '3550308', localidade: 'São Paulo' });
        if (url.includes('99999999')) return Response.json({ erro: true });
        if (url.includes('/SP/municipios')) return Response.json([{ id: 3550308, nome: 'São Paulo' }]);
        if (url.includes('estados?')) return Response.json([{ sigla: 'SP', nome: 'São Paulo' }]);
        return new Response(null, { status: 503 });
    };
    const server = await listen(':memory:', { fetchAddress });
    t.after(() => server.close());
    const guest = client(server);
    const { data: address } = await guest.request('/addresses/cep/01001000');
    assert.deepEqual(address, { postalCode: '01001000', address: 'Praça da Sé', neighborhood: 'Sé', uf: 'SP', municipalityId: '3550308', municipality: 'São Paulo' });
    assert.equal((await guest.request('/addresses/cep/99999999')).status, 404);
    assert.equal((await guest.request('/addresses/cep/1234')).status, 422);
    assert.deepEqual((await guest.request('/addresses/states')).data, [{ uf: 'SP', name: 'São Paulo' }]);
    assert.deepEqual((await guest.request('/addresses/states/SP/municipalities')).data, [{ id: '3550308', name: 'São Paulo' }]);
    assert.equal((await guest.request('/addresses/states/CE/municipalities')).status, 503);
    assert.equal(calls.length, 5);
    const account = await guest.request('/customer/register', { ...registration('85900001214'), ...address });
    assert.equal(account.data.customer.municipalityId, '3550308');
    assert.equal((await guest.request('/customer/session')).data.customer.uf, 'SP');
});

test('CORS aceita somente origem configurada para credenciais e bloqueia alterações de outras origens', async (t) => {
    const origin = 'https://loja.bella.example';
    const server = await listen(':memory:', { allowedOrigins: [origin] });
    t.after(() => server.close());
    const preflight = (value) => fetch(server.url + '/admin/users', { method: 'OPTIONS', headers: { Origin: value, 'Access-Control-Request-Method': 'POST' } });
    const allowed = await preflight(origin);
    assert.equal(allowed.status, 204);
    assert.equal(allowed.headers.get('access-control-allow-origin'), origin);
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true');
    const denied = await preflight('https://outra.example');
    assert.equal(denied.status, 403);
    assert.equal(denied.headers.get('access-control-allow-origin'), null);
    const admin = client(server);
    assert.equal((await admin.request('/admin/login', { password: adminPassword }, { headers: { Origin: origin } })).status, 200);
});
