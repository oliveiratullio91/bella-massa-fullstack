import { adminResources, createSchemas, requestNames } from './api-contract.mjs';

const ref = (name) => ({ $ref: `#/components/schemas/${name}` });
const json = (schema) => ({ 'application/json': { schema } });
const success = (name) => ({ description: 'Solicitação concluída.', content: json(ref(name)) });

const errors = {
    400: 'JSON ou operação inválida.',
    401: 'Sessão ausente ou credenciais inválidas.',
    403: 'Origem da solicitação inválida.',
    404: 'Recurso não encontrado.',
    409: 'Conflito com o estado atual dos dados.',
    413: 'Corpo da solicitação acima do limite.',
    415: 'O corpo da solicitação precisa estar em JSON.',
    422: 'Dados rejeitados pela validação.',
    429: 'Muitas tentativas. Aguarde antes de tentar novamente.',
    500: 'Erro interno.',
    503: 'Banco indisponível.'
};

const catalog = 'Cardápio e serviço';
const account = 'Conta do cliente';
const orders = 'Pedidos da loja';
const admin = 'Painel administrativo';
const addresses = 'Endereços';
const users = 'Usuários do painel';
const paths = {};

function operation(method, path, { tag, id, summary, response, auth, body, failures = [], description, examples, cookie, status = 200, parameter }) {
    const request = body ?? requestNames[`${method.toUpperCase()} /api${path.replace(/\{(\w+)\}/g, ':$1')}`];
    const result = success(response);
    if (cookie) result.headers = { 'Set-Cookie': { description: 'O navegador gerencia o cookie de sessão da operação.', schema: { type: 'string' } } };

    const statusCodes = new Set([...(method === 'get' ? [] : [400, 403, 413, 415]), ...(request ? [422] : []), ...(auth ? [401] : []), ...failures, 500]);
    const entry = {
        tags: [tag],
        operationId: id,
        summary,
        responses: { [status]: result, ...Object.fromEntries([...statusCodes].map((status) => [status, { description: errors[status], content: json(ref('Error')) }])) }
    };
    if (parameter) {
        const [name, schema] = parameter;
        entry.parameters = [{ name, in: 'path', required: true, schema }];
    }
    if (description) entry.description = description;
    if (auth) entry.security = [{ [auth]: [] }];
    if (request) {
        entry.requestBody = { required: true, content: json(ref(request)) };
        if (examples) entry.requestBody.content['application/json'].examples = examples;
    }
    paths[path] ??= {};
    paths[path][method] = entry;
}

operation('get', '/health', { tag: catalog, id: 'healthCheck', summary: 'Verificar serviço e banco', response: 'Health', failures: [503] });
operation('get', '/menu', { tag: catalog, id: 'getMenu', summary: 'Consultar cardápio público', response: 'Menu' });
operation('post', '/receipts/claim', { tag: orders, id: 'claimReceipt', summary: 'Resgatar recibo para envio por e-mail', description: 'Integração entre servidores. O identificador aleatório expira em um minuto e só pode ser usado uma vez.', response: 'MailReceipt', failures: [404] });
operation('get', '/openapi.json', { tag: catalog, id: 'getOpenApi', summary: 'Obter o contrato OpenAPI', response: 'OpenApi' });

operation('get', '/customer/session', { tag: account, id: 'customerSession', summary: 'Consultar sessão da loja', response: 'CustomerSession' });
operation('post', '/customer/register', {
    tag: account,
    id: 'registerCustomer',
    summary: 'Criar conta ou ativar cadastro',
    response: 'CustomerResponse',
    cookie: true,
    failures: [409, 429],
    examples: {
        cadastro: { summary: 'Nova conta', value: { name: 'Cliente de exemplo', phone: '(85) 91234-5678', password: 'senha-de-exemplo' } },
        ativacao: { summary: 'Cadastro feito pelo painel', value: { code: 'codigo-de-exemplo', phone: '(85) 91234-5678', password: 'senha-de-exemplo' } }
    }
});
operation('post', '/customer/login', { tag: account, id: 'customerLogin', summary: 'Entrar na conta', response: 'CustomerResponse', cookie: true, failures: [401, 429] });
operation('post', '/customer/logout', { tag: account, id: 'customerLogout', summary: 'Encerrar sessão da loja', response: 'Ok', cookie: true });
operation('patch', '/customer/profile', { tag: account, id: 'updateProfile', summary: 'Editar perfil', response: 'CustomerResponse', auth: 'customerSession' });

operation('get', '/customer/orders', { tag: orders, id: 'listCustomerOrders', summary: 'Listar os últimos 30 pedidos da conta', response: 'OrderList', auth: 'customerSession' });
operation('post', '/customer/orders', {
    tag: orders,
    id: 'placeOrder',
    summary: 'Enviar pedido à pizzaria',
    response: 'OrderReceipt',
    auth: 'customerSession',
    failures: [409],
    description: 'O servidor recalcula os preços e a taxa. Reenvios com o mesmo identificador de tentativa recuperam o pedido já salvo.',
    examples: {
        entrega: {
            summary: 'Entrega com o cardápio inicial',
            value: { requestId: 'pedido-exemplo-1027', type: 'Entrega', payment: 'Pix', address: 'Rua das Flores, 125, Centro', items: [{ productId: 'pizza-1', size: 'Média', quantity: 1 }], expectedTotal: 48.42 }
        }
    }
});

