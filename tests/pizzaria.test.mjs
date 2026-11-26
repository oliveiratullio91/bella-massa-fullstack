import assert from 'node:assert/strict';
import test from 'node:test';
import { createPizzariaStore, STORAGE_KEY } from '../src/stores/pizzaria.js';
import { formatPhone, phoneDigits } from '../src/utils/locale.js';
import { dayKey, productPrice, summarizeOrders } from '../src/utils/pizzaria.js';

const now = () => new Date('2026-10-29T23:00:00-03:00');
const createStore = (options = {}) => createPizzariaStore({ now, ...options });
const orderDraft = (overrides = {}) => ({
    customerId: 'cliente-1',
    type: 'Entrega',
    address: 'Rua das Flores, 125 · Centro',
    payment: 'Pix',
    notes: '',
    items: [
        { productId: 'pizza-1', size: 'Média', quantity: 2 },
        { productId: 'bebida-1', quantity: 1 }
    ],
    ...overrides
});

test('telefones brasileiros são formatados com DDD e mantêm os dígitos para busca', () => {
    assert.equal(formatPhone('85912345678'), '(85) 91234-5678');
    assert.equal(formatPhone('8532345678'), '(85) 3234-5678');
    assert.equal(formatPhone('(85) 3234-5678'), '(85) 3234-5678');
    assert.equal(formatPhone('+55 (85) 91234-5678'), '(85) 91234-5678');
    assert.equal(formatPhone('8591'), '(85) 91');
    assert.equal(formatPhone(''), '');
    assert.equal(phoneDigits('(85) 91234-5678'), '85912345678');
    assert.equal(phoneDigits('859123456789'), '859123456789');
});

test('preços por tamanho e taxa são arredondados em centavos', () => {
    const store = createStore();
    assert.equal(productPrice(store.state.products[0], 'Média'), 42.42);
    const order = store.createOrder(orderDraft());
    assert.equal(order.subtotal, 96.84);
    assert.equal(order.deliveryFee, 6);
    assert.equal(order.total, 102.84);
    const pickup = store.createOrder(orderDraft({ type: 'Retirada', customerId: null, address: '' }));
    assert.equal(pickup.deliveryFee, 0);
    assert.equal(pickup.customerName, 'Consumidor avulso');
});

test('pedido inválido não altera a fila nem consome o número do pedido', () => {
    const store = createStore();
    const count = store.state.orders.length;
    const nextId = store.state.nextOrderId;
    assert.throws(() => store.createOrder(orderDraft({ items: [] })), /pelo menos um item/);
    assert.throws(() => store.createOrder(orderDraft({ customerId: null })), /cliente para a entrega/);
    assert.throws(() => store.createOrder(orderDraft({ address: '' })), /endereço completo/);
    assert.throws(() => store.createOrder(orderDraft({ items: [{ productId: 'pizza-7', size: 'Grande', quantity: 1 }] })), /não está disponível/);
    assert.throws(() => store.createOrder(orderDraft({ items: [{ productId: 'pizza-1', size: 'Grande', quantity: 1.5 }] })), /número inteiro/);
    assert.equal(store.state.orders.length, count);
    assert.equal(store.state.nextOrderId, nextId);
});

test('alterar o cardápio ou a taxa não altera pedidos já registrados', () => {
    const store = createStore();
    const order = store.createOrder(orderDraft());
    store.saveProduct({ ...store.state.products[0], name: 'Novo nome', price: 100 });
    store.saveSettings({ ...store.state.settings, deliveryFee: 15 });
    assert.equal(order.items[0].name, 'Calabresa da casa');
    assert.equal(order.items[0].unitPrice, 42.42);
    assert.equal(order.total, 102.84);
    assert.equal(store.createOrder(orderDraft()).total, 197);
});

