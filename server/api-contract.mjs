import { CATEGORIES, DRIVERS, ORDER_STATUSES, ORDER_TYPES, PAYMENT_METHODS, SIZES } from '../src/utils/pizzaria.js';

const text = (maxLength, minLength = 0) => ({ type: 'string', minLength, maxLength });
const number = (minimum, maximum, type = 'number') => ({ type, minimum, maximum });
const choice = (values) => ({ enum: values });
const object = (properties, required = Object.keys(properties)) => ({ type: 'object', properties, required });
const patch = (properties) => ({
    type: 'object',
    properties,
    anyOf: Object.keys(properties).filter((key) => key !== 'id').map((key) => ({ required: [key] }))
});
const list = (items, minItems = 0, maxItems) => ({ type: 'array', items, minItems, ...(maxItems === undefined ? {} : { maxItems }) });
const tuple = (prefixItems, minItems = prefixItems.length) => ({ type: 'array', minItems, maxItems: prefixItems.length, ...(prefixItems.length ? { prefixItems } : {}), items: false });
const bool = { type: 'boolean' };
const id = text(128, 1);
const orderId = number(1, Number.MAX_SAFE_INTEGER, 'integer');
const amount = { type: 'number', minimum: 0 };
const dateTime = { type: 'string', format: 'date-time' };
const phone = { ...text(20, 1), description: 'Telefone nacional com DDD e 10 ou 11 dígitos. Aceita pontuação.', examples: ['(85) 91234-5678'] };
const time = { type: 'string', pattern: '^(?:[01]\\d|2[0-3]):[0-5]\\d$', examples: ['18:00'] };
const password = (minimum) => ({ ...text(128, minimum), format: 'password', writeOnly: true });

export const errorCodes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    405: 'METHOD_NOT_ALLOWED',
    409: 'CONFLICT',
    413: 'PAYLOAD_TOO_LARGE',
    415: 'UNSUPPORTED_MEDIA_TYPE',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMITED',
    500: 'INTERNAL_ERROR',
    503: 'SERVICE_UNAVAILABLE'
};

export const adminResources = [
    { path: 'customers', collection: 'customers', item: 'CustomerRecord', draft: 'CustomerDraft', create: 'saveCustomer', update: 'saveCustomer', remove: 'deleteCustomer' },
    { path: 'products', collection: 'products', item: 'Product', draft: 'ProductDraft', create: 'saveProduct', update: 'saveProduct', remove: 'deleteProduct' },
    { path: 'orders', collection: 'orders', item: 'AdminOrder', draft: 'OrderDraft', create: 'createOrder', update: 'updateOrder', remove: 'deleteOrder', numericId: true }
];

export const requestNames = {
    'POST /api/customer/register': 'RegisterCustomer',
    'POST /api/customer/login': 'CustomerLogin',
    'PATCH /api/customer/profile': 'CustomerProfile',
    'POST /api/customer/orders': 'PlaceOrder',
    'POST /api/admin/login': 'AdminLogin',
    'POST /api/admin/users': 'NewAdminUser',
    'PATCH /api/admin/users/:id': 'EditAdminUser',
    'POST /api/admin/activation': 'ActivationRequest',
    'POST /api/admin/import': 'ImportRequest',
    ...Object.fromEntries(
        adminResources.flatMap(({ path, draft, item }) => [
            [`POST /api/admin/${path}`, draft],
            [`PATCH /api/admin/${path}/:id`, item + 'Patch']
        ])
    )
};

