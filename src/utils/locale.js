const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });

const statusLabels = {
    INSTOCK: 'Em estoque',
    LOWSTOCK: 'Estoque baixo',
    OUTOFSTOCK: 'Sem estoque',
    PENDING: 'Pendente',
    DELIVERED: 'Entregue',
    RETURNED: 'Devolvido',
    CANCELLED: 'Cancelado',
    unqualified: 'Não qualificado',
    qualified: 'Qualificado',
    new: 'Novo',
    negotiation: 'Em negociação',
    renewal: 'Renovação',
    proposal: 'Proposta'
};

const colorLabels = {
    noir: 'Preto',
    emerald: 'Esmeralda',
    green: 'Verde',
    lime: 'Verde-limão',
    orange: 'Laranja',
    amber: 'Âmbar',
    yellow: 'Amarelo',
    teal: 'Verde-azulado',
    cyan: 'Ciano',
    sky: 'Azul-celeste',
    blue: 'Azul',
    indigo: 'Índigo',
    violet: 'Violeta',
    purple: 'Roxo',
    fuchsia: 'Fúcsia',
    pink: 'Rosa',
    rose: 'Rosé',
    slate: 'Ardósia',
    gray: 'Cinza',
    zinc: 'Zinco',
    neutral: 'Neutro',
    stone: 'Pedra',
    ocean: 'Oceano'
};

export function formatCurrency(value) {
    return currencyFormatter.format(Number(value ?? 0));
}

export function phoneDigits(value) {
    const text = String(value ?? '');
    const digits = text.replace(/\D/g, '');
    return /^\s*\+55/.test(text) && (digits.length === 12 || digits.length === 13) ? digits.slice(2) : digits;
}

export function formatPhone(value) {
    const digits = phoneDigits(value);
    if (digits.length <= 2 || digits.length > 11) return digits;

    const area = digits.slice(0, 2);
    const subscriber = digits.slice(2);
    const split = digits.length === 11 ? 5 : 4;
    const local = subscriber.length > split ? `${subscriber.slice(0, split)}-${subscriber.slice(split)}` : subscriber;
    return `(${area}) ${local}`;
}

export function formatDate(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? '' : dateFormatter.format(date);
}

export function translateStatus(value) {
    return statusLabels[value] ?? statusLabels[String(value).toUpperCase()] ?? value;
}

export function translateColor(value) {
    return colorLabels[value] ?? value;
}