test('edição persiste mantendo o número, os preços e a taxa do pedido original', () => {
    const values = new Map();
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const store = createStore({ storage });
    const order = store.createOrder(orderDraft());
    store.saveProduct({ ...store.state.products[0], price: 100 });
    store.saveSettings({ ...store.state.settings, deliveryFee: 15, isOpen: false });
    store.updateOrder(order.id, { ...order, payment: 'Dinheiro', notes: 'Sem azeitonas', items: [{ ...order.items[0], quantity: 3 }] });

    const reloaded = createStore({ storage });
    const edited = reloaded.state.orders.find((entry) => entry.id === order.id);
    assert.equal(edited.createdAt, order.createdAt);
    assert.equal(edited.payment, 'Dinheiro');
    assert.equal(edited.notes, 'Sem azeitonas');
    assert.equal(edited.total, 133.26);
    assert.equal(edited.history.at(-1).action, 'edited');
    assert.equal(reloaded.state.nextOrderId, order.id + 1);
    assert.throws(() => reloaded.updateOrder(order.id, { ...edited, items: [] }), /pelo menos um item/);
    assert.equal(reloaded.state.orders.find((entry) => entry.id === order.id).total, 133.26);
});

test('excluir cadastros mantém os dados anteriores dos pedidos e remove as opções para novos pedidos', () => {
    const store = createStore();
    const order = store.createOrder(orderDraft());
    const customer = { ...store.state.customers.find(({ id }) => id === order.customerId) };
    const product = { ...store.state.products.find(({ id }) => id === order.items[0].productId) };
    store.deleteProduct(product.id);
    store.deleteCustomer(customer.id);

    assert.ok(!store.state.customers.some(({ id }) => id === customer.id));
    assert.ok(!store.state.products.some(({ id }) => id === product.id));
    assert.throws(() => store.saveCustomer(customer), /já foi excluído/);
    assert.throws(() => store.saveProduct(product), /já foi excluído/);
    assert.throws(() => store.createOrder(orderDraft()), /cliente cadastrado/);
    assert.throws(() => store.createOrder(orderDraft({ customerId: 'cliente-2' })), /não está disponível/);

    const edited = store.updateOrder(order.id, { ...order, notes: 'Manter o endereço registrado' });
    assert.equal(edited.customerName, customer.name);
    assert.equal(edited.phone, customer.phone);
    assert.equal(edited.address, order.address);
    assert.deepEqual(edited.items[0], order.items[0]);
    assert.throws(() => store.updateOrder(order.id, { ...edited, items: [{ ...edited.items[0], quantity: 3 }] }), /não está disponível/);
});

test('exclusão de pedidos respeita a etapa, preserva o faturamento e não reutiliza números', () => {
    const values = new Map();
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const store = createStore({ storage });
    const initialRevenue = summarizeOrders(store.state.orders, now()).revenue;
    assert.throws(() => store.deleteOrder(1026), /recebidos ou cancelados/);
    assert.throws(() => store.deleteOrder(1021), /recebidos ou cancelados/);
    assert.throws(() => store.updateOrder(1026, orderDraft()), /situação Recebido/);
    assert.throws(() => store.updateOrder(1019, orderDraft()), /situação Recebido/);
    const order = store.createOrder(orderDraft());
    store.deleteOrder(order.id);
    store.deleteOrder(1019);

    const reloaded = createStore({ storage });
    assert.ok(!reloaded.state.orders.some(({ id }) => id === order.id || id === 1019));
    assert.equal(summarizeOrders(reloaded.state.orders, now()).revenue, initialRevenue);
    assert.equal(reloaded.createOrder(orderDraft()).id, order.id + 1);
});

test('entrega só sai com entregador e um pedido encerrado não pode avançar', () => {
    const store = createStore();
    const order = store.createOrder(orderDraft());
    for (let step = 0; step < 3; step++) store.changeStatus(order.id);
    assert.equal(order.status, 'Pronto');
    assert.throws(() => store.changeStatus(order.id), /entregador/);
    store.assignDriver(order.id, 'Marcos Silva');
    assert.equal(store.changeStatus(order.id).status, 'Em entrega');
    assert.equal(store.changeStatus(order.id).status, 'Finalizado');
    assert.equal(order.history.length, 6);
    assert.throws(() => store.changeStatus(order.id), /encerrado/);
    assert.throws(() => store.changeStatus(order.id, true), /encerrado/);
});

