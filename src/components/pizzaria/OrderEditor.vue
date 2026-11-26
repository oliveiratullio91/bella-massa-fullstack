<script setup>
import { computed, ref, watch } from 'vue';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency } from '@/utils/locale';
import { ORDER_TYPES, PAYMENT_METHODS, SIZES, money, orderItemSize, productPrice } from '@/utils/pizzaria';
import { productPhoto } from '@/utils/productMedia';
import { lastFormField, notify } from '@/service/feedback';
import PizzaArt from './PizzaArt.vue';

const props = defineProps({ visible: Boolean, orderId: Number });
const emit = defineEmits(['update:visible', 'saved']);
const { state, createOrder, updateOrder } = usePizzaria();

const draft = ref({});
const selectedProduct = ref(null);
const size = ref('Grande');
const quantity = ref(1);
const saving = ref(false);
const original = computed(() => state.orders.find((order) => order.id === props.orderId));
const customers = computed(() => {
    const customerId = original.value?.customerId;
    if (!customerId || state.customers.some((customer) => customer.id === customerId)) return state.customers;
    return [...state.customers, { id: customerId, name: `${original.value.customerName} (cadastro excluído)` }];
});
const availableProducts = computed(() => state.products.filter((product) => product.active));
const singleSize = computed(() => selectedProduct.value && selectedProduct.value.kind !== 'pizza');
const subtotal = computed(() => money((draft.value.items ?? []).reduce((sum, item) => sum + item.unitPrice * (Number(item.quantity) || 0), 0)));
const fee = computed(() => {
    if (draft.value.type !== 'Entrega') return 0;
    return original.value?.type === 'Entrega' ? original.value.deliveryFee : state.settings.deliveryFee;
});
watch(
    () => props.visible,
    (visible) => {
        if (!visible) return;
        const order = original.value;
        draft.value = order ? { ...order, items: order.items.map((item) => ({ ...item })) } : { customerId: null, type: 'Entrega', address: '', payment: 'Pix', notes: '', items: [] };
        selectedProduct.value = null;
        size.value = 'Grande';
        quantity.value = 1;
    },
    { immediate: true }
);
function selectCustomer(id) {
    draft.value.customerId = id;
    if (original.value && original.value.customerId === id) {
        draft.value.address = original.value.address;
        return;
    }
    const customer = state.customers.find((entry) => entry.id === id);
    draft.value.address = customer ? [customer.address, customer.neighborhood].filter(Boolean).join(' · ') : '';
}

function addItem() {
    if (!selectedProduct.value) {
        notify({ severity: 'warn', summary: 'Confira o item', detail: 'Escolha um produto para adicionar.', focusTarget: document.getElementById('order-product') });
        return;
    }
    if (!Number.isInteger(quantity.value) || quantity.value < 1 || quantity.value > 50) {
        notify({ severity: 'warn', summary: 'Confira o item', detail: 'Informe uma quantidade entre 1 e 50.', focusTarget: document.getElementById('order-quantity') });
        return;
    }
    const product = selectedProduct.value;
    const itemSize = product.kind === 'pizza' ? size.value : 'Unidade';
    const existing = draft.value.items.find((item) => item.productId === product.id && item.size === itemSize);
    if (existing && existing.quantity + quantity.value > 50) {
        notify({ severity: 'warn', summary: 'Confira o item', detail: 'O limite é de 50 unidades por item.', focusTarget: document.getElementById('order-quantity') });
        return;
    }
    if (existing) existing.quantity += quantity.value;
    else {
        const registered = original.value?.items.find((item) => item.productId === product.id && item.size === itemSize);
        const item = registered ?? { productId: product.id, name: product.name, art: product.art, category: product.category, size: itemSize, unitPrice: productPrice(product, itemSize) };
        draft.value.items.push({ ...item, quantity: quantity.value });
    }
    selectedProduct.value = null;
    quantity.value = 1;
}

