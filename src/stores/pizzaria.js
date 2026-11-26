import { reactive, readonly, ref, watch } from 'vue';
import { useAdmin } from './admin.js';
import { createDemoData } from '../data/pizzaria.js';
import { CATEGORIES, DRIVERS, ORDER_TYPES, PAYMENT_METHODS, canDeleteOrder, canEditOrder, isActiveOrder, money, nextOrderStatus, productKind, productPrice } from '../utils/pizzaria.js';

export const STORAGE_KEY = 'bella-massa:pizzaria:v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
const text = (value) => String(value ?? '').trim();
const validPhone = (value) => /^\d{10,11}$/.test(text(value).replace(/\D/g, ''));

export function validSavedState(value) {
    return (
        value?.version === 1 &&
        Number.isInteger(value.nextOrderId) &&
        Array.isArray(value.products) &&
        Array.isArray(value.customers) &&
        Array.isArray(value.orders) &&
        value.products.every((item) => item?.id && typeof item.name === 'string' && Number.isFinite(item.price) && item.price > 0 && CATEGORIES.includes(item.category)) &&
        value.customers.every((item) => item?.id && typeof item.name === 'string' && typeof item.phone === 'string') &&
        value.orders.every((item) => Number.isInteger(item?.id) && Array.isArray(item.items) && Array.isArray(item.history) && Number.isFinite(item.total) && !Number.isNaN(Date.parse(item.createdAt))) &&
        typeof value.settings?.name === 'string' &&
        Number.isFinite(value.settings.deliveryFee) &&
        Number.isFinite(value.settings.estimatedTime)
    );
}