export function createSchemas(ref) {
    const postalCode = { type: 'string', pattern: '^(?:\\d{5}-?\\d{3})?$' };
    const uf = { type: 'string', pattern: '^(?:[A-Z]{2})?$' };
    const municipalityId = { type: 'string', pattern: '^(?:\\d{7})?$' };
    const location = { postalCode, uf, municipalityId, municipality: text(100) };
    const profile = { name: text(100, 2), address: text(200), neighborhood: text(80), ...location };
    const profileRequired = ['name', 'address', 'neighborhood'];
    const customer = { ...profile, id, phone, notes: text(400) };
    const username = { ...text(40, 3), pattern: '^[a-zA-Z0-9][a-zA-Z0-9._-]+$' };
    const userFields = { username, name: text(100, 2), active: bool };
    const product = { id, name: text(80, 2), description: text(300), category: choice(CATEGORIES), price: number(0.01, 5000), active: bool, art: text(80), featured: bool };
    const publicSettings = { name: text(50, 2), subtitle: text(60, 2), address: text(200, 8), isOpen: bool, deliveryFee: number(0, 1000), estimatedTime: number(5, 180, 'integer') };
    const orderBody = { payment: choice(PAYMENT_METHODS), address: text(250), notes: text(400), items: list(ref('OrderDraftItem'), 1) };
    const orderDraft = { ...orderBody, type: choice(ORDER_TYPES), customerId: { oneOf: [id, choice(['', null])] } };
    const adminArgs = {
        saveProduct: tuple([ref('ProductDraft')]),
        deleteProduct: tuple([id]),
        saveCustomer: tuple([ref('CustomerDraft')]),
        deleteCustomer: tuple([id]),
        createOrder: tuple([ref('OrderDraft')]),
        updateOrder: tuple([orderId, ref('OrderDraft')]),
        deleteOrder: tuple([orderId]),
        changeStatus: tuple([orderId, bool], 1),
        assignDriver: tuple([orderId, choice([...DRIVERS, '', null])]),
        saveSettings: tuple([ref('Settings')]),
        resetDemo: tuple([])
    };
    const orderSummary = { id: orderId, total: amount, status: choice(ORDER_STATUSES) };

    return {
        Health: object({ status: choice(['ok']), database: choice(['ok']) }),
        OpenApi: { type: 'object', description: 'Documento OpenAPI usado pelo Swagger UI.' },
        Error: object({ error: { type: 'string' }, code: choice(Object.values(errorCodes)), details: list(object({ field: { type: 'string' }, rule: { type: 'string' } })) }, ['error', 'code']),
        Ok: object({ ok: { const: true } }),
        AdminLogin: object({ username, password: password(1) }, ['password']),
        AdminUser: object({ id, ...userFields, system: bool }),
        AdminUserList: object({ users: list(ref('AdminUser')) }),
        NewAdminUser: object({ ...userFields, password: password(12) }),
        EditAdminUser: object({ ...userFields, password: password(12) }, Object.keys(userFields)),
        CustomerLogin: object({ phone, password: password(1) }),
        RegisterCustomer: {
            ...object({ ...profile, phone, password: password(8), code: text(60, 1) }, ['phone', 'password']),
            anyOf: [{ required: ['name'] }, { required: ['code'] }],
            description: 'Use nome para criar uma conta nova ou código para ativar um cadastro do painel.'
        },
        CustomerProfile: object(profile, ['name']),
        CustomerDraft: object(customer, ['name', 'phone']),
        CustomerRecordPatch: patch(customer),
        Customer: object({ id, ...profile, phone }, ['id', 'phone', ...profileRequired]),
        CustomerRecord: object(customer, ['id', 'phone', 'notes', ...profileRequired]),
        CustomerSession: object({ customer: { oneOf: [ref('Customer'), { type: 'null' }] } }),
        CustomerResponse: object({ customer: ref('Customer') }),
        ProductDraft: object(product, ['name', 'category', 'price']),
        ProductPatch: patch(product),
        Product: object({ ...product, kind: choice(['pizza', 'bebida', 'extra', 'sobremesa']) }),
        PublicSettings: object(publicSettings),
        Settings: object({ ...publicSettings, phone, opensAt: time, closesAt: time }, ['name', 'subtitle', 'address', 'deliveryFee', 'estimatedTime', 'phone', 'opensAt', 'closesAt']),
        Menu: object({ products: list(ref('Product')), settings: ref('PublicSettings') }),
        OrderDraftItem: object({ productId: id, quantity: number(1, 50, 'integer'), size: choice([...SIZES.map(({ value }) => value), 'Unidade']) }, ['productId', 'quantity']),
        OrderDraft: object(orderDraft, ['type', 'payment', 'items']),
        AdminOrderPatch: patch(orderDraft),
        PlaceOrder: object(
            {
                ...orderBody,
                items: list(ref('OrderDraftItem'), 1, 30),
                type: choice(['Entrega', 'Retirada']),
                requestId: { type: 'string', pattern: '^[a-zA-Z0-9-]{16,70}$', description: 'Identificador de idempotência. Reutilize o mesmo valor ao reenviar a mesma tentativa.' },
                expectedTotal: amount
            },
            ['requestId', 'type', 'payment', 'items', 'expectedTotal']
        ),
        OrderReceipt: object(orderSummary),
        OrderSummary: object({ ...orderSummary, createdAt: dateTime }),
        OrderList: object({ orders: list(ref('OrderSummary')) }),
        AdminOrder: {
            ...object({
                ...orderSummary,
                ...orderBody,
                type: choice(ORDER_TYPES),
                items: list({ type: 'object', description: 'Item com nome, tamanho, quantidade e preço unitário registrados no pedido.' }),
                customerId: { oneOf: [id, { type: 'null' }] },
                customerName: { type: 'string' },
                createdAt: dateTime,
                phone: { type: 'string' },
                deliveryFee: amount,
                subtotal: amount,
                driver: { type: 'string' },
                history: list(object({ status: choice(ORDER_STATUSES), at: dateTime, action: { type: 'string' } }, ['status', 'at']))
            }),
            description: 'Pedido completo, incluindo as informações preservadas do cadastro e do cardápio.'
        },
        State: object({ products: list(ref('Product')), customers: list(ref('CustomerDraft')), orders: list(ref('AdminOrder')), settings: ref('Settings'), nextOrderId: orderId }),
        AdminState: object({ state: ref('State'), revision: { type: 'integer', minimum: 0 }, canImport: bool }),
        AdminActionResult: { allOf: [ref('AdminState'), object({ result: { description: 'Cadastro ou pedido alterado, ou nulo para operações sem retorno próprio.' } })] },
        ...Object.fromEntries(
            adminResources.flatMap(({ item, collection }) => [
                [`${item}List`, object({ [collection]: list(ref(item)) })],
                [`${item}Change`, { allOf: [ref('AdminState'), object({ result: ref(item) })] }]
            ])
        ),
        DeletedResource: { allOf: [ref('AdminState'), object({ result: { type: 'null' } })] },
        States: list(object({ uf, name: text(100) })),
        Municipalities: list(object({ id: municipalityId, name: text(100) })),
        PostalAddress: object({ ...location, address: text(200), neighborhood: text(80) }),
        AdminAction: {
            oneOf: Object.entries(adminArgs).map(([action, args]) => object({ action: { const: action }, args })),
            examples: [
                { action: 'saveCustomer', args: [{ name: 'Cliente de exemplo', phone: '(85) 91234-5678' }] },
                { action: 'assignDriver', args: [1027, 'Marcos Silva'] }
            ]
        },
        ActivationRequest: object({ customerId: id }),
        Activation: object({ code: { type: 'string' }, expiresAt: { type: 'integer', description: 'Momento de expiração em milissegundos desde a época Unix.' } }),
        ImportRequest: object({ state: { type: 'object', description: 'Snapshot da versão anterior. Aceito apenas no banco sem alterações e sujeito à validação de compatibilidade.' } })
    };
}