async function save(event) {
    if (saving.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    saving.value = true;
    try {
        const order = await (props.orderId ? updateOrder(props.orderId, draft.value) : createOrder(draft.value));
        notify({
            severity: 'success',
            summary: props.orderId ? 'Pedido atualizado' : 'Pedido recebido',
            detail: `Pedido #${order.id} salvo.`
        });
        emit('update:visible', false);
        emit('saved', order.id, Boolean(props.orderId));
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível salvar o pedido', detail: exception.message, focusTarget });
    } finally {
        saving.value = false;
    }
}
</script>

<template>
    <Dialog :visible="visible" modal :header="orderId ? 'Editar pedido #' + orderId : 'Novo pedido'" :style="{ width: '880px' }" :breakpoints="{ '960px': '94vw' }" @update:visible="emit('update:visible', $event)">
        <form v-feedback-form class="order-form" @submit.prevent="save">
            <div class="form-grid">
                <div class="field">
                    <label for="order-type">Atendimento <span>*</span></label
                    ><Select inputId="order-type" aria-label="Atendimento" v-model="draft.type" :options="ORDER_TYPES" placeholder="Selecione o atendimento" fluid />
                </div>
                <div class="field">
                    <label for="order-customer">Cliente <span v-if="draft.type === 'Entrega'">*</span></label
                    ><Select
                        inputId="order-customer"
                        aria-label="Cliente"
                        :modelValue="draft.customerId"
                        :options="customers"
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Selecione um cliente"
                        filter
                        filterPlaceholder="Nome do cliente"
                        emptyFilterMessage="Nenhum cliente encontrado"
                        :showClear="draft.type !== 'Entrega'"
                        fluid
                        @update:modelValue="selectCustomer"
                    /><small v-if="draft.type !== 'Entrega'">Deixe em branco para consumidor avulso.</small>
                </div>
                <div v-if="draft.type === 'Entrega'" class="field full">
                    <label for="order-address">Endereço de entrega <span>*</span></label
                    ><InputText id="order-address" v-model="draft.address" placeholder="Ex.: Rua das Flores, 125, ap. 302, Centro" maxlength="250" fluid />
                </div>
            </div>
            <div class="section-divider">
                <h3>Itens do pedido</h3>
            </div>
            <div class="item-picker">
                <div class="field">
                    <label for="order-product">Produto</label
                    ><Select
                        inputId="order-product"
                        aria-label="Produto do pedido"
                        v-model="selectedProduct"
                        :options="availableProducts"
                        optionLabel="name"
                        placeholder="Escolha um produto"
                        filter
                        filterPlaceholder="Nome do produto"
                        emptyFilterMessage="Nenhum produto encontrado"
                        emptyMessage="Nenhum produto disponível"
                        fluid
                    />
                </div>
                <div class="field">
                    <label for="order-size">{{ singleSize ? 'Venda' : 'Tamanho' }}</label>
                    <InputText v-if="singleSize" id="order-size" :modelValue="orderItemSize({ category: selectedProduct.category, size: 'Unidade' })" readonly fluid />
                    <Select v-else inputId="order-size" aria-label="Tamanho da pizza" v-model="size" :options="SIZES" optionLabel="label" optionValue="value" placeholder="Selecione o tamanho" :disabled="!selectedProduct" fluid />
                </div>
                <div class="field"><label for="order-quantity">Quantidade</label><InputNumber inputId="order-quantity" v-model="quantity" placeholder="1" locale="pt-BR" :min="1" :max="50" :useGrouping="false" fluid /></div>
                <Button icon="pi pi-plus" label="Adicionar" severity="secondary" @click="addItem" />
            </div>
            <div v-if="!draft.items?.length" class="cart-empty">
                <i class="pi pi-shopping-bag" aria-hidden="true"></i>
                <p>Seu pedido ainda está sem itens.</p>
                <small>Adicione uma pizza, bebida ou acompanhamento acima.</small>
            </div>
            <ul v-else class="cart-items">
                <li v-for="(item, index) in draft.items" :key="item.productId + item.size">
                    <div class="cart-thumb">
                        <img v-if="productPhoto(item)" :src="productPhoto(item)" width="42" height="42" alt="" />
                        <PizzaArt v-else :variant="item.art" />
                    </div>
                    <div class="cart-item-name">
                        <strong>{{ item.name }}</strong
                        ><small>{{ orderItemSize(item) }} · {{ formatCurrency(item.unitPrice) }} cada</small>
                    </div>
                    <InputNumber v-model="item.quantity" :inputId="'cart-quantity-' + index" :aria-label="'Quantidade de ' + item.name" placeholder="1" locale="pt-BR" :min="1" :max="50" :useGrouping="false" class="cart-quantity" />
                    <strong>{{ formatCurrency(item.unitPrice * (Number(item.quantity) || 0)) }}</strong
                    ><Button icon="pi pi-trash" :aria-label="'Remover ' + item.name" text severity="secondary" @click="draft.items.splice(index, 1)" />
                </li>
            </ul>
            <div class="form-grid mt-5">
                <div class="field">
                    <label for="order-payment">Pagamento <span>*</span></label
                    ><Select inputId="order-payment" aria-label="Forma de pagamento" v-model="draft.payment" :options="PAYMENT_METHODS" placeholder="Selecione o pagamento" fluid /><small
                        >A forma de pagamento é apenas registrada neste protótipo.</small
                    >
                </div>
                <div class="field"><label for="order-notes">Observações</label><Textarea id="order-notes" v-model="draft.notes" placeholder="Ex.: sem cebola ou interfone 12" rows="2" maxlength="400" fluid /></div>
            </div>
            <div class="order-totals">
                <div>
                    <span>Subtotal</span><strong>{{ formatCurrency(subtotal) }}</strong>
                </div>
                <div>
                    <span>Taxa de entrega</span><strong>{{ formatCurrency(fee) }}</strong>
                </div>
                <div class="grand-total">
                    <span>Total do pedido</span><strong>{{ formatCurrency(money(subtotal + fee)) }}</strong>
                </div>
            </div>
            <div class="dialog-actions">
                <Button label="Voltar" severity="secondary" text @click="emit('update:visible', false)" />
                <Button type="submit" :label="orderId ? 'Salvar alterações' : 'Confirmar pedido'" icon="pi pi-check" :disabled="!draft.items?.length" :loading="saving" />
            </div>
        </form>
    </Dialog>
</template>
