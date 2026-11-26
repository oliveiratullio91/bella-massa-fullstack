import { dayKey, money, productPrice } from '../utils/pizzaria.js';

export function createDemoData(now = new Date()) {
    const products = [
        { id: 'pizza-1', name: 'Calabresa da casa', description: 'Molho de tomate, muçarela, calabresa fatiada, cebola e orégano.', category: 'Tradicionais', kind: 'pizza', price: 49.9, active: true, art: 'calabresa', featured: true },
        { id: 'pizza-2', name: 'Margherita', description: 'Molho de tomate, muçarela, tomate fresco e folhas de manjericão.', category: 'Tradicionais', kind: 'pizza', price: 46.9, active: true, art: 'margherita', featured: true },
        { id: 'pizza-3', name: 'Frango com catupiry', description: 'Frango desfiado temperado, muçarela e catupiry cremoso.', category: 'Tradicionais', kind: 'pizza', price: 54.9, active: true, art: 'frango', featured: false },
        { id: 'pizza-4', name: 'Quatro queijos', description: 'Muçarela, provolone, parmesão e gorgonzola na medida certa.', category: 'Especiais', kind: 'pizza', price: 59.9, active: true, art: 'queijos', featured: true },
        { id: 'pizza-5', name: 'Portuguesa', description: 'Muçarela, presunto, ovos, cebola, azeitonas e pimentão.', category: 'Especiais', kind: 'pizza', price: 57.9, active: true, art: 'portuguesa', featured: false },
        { id: 'pizza-6', name: 'Chocolate com morango', description: 'Chocolate ao leite cremoso com morangos frescos.', category: 'Doces', kind: 'pizza', price: 52.9, active: true, art: 'chocolate', featured: false },
        { id: 'pizza-7', name: 'Brócolis com bacon', description: 'Brócolis, bacon crocante, muçarela e alho dourado.', category: 'Especiais', kind: 'pizza', price: 56.9, active: false, art: 'brocolis', featured: false },
        { id: 'bebida-1', name: 'Refrigerante 2 L', description: 'Refrigerante de cola, garrafa de 2 litros.', category: 'Bebidas', kind: 'bebida', price: 12, active: true, art: 'bebida', featured: false },
        { id: 'bebida-2', name: 'Suco de laranja 500 ml', description: 'Suco de laranja natural, preparado na hora.', category: 'Bebidas', kind: 'bebida', price: 9.9, active: true, art: 'suco', featured: false },
        { id: 'extra-1', name: 'Pão de alho', description: 'Porção com quatro unidades, gratinadas com muçarela.', category: 'Acompanhamentos', kind: 'extra', price: 18.9, active: true, art: 'pao', featured: false },
        { id: 'sobremesa-1', name: 'Pudim de leite', description: 'Pudim de leite condensado com calda de caramelo.', category: 'Sobremesas', kind: 'sobremesa', price: 12.9, active: true, art: 'pudim', featured: false }
    ];
    const customers = [
        { id: 'cliente-1', name: 'Ana Oliveira', phone: '(85) 99912-3456', address: 'Rua das Flores, 125', neighborhood: 'Centro', notes: 'Prefere pagamento por Pix.' },
        { id: 'cliente-2', name: 'Pedro Santos', phone: '(85) 99823-4567', address: 'Av. Beira Mar, 840, ap. 302', neighborhood: 'Meireles', notes: '' },
        { id: 'cliente-3', name: 'Mariana Costa', phone: '(85) 99734-5678', address: 'Rua dos Girassóis, 56', neighborhood: 'Aldeota', notes: 'Interfone 12.' },
        { id: 'cliente-4', name: 'João Pereira', phone: '(85) 99645-6789', address: 'Rua do Sol, 310', neighborhood: 'Benfica', notes: '' },
        { id: 'cliente-5', name: 'Beatriz Lima', phone: '(85) 99556-7890', address: 'Rua da Paz, 92', neighborhood: 'Cocó', notes: '' },
        { id: 'cliente-6', name: 'Rafael Almeida', phone: '(85) 99467-8901', address: 'Av. Central, 207', neighborhood: 'Fátima', notes: 'Casa com portão azul.' }
    ];
    const settings = { name: 'Bella Massa', subtitle: 'Pizzaria artesanal', phone: '(85) 3333-2020', address: 'Rua dos Sabores, 120 · Fortaleza, CE', isOpen: true, deliveryFee: 6, estimatedTime: 45, opensAt: '18:00', closesAt: '23:30' };
    const dateAt = (offset, hour, minute) => {
        const date = new Date(now);
        date.setDate(date.getDate() + offset);
        return `${dayKey(date)}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-03:00`;
    };
    function demoOrder(id, customerIndex, productIndex, status, type = 'Entrega', offset = 0, minute = 10, withDrink = false) {
        const customer = customers[customerIndex];
        const product = products[productIndex];
        const items = [{ productId: product.id, name: product.name, size: 'Grande', quantity: 1, unitPrice: productPrice(product, 'Grande'), art: product.art, category: product.category }];
        if (withDrink) items.push({ productId: 'bebida-1', name: 'Refrigerante 2 L', size: 'Unidade', quantity: 1, unitPrice: 12, art: 'bebida', category: 'Bebidas' });
        const subtotal = money(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
        const deliveryFee = type === 'Entrega' ? settings.deliveryFee : 0;
        const createdAt = dateAt(offset, offset ? 20 : 18 + Math.floor(minute / 60), minute % 60);
        return {
            id,
            customerId: customer.id,
            customerName: customer.name,
            phone: customer.phone,
            address: `${customer.address} · ${customer.neighborhood}`,
            type,
            status,
            payment: 'Pix',
            items,
            subtotal,
            deliveryFee,
            total: money(subtotal + deliveryFee),
            notes: id === 1027 ? 'Sem cebola, por favor.' : '',
            driver: status === 'Em entrega' ? 'Marcos Silva' : '',
            createdAt,
            history: [{ status, at: createdAt }]
        };
    }
    const orders = [
        demoOrder(1027, 0, 0, 'Recebido', 'Entrega', 0, 112, true),
        demoOrder(1026, 1, 1, 'Em preparo', 'Retirada', 0, 106),
        demoOrder(1025, 2, 3, 'No forno', 'Entrega', 0, 98, true),
        demoOrder(1024, 3, 2, 'Em preparo', 'Balcão', 0, 91),
        demoOrder(1023, 4, 4, 'Pronto', 'Entrega', 0, 84),
        demoOrder(1022, 5, 0, 'Em entrega', 'Entrega', 0, 71, true),
        demoOrder(1021, 0, 1, 'Finalizado', 'Retirada', 0, 55),
        demoOrder(1020, 1, 3, 'Finalizado', 'Entrega', 0, 41, true),
        demoOrder(1019, 2, 5, 'Cancelado', 'Entrega', 0, 35),
        demoOrder(1018, 3, 2, 'Finalizado', 'Balcão', 0, 15)
    ];
    let id = 1017;
    for (let day = 1; day <= 6; day++) {
        for (let item = 0; item < 3 + (day % 3); item++) orders.push(demoOrder(id--, (day + item) % customers.length, (day + item) % 6, 'Finalizado', item % 2 ? 'Retirada' : 'Entrega', -day, 10 + item * 8, item % 2 === 0));
    }
    return { version: 1, nextOrderId: 1028, products, customers, orders, settings };
}
