import { productKind } from './pizzaria.js';

const photos = {
    pizza: [
        { label: 'Tomate e manjericão', value: 'margherita', file: 'margherita' },
        { label: 'Calabresa', value: 'calabresa', file: 'calabresa' },
        { label: 'Frango com catupiry', value: 'frango', file: 'frango' },
        { label: 'Quatro queijos', value: 'queijos', file: 'queijos' },
        { label: 'Portuguesa', value: 'portuguesa', file: 'portuguesa' },
        { label: 'Brócolis com bacon', value: 'brocolis', file: 'brocolis-bacon' },
        { label: 'Chocolate e morango', value: 'chocolate', file: 'chocolate' }
    ],
    bebida: [
        { label: 'Refrigerante de cola', value: 'bebida', file: 'refrigerante' },
        { label: 'Suco de laranja', value: 'suco', file: 'suco' }
    ],
    extra: [{ label: 'Pão de alho gratinado', value: 'pao', file: 'pao-de-alho' }],
    sobremesa: [{ label: 'Pudim de leite', value: 'pudim' }]
};

export function productPhotoOptions(category) {
    return photos[productKind(category)];
}

export function productArtwork(product) {
    if ((product.id ?? product.productId) === 'pizza-7' && product.name === 'Brócolis com bacon' && product.art === 'margherita') return 'brocolis';
    return product.art;
}

export function productPhoto(product) {
    const artwork = productArtwork(product);
    const photo = productPhotoOptions(product.category).find((option) => option.value === artwork);
    return photo?.file ? '/loja/' + photo.file + '.webp' : '';
}