test('retirada pula a etapa de entrega e cancelamento preserva o histórico', () => {
    const store = createStore();
    const pickup = store.createOrder(orderDraft({ type: 'Retirada' }));
    for (let step = 0; step < 4; step++) store.changeStatus(pickup.id);
    assert.equal(pickup.status, 'Finalizado');
    assert.ok(!pickup.history.some((event) => event.status === 'Em entrega'));
    const cancelled = store.createOrder(orderDraft());
    store.changeStatus(cancelled.id, true);
    assert.equal(cancelled.history.at(-1).status, 'Cancelado');
    assert.throws(() => store.changeStatus(cancelled.id), /encerrado/);
});

test('fechar a pizzaria bloqueia apenas novos pedidos', () => {
    const store = createStore();
    store.saveSettings({ ...store.state.settings, isOpen: false });
    assert.throws(() => store.createOrder(orderDraft()), /pizzaria está fechada/);
    assert.equal(store.changeStatus(1027).status, 'Em preparo');
});

test('dados são persistidos, recarregados e restaurados com exemplos', () => {
    const values = new Map();
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
    const store = createStore({ storage });
    const order = store.createOrder(orderDraft());
    const reloaded = createStore({ storage });
    assert.equal(reloaded.state.orders[0].id, order.id);
    assert.equal(reloaded.state.orders[0].total, 102.84);
    assert.equal(reloaded.state.nextOrderId, order.id + 1);
    reloaded.resetDemo();
    assert.equal(reloaded.state.nextOrderId, 1028);
    assert.equal(JSON.parse(values.get(STORAGE_KEY)).orders[0].id, 1027);
});

test('armazenamento corrompido ou indisponível não impede o uso', () => {
    const corrupt = createStore({ storage: { getItem: () => '{inválido', setItem: () => {} } });
    assert.ok(corrupt.state.products.length > 0);
    assert.ok(corrupt.storageError.value);
    const blocked = createStore({
        storage: {
            getItem: () => null,
            setItem: () => {
                throw new Error('quota');
            }
        }
    });
    blocked.createOrder(orderDraft());
    assert.match(blocked.storageError.value, /somente nesta sessão/);
});

test('faturamento conta apenas finalizados e respeita a data em Fortaleza', () => {
    const orders = [
        { createdAt: '2026-10-30T02:30:00Z', status: 'Finalizado', total: 100 },
        { createdAt: '2026-10-29T21:00:00Z', status: 'Recebido', total: 200 },
        { createdAt: '2026-10-29T21:00:00Z', status: 'Cancelado', total: 300 },
        { createdAt: '2026-10-30T04:00:00Z', status: 'Finalizado', total: 400 }
    ];
    assert.equal(dayKey('2026-10-30T02:30:00Z'), '2026-10-29');
    assert.deepEqual(summarizeOrders(orders, now()), { count: 3, active: 1, revenue: 100, average: 100, completed: 1 });
});

test('pedido de ontem finalizado hoje entra no faturamento do dia da conclusão', () => {
    const orders = [
        {
            createdAt: '2026-10-28T22:00:00-03:00',
            status: 'Finalizado',
            total: 75.9,
            history: [
                { status: 'Recebido', at: '2026-10-28T22:00:00-03:00' },
                { status: 'Finalizado', at: '2026-10-29T00:10:00-03:00' }
            ]
        }
    ];
    assert.equal(summarizeOrders(orders, now()).revenue, 75.9);
    assert.equal(summarizeOrders(orders, new Date('2026-10-28T22:00:00-03:00')).revenue, 0);
});
