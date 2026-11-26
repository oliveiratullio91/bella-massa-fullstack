export const CATEGORIES = ['Tradicionais', 'Especiais', 'Doces', 'Bebidas', 'Acompanhamentos', 'Sobremesas'];
export const ORDER_TYPES = ['Entrega', 'Retirada', 'Balcão'];
export const PAYMENT_METHODS = ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Dinheiro'];
export const ORDER_STATUSES = ['Recebido', 'Em preparo', 'No forno', 'Pronto', 'Em entrega', 'Finalizado', 'Cancelado'];
export const SIZES = [
    { label: 'Pequena · 4 fatias', value: 'Pequena', factor: 0.7 },
    { label: 'Média · 6 fatias', value: 'Média', factor: 0.85 },
    { label: 'Grande · 8 fatias', value: 'Grande', factor: 1 }
];
export const DRIVERS = ['Marcos Silva', 'Camila Costa', 'Lucas Almeida'];
export const TERMINAL_STATUSES = ['Finalizado', 'Cancelado'];
export const money = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
export const initials = (name) =>
    String(name)
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
export const isActiveOrder = (order) => !TERMINAL_STATUSES.includes(order.status);
export const canEditOrder = (order) => order.status === 'Recebido';
export const canDeleteOrder = (order) => canEditOrder(order) || order.status === 'Cancelado';
export const dayKey = (value = new Date()) => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Fortaleza' }).format(new Date(value));
export const formatTime = (value) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Fortaleza' }).format(new Date(value));

export function productPrice(product, size = 'Grande') {
    if (product.kind !== 'pizza') return money(product.price);
    const option = SIZES.find((item) => item.value === size);
    if (!option) throw new Error('Escolha um tamanho válido para a pizza.');
    return money(product.price * option.factor);
}

export function productKind(category) {
    if (category === 'Bebidas') return 'bebida';
    if (category === 'Acompanhamentos') return 'extra';
    if (category === 'Sobremesas') return 'sobremesa';
    return 'pizza';
}

export function orderItemSize(item) {
    return item.size === 'Unidade' && productKind(item.category) === 'extra' ? 'Porção' : item.size;
}

export function nextOrderStatus(order) {
    if (!isActiveOrder(order)) return null;
    const flow = ['Recebido', 'Em preparo', 'No forno', 'Pronto', ...(order.type === 'Entrega' ? ['Em entrega'] : []), 'Finalizado'];
    return flow[flow.indexOf(order.status) + 1] ?? null;
}

export function statusSeverity(status) {
    return { Recebido: 'info', 'Em preparo': 'warn', 'No forno': 'warn', Pronto: 'success', 'Em entrega': 'info', Finalizado: 'secondary', Cancelado: 'danger' }[status] ?? 'secondary';
}

export function summarizeOrders(orders, date = new Date()) {
    const today = orders.filter((order) => dayKey(order.createdAt) === dayKey(date));
    const completed = orders.filter((order) => order.status === 'Finalizado' && dayKey(completionDate(order)) === dayKey(date));
    const revenue = money(completed.reduce((sum, order) => sum + order.total, 0));
    return { count: today.length, active: orders.filter(isActiveOrder).length, revenue, average: completed.length ? money(revenue / completed.length) : 0, completed: completed.length };
}

export function completionDate(order) {
    return order.history?.findLast((event) => event.status === 'Finalizado')?.at ?? order.createdAt;
}
