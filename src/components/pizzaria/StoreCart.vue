<script setup>
import { formatCurrency } from '@/utils/locale';

defineProps({
    rows: { type: Array, required: true },
    type: { type: String, required: true },
    subtotal: { type: Number, required: true },
    fee: { type: Number, required: true },
    total: { type: Number, required: true },
    open: Boolean,
    drawer: Boolean
});
const emit = defineEmits(['changeType', 'quantity', 'checkout']);
</script>

<template>
    <section class="store-cart" :class="{ 'store-cart-drawer': drawer }" aria-label="Carrinho de compras">
        <h2 v-if="!drawer">Seu carrinho</h2>
        <div class="store-delivery-type" role="group" aria-label="Forma de atendimento">
            <button type="button" :aria-pressed="type === 'Entrega'" @click="emit('changeType', 'Entrega')"><i class="pi pi-truck" aria-hidden="true"></i> Entrega</button>
            <button type="button" :aria-pressed="type === 'Retirada'" @click="emit('changeType', 'Retirada')"><i class="pi pi-shop" aria-hidden="true"></i> Retirada</button>
        </div>
        <div v-if="!rows.length" class="store-cart-empty">
            <i class="pi pi-shopping-bag" aria-hidden="true"></i>
            <p>Seu carrinho está vazio.</p>
            <small>Escolha um sabor para começar.</small>
        </div>
        <template v-else>
            <ul class="store-cart-items">
                <li v-for="item in rows" :key="item.key">
                    <img v-if="item.photo" :src="item.photo" width="60" height="60" alt="" />
                    <div class="store-cart-item">
                        <strong>{{ item.name }}</strong>
                        <small>{{ item.sizeLabel }}</small>
                        <div class="store-quantity" role="group" :aria-label="'Quantidade de ' + item.name + ', ' + item.sizeLabel">
                            <button type="button" :aria-label="'Diminuir quantidade de ' + item.name + ', ' + item.sizeLabel" @click="emit('quantity', item.key, -1)"><i class="pi pi-minus" aria-hidden="true"></i></button>
                            <span>{{ item.quantity }}</span>
                            <button type="button" :aria-label="'Aumentar quantidade de ' + item.name + ', ' + item.sizeLabel" :disabled="item.quantity >= 50" @click="emit('quantity', item.key, 1)">
                                <i class="pi pi-plus" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>
                    <strong class="store-cart-item-price">{{ formatCurrency(item.total) }}</strong>
                </li>
            </ul>
            <dl class="store-totals">
                <div>
                    <dt>Subtotal</dt>
                    <dd>{{ formatCurrency(subtotal) }}</dd>
                </div>
                <div v-if="type === 'Entrega'">
                    <dt>Taxa de entrega</dt>
                    <dd>{{ formatCurrency(fee) }}</dd>
                </div>
                <div class="store-cart-total">
                    <dt>Total</dt>
                    <dd>{{ formatCurrency(total) }}</dd>
                </div>
            </dl>
            <Button label="Continuar pedido" class="store-checkout-button" :disabled="!open" @click="emit('checkout')" />
            <p v-if="!open" class="store-availability-note">A pizzaria está fechada no momento.</p>
        </template>
    </section>
</template>