export function createPizzariaStore({ storage = null, now = () => new Date(), initialState = null } = {}) {
    let initial = initialState ? clone(initialState) : createDemoData(now());
    const storageError = ref('');
    if (storage) {
        try {
            const saved = storage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (validSavedState(parsed)) initial = parsed;
                else storageError.value = 'Os dados salvos não eram compatíveis. Os exemplos foram restaurados.';
            }
        } catch {
            storageError.value = 'Não foi possível ler os dados salvos. Você pode continuar com os exemplos.';
        }
    }
    const state = reactive(initial);
    watch(
        state,
        () => {
            if (!storage) return;
            try {
                storage.setItem(STORAGE_KEY, JSON.stringify(state));
                storageError.value = '';
            } catch {
                storageError.value = 'O navegador não conseguiu salvar as alterações. Elas serão mantidas somente nesta sessão.';
            }
        },
        { deep: true, flush: 'sync' }
    );

    function saveProduct(draft) {
        if (text(draft.name).length < 2) throw new Error('Informe o nome do produto.');
        if (!CATEGORIES.includes(draft.category)) throw new Error('Escolha uma categoria.');
        if (!Number.isFinite(draft.price) || draft.price <= 0 || draft.price > 5000) throw new Error('Informe um preço entre R$ 0,01 e R$ 5.000,00.');
        const existing = state.products.find((product) => product.id === draft.id);
        if (draft.id && !existing) throw new Error('Este produto já foi excluído.');
        const product = {
            id: existing?.id ?? `produto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: text(draft.name),
            description: text(draft.description),
            category: draft.category,
            kind: productKind(draft.category),
            price: money(draft.price),
            active: Boolean(draft.active),
            art: draft.art || 'margherita',
            featured: Boolean(draft.featured)
        };
        if (existing) Object.assign(existing, product);
        else state.products.push(product);
        return product;
    }

    function saveCustomer(draft) {
        if (text(draft.name).length < 2) throw new Error('Informe o nome do cliente.');
        if (!validPhone(draft.phone)) throw new Error('Informe um telefone válido com DDD.');
        const existing = state.customers.find((customer) => customer.id === draft.id);
        if (draft.id && !existing) throw new Error('Este cliente já foi excluído.');
        const customer = {
            id: existing?.id ?? `cliente-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: text(draft.name),
            phone: text(draft.phone),
            address: text(draft.address),
            neighborhood: text(draft.neighborhood),
            postalCode: text(draft.postalCode).replace(/\D/g, ''),
            uf: text(draft.uf),
            municipalityId: text(draft.municipalityId),
            municipality: text(draft.municipality),
            notes: text(draft.notes)
        };
        if (existing) Object.assign(existing, customer);
        else state.customers.unshift(customer);
        return customer;
    }

    function deleteProduct(id) {
        const index = state.products.findIndex((product) => product.id === id);
        if (index < 0) throw new Error('Produto não encontrado.');
        state.products.splice(index, 1);
    }

    function deleteCustomer(id) {
        const index = state.customers.findIndex((customer) => customer.id === id);
        if (index < 0) throw new Error('Cliente não encontrado.');
        state.customers.splice(index, 1);
    }

    function orderFields(draft, previous) {
        if (!ORDER_TYPES.includes(draft.type)) throw new Error('Escolha a forma de atendimento.');
        if (!PAYMENT_METHODS.includes(draft.payment)) throw new Error('Escolha a forma de pagamento.');
        if (!Array.isArray(draft.items) || !draft.items.length) throw new Error('Adicione pelo menos um item ao pedido.');
        const isDelivery = draft.type === 'Entrega';
        const sameCustomer = previous && draft.customerId === previous.customerId;
        const customer = sameCustomer ? null : state.customers.find((item) => item.id === draft.customerId);
        if (draft.customerId && !customer && !sameCustomer) throw new Error('Selecione um cliente cadastrado.');
        if (isDelivery && !draft.customerId) throw new Error('Selecione um cliente para a entrega.');
        if (isDelivery && text(draft.address).length < 8) throw new Error('Informe o endereço completo da entrega.');
        const items = draft.items.map((item) => {
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 50) throw new Error('A quantidade deve ser um número inteiro entre 1 e 50.');
            const registered = previous?.items.find((entry) => entry.productId === item.productId && entry.size === item.size);
            if (registered && item.quantity <= registered.quantity) return { ...registered, quantity: item.quantity };
            const product = state.products.find((entry) => entry.id === item.productId);
            if (!product?.active) throw new Error('Um dos produtos não está disponível. Revise os itens.');
            if (registered) return { ...registered, quantity: item.quantity };
            const size = product.kind === 'pizza' ? item.size : 'Unidade';
            return { productId: product.id, name: product.name, size, quantity: item.quantity, unitPrice: productPrice(product, size), art: product.art, category: product.category };
        });
        const subtotal = money(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
        const deliveryFee = isDelivery ? (previous?.type === 'Entrega' ? previous.deliveryFee : state.settings.deliveryFee) : 0;
        return {
            customerId: draft.customerId || null,
            customerName: sameCustomer ? previous.customerName : (customer?.name ?? 'Consumidor avulso'),
            phone: sameCustomer ? previous.phone : (customer?.phone ?? ''),
            address: isDelivery ? text(draft.address) : '',
            type: draft.type,
            payment: draft.payment,
            items,
            subtotal,
            deliveryFee,
            total: money(subtotal + deliveryFee),
            notes: text(draft.notes)
        };
    }

    function createOrder(draft) {
        if (!state.settings.isOpen) throw new Error('A pizzaria está fechada. Altere a disponibilidade em Configurações para receber pedidos.');
        const fields = orderFields(draft);
        const createdAt = now().toISOString();
        const order = {
            id: state.nextOrderId,
            ...fields,
            driver: '',
            status: 'Recebido',
            createdAt,
            history: [{ status: 'Recebido', at: createdAt }]
        };
        state.nextOrderId++;
        state.orders.unshift(order);
        return order;
    }

    function updateOrder(id, draft) {
        const index = state.orders.findIndex((order) => order.id === id);
        if (index < 0) throw new Error('Pedido não encontrado.');
        const previous = state.orders[index];
        if (!canEditOrder(previous)) throw new Error('Só é possível editar pedidos na situação Recebido.');
        const fields = orderFields(draft, previous);
        const order = {
            ...previous,
            ...fields,
            driver: fields.type === 'Entrega' ? previous.driver : '',
            history: [...previous.history, { status: previous.status, action: 'edited', at: now().toISOString() }]
        };
        state.orders[index] = order;
        return order;
    }

    function deleteOrder(id) {
        const index = state.orders.findIndex((order) => order.id === id);
        if (index < 0) throw new Error('Pedido não encontrado.');
        if (!canDeleteOrder(state.orders[index])) throw new Error('Só é possível excluir pedidos recebidos ou cancelados.');
        state.orders.splice(index, 1);
    }

    function changeStatus(id, cancel = false) {
        const order = state.orders.find((item) => item.id === id);
        if (!order || !isActiveOrder(order)) throw new Error('Este pedido já foi encerrado.');
        const status = cancel ? 'Cancelado' : nextOrderStatus(order);
        if (!status) throw new Error('Não foi possível avançar este pedido.');
        if (status === 'Em entrega' && !order.driver) throw new Error('Selecione um entregador nos detalhes do pedido ou na tela Entregas.');
        order.status = status;
        order.history.push({ status, at: now().toISOString() });
        return order;
    }

    function assignDriver(id, driver) {
        const order = state.orders.find((item) => item.id === id);
        if (!order || order.type !== 'Entrega' || !isActiveOrder(order)) throw new Error('Esta entrega não pode ser alterada.');
        if (driver && !DRIVERS.includes(driver)) throw new Error('Selecione um entregador válido.');
        order.driver = driver ?? '';
    }

    function saveSettings(draft) {
        if (text(draft.name).length < 2 || text(draft.subtitle).length < 2) throw new Error('Informe o nome e a descrição da pizzaria.');
        if (!validPhone(draft.phone)) throw new Error('Informe um telefone válido com DDD.');
        if (text(draft.address).length < 8) throw new Error('Informe o endereço da pizzaria.');
        if (!Number.isFinite(draft.deliveryFee) || draft.deliveryFee < 0 || draft.deliveryFee > 1000) throw new Error('Informe uma taxa de entrega entre R$ 0,00 e R$ 1.000,00.');
        if (!Number.isInteger(draft.estimatedTime) || draft.estimatedTime < 5 || draft.estimatedTime > 180) throw new Error('O prazo estimado deve estar entre 5 e 180 minutos.');
        if (![draft.opensAt, draft.closesAt].every((time) => /^([01]\d|2[0-3]):[0-5]\d$/.test(time))) throw new Error('Informe horários válidos para abertura e fechamento.');
        Object.assign(state.settings, {
            name: text(draft.name),
            subtitle: text(draft.subtitle),
            phone: text(draft.phone),
            address: text(draft.address),
            isOpen: Boolean(draft.isOpen),
            deliveryFee: money(draft.deliveryFee),
            estimatedTime: draft.estimatedTime,
            opensAt: draft.opensAt,
            closesAt: draft.closesAt
        });
    }

    function resetDemo() {
        Object.assign(state, clone(createDemoData(now())));
    }
    return {
        state: readonly(state),
        storageError: readonly(storageError),
        createOrder,
        updateOrder,
        deleteOrder,
        changeStatus,
        assignDriver,
        saveProduct,
        deleteProduct,
        saveCustomer,
        deleteCustomer,
        saveSettings,
        resetDemo
    };
}

export const usePizzaria = useAdmin;