operation('post', '/admin/login', { tag: admin, id: 'adminLogin', summary: 'Entrar no painel', response: 'AdminState', cookie: true, failures: [401, 429] });
operation('post', '/admin/logout', { tag: admin, id: 'adminLogout', summary: 'Encerrar sessão do painel', response: 'Ok', auth: 'adminSession', cookie: true });
operation('get', '/admin/state', { tag: admin, id: 'getAdminState', summary: 'Consultar dados e revisão do painel', response: 'AdminState', auth: 'adminSession' });
operation('post', '/admin/action', {
    tag: admin,
    id: 'performAdminAction',
    summary: 'Alterar produtos, clientes, pedidos ou configurações',
    response: 'AdminActionResult',
    auth: 'adminSession',
    body: 'AdminAction',
    failures: [409],
    description: 'O campo `action` define a operação e `args` contém seus parâmetros na ordem indicada pelo esquema.'
});
operation('post', '/admin/activation', { tag: admin, id: 'createActivation', summary: 'Gerar código de ativação válido por 24 horas', response: 'Activation', auth: 'adminSession', failures: [404, 409] });
operation('post', '/admin/import', { tag: admin, id: 'importLegacyState', summary: 'Importar dados da versão anterior', response: 'AdminState', auth: 'adminSession', failures: [409] });

const identifier = ['id', { type: 'string', minLength: 1 }];
const userOperations = { tag: users, auth: 'adminSession' };
operation('get', '/admin/users', { ...userOperations, id: 'listAdminUsers', summary: 'Listar usuários do painel', response: 'AdminUserList' });
operation('get', '/admin/users/{id}', { ...userOperations, id: 'readAdminUser', summary: 'Consultar usuário do painel', response: 'AdminUser', parameter: identifier, failures: [404] });
operation('post', '/admin/users', { ...userOperations, id: 'createAdminUser', summary: 'Criar usuário do painel', response: 'AdminUser', status: 201, failures: [409] });
operation('patch', '/admin/users/{id}', { ...userOperations, id: 'updateAdminUser', summary: 'Atualizar usuário do painel', response: 'AdminUser', parameter: identifier, failures: [404, 409] });
operation('delete', '/admin/users/{id}', { ...userOperations, id: 'deleteAdminUser', summary: 'Excluir usuário do painel', response: 'Ok', parameter: identifier, failures: [404, 409] });

const resourceLabels = {
    customers: { tag: 'Clientes do painel', plural: 'clientes', singular: 'cliente' },
    products: { tag: 'Produtos do cardápio', plural: 'produtos', singular: 'produto' },
    orders: { tag: 'Pedidos do painel', plural: 'pedidos', singular: 'pedido' }
};
for (const { path, item, numericId } of adminResources) {
    const base = '/admin/' + path;
    const resource = base + '/{id}';
    const { tag, plural, singular } = resourceLabels[path];
    const access = { tag, auth: 'adminSession' };
    const parameter = numericId ? ['id', { type: 'integer', minimum: 1 }] : identifier;
    operation('get', base, { ...access, id: 'list' + item, summary: 'Listar ' + plural, response: item + 'List' });
    operation('get', resource, { ...access, id: 'read' + item, summary: 'Consultar ' + singular, response: item, parameter, failures: [404] });
    operation('post', base, { ...access, id: 'create' + item, summary: 'Cadastrar ' + singular, response: item + 'Change', status: 201, failures: [409] });
    operation('patch', resource, { ...access, id: 'update' + item, summary: 'Editar ' + singular, description: 'Envie os campos que deseja alterar. Os campos omitidos conservam o valor salvo.', response: item + 'Change', parameter, failures: [404, 409] });
    operation('delete', resource, { ...access, id: 'delete' + item, summary: 'Excluir ' + singular, response: 'DeletedResource', parameter, failures: [404, 409, 422] });
}

operation('get', '/addresses/cep/{cep}', { tag: addresses, id: 'lookupCep', summary: 'Consultar CEP no ViaCEP', response: 'PostalAddress', parameter: ['cep', { type: 'string', pattern: '^\\d{8}$' }], failures: [404, 422, 503] });
operation('get', '/addresses/states', { tag: addresses, id: 'listStates', summary: 'Listar estados no IBGE', response: 'States', failures: [503] });
operation('get', '/addresses/states/{uf}/municipalities', {
    tag: addresses,
    id: 'listMunicipalities',
    summary: 'Listar municípios do estado no IBGE',
    response: 'Municipalities',
    parameter: ['uf', { type: 'string', pattern: '^[A-Z]{2}$' }],
    failures: [422, 503]
});

const sessionScheme = (name, description) => ({ type: 'apiKey', in: 'cookie', name, description });

export const openApiDocument = {
    openapi: '3.1.2',
    info: {
        title: 'Bella Massa API',
        version: '1.1.0',
        description: 'API da loja e do painel da pizzaria. Para testar rotas protegidas, entre com a conta correspondente na loja, no painel ou pelas rotas de login abaixo. Use Try it out e Execute na operação desejada. O navegador envia o JWT automaticamente em um cookie HttpOnly. Operações de escrita alteram o banco do ambiente aberto.'
    },
    servers: [{ url: '/api', description: 'Servidor atual' }],
    tags: [catalog, account, orders, admin, ...Object.values(resourceLabels).map(({ tag }) => tag), users, addresses].map((name) => ({ name })),
    paths,
    components: {
        schemas: createSchemas(ref),
        securitySchemes: {
            customerSession: sessionScheme('bella_customer', 'JWT em cookie HttpOnly emitido no login ou cadastro da loja.'),
            adminSession: sessionScheme('bella_admin', 'JWT em cookie HttpOnly emitido no login do painel.')
        }
    }
};
