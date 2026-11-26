<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import PizzaArt from '@/components/pizzaria/PizzaArt.vue';
import StoreAccount from '@/components/pizzaria/StoreAccount.vue';
import StoreCart from '@/components/pizzaria/StoreCart.vue';
import { lastFormField, notify } from '@/service/feedback';
import { api } from '@/service/api';
import { formatCurrency } from '@/utils/locale';
import { CATEGORIES, PAYMENT_METHODS, SIZES, money, orderItemSize, productPrice } from '@/utils/pizzaria';
import { productPhoto } from '@/utils/productMedia';
import '@/styles/storefront.scss';

const CART_KEY = 'bella-massa:carrinho:v1';
const catalog = ref([]);
const settings = ref(null);
const loading = ref(true);
const menuError = ref('');
const accountOpen = ref(false);
const customer = ref(null);
const drawerOpen = ref(false);
const checkoutOpen = ref(false);
const accountForCheckout = ref(false);
const categories = ['Todas', ...CATEGORIES];
const category = ref('Todas');
const selectedSizes = ref({});
const cartAnchor = ref(null);
const addFeedback = ref(null);
const announcement = ref('');
const cart = ref([]);
const type = ref('Entrega');
const checkout = ref({ address: '', payment: 'Pix', notes: '' });
const submitting = ref(false);
let feedbackTimer;
let refreshTimer;
let menuUpdating = false;
let attempt = null;

function cartKey(item) {
    return item.productId + ':' + item.size;
}

try {
    const saved = JSON.parse(window.localStorage.getItem(CART_KEY));
    if (Array.isArray(saved?.items)) {
        cart.value = saved.items.filter((item) => typeof item?.productId === 'string' && typeof item.size === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 50).slice(0, 30);
        type.value = saved.type === 'Retirada' ? 'Retirada' : 'Entrega';
    }
} catch {
    /* O carrinho também pode ser usado sem armazenamento local. */
}
watch(
    [cart, type],
    () => {
        try {
            window.localStorage.setItem(CART_KEY, JSON.stringify({ items: cart.value, type: type.value }));
        } catch {
            /* Os itens continuam disponíveis durante esta visita. */
        }
    },
    { deep: true }
);

const productsById = computed(() => new Map(catalog.value.map((product) => [product.id, product])));
const menu = computed(() => catalog.value.filter((product) => category.value === 'Todas' || product.category === category.value));
const rows = computed(() =>
    cart.value.flatMap((item) => {
        const product = productsById.value.get(item.productId);
        if (!product) return [];
        return [{ key: cartKey(item), ...item, sizeLabel: orderItemSize({ size: item.size, category: product.category }), name: product.name, photo: productPhoto(product), total: money(productPrice(product, item.size) * item.quantity) }];
    })
);
const itemCount = computed(() => rows.value.reduce((count, item) => count + item.quantity, 0));
const subtotal = computed(() => money(rows.value.reduce((sum, item) => sum + item.total, 0)));
const fee = computed(() => (type.value === 'Entrega' ? (settings.value?.deliveryFee ?? 0) : 0));
const total = computed(() => money(subtotal.value + fee.value));
const cartProps = computed(() => ({ rows: rows.value, type: type.value, subtotal: subtotal.value, fee: fee.value, total: total.value, open: settings.value?.isOpen }));

async function refreshMenu(manual = false) {
    if (menuUpdating) return;
    menuUpdating = true;
    try {
        const data = await api('/menu');
        const byId = new Map(data.products.map((product) => [product.id, product]));
        const available = cart.value.filter((item) => {
            const product = byId.get(item.productId);
            return product && (product.kind === 'pizza' ? SIZES.some((size) => size.value === item.size) : item.size === 'Unidade');
        });
        if (available.length !== cart.value.length) {
            cart.value = available;
            notify({ severity: 'warn', summary: 'Carrinho atualizado', detail: 'Alguns itens saíram do cardápio e foram removidos do seu carrinho.' });
        }
        catalog.value = data.products.sort((a, b) => Number(b.featured) - Number(a.featured));
        settings.value = data.settings;
        document.title = `${data.settings.name} · Cardápio`;
        menuError.value = '';
    } catch (error) {
        if (!settings.value) {
            if (!menuError.value || manual === true) notify({ severity: 'error', summary: 'Cardápio indisponível', detail: error.message });
            menuError.value = error.message;
        }
    } finally {
        loading.value = false;
        menuUpdating = false;
    }
}

async function restoreSession() {
    const current = customer.value;
    try {
        const data = await api('/customer/session');
        if (customer.value === current) customer.value = data.customer;
    } catch {
        /* Uma conta ainda pode ser aberta pelo botão Minha conta. */
    }
}

onMounted(() => {
    document.title = 'Bella Massa · Cardápio';
    refreshMenu();
    restoreSession();
    refreshTimer = window.setInterval(() => {
        if (document.visibilityState === 'visible') refreshMenu();
    }, 20000);
    window.addEventListener('focus', refreshMenu);
});
onUnmounted(() => {
    window.clearTimeout(feedbackTimer);
    window.clearInterval(refreshTimer);
    window.removeEventListener('focus', refreshMenu);
});

function chosenSize(product) {
    return product.kind === 'pizza' ? (selectedSizes.value[product.id] ?? 'Grande') : 'Unidade';
}

function add(product) {
    const size = chosenSize(product);
    const existing = cart.value.find((item) => item.productId === product.id && item.size === size);
    if ((existing && existing.quantity >= 50) || (!existing && cart.value.length >= 30)) {
        notify({ severity: 'warn', summary: 'Limite do carrinho atingido', detail: existing ? 'Você pode pedir até 50 unidades deste item.' : 'Você pode escolher até 30 itens diferentes por pedido.' });
        return;
    }
    if (existing) existing.quantity++;
    else cart.value.push({ productId: product.id, size, quantity: 1 });
    addFeedback.value = product.id;
    announcement.value = `${product.name} adicionada ao carrinho. ${itemCount.value} ${itemCount.value === 1 ? 'item' : 'itens'}.`;
    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => (addFeedback.value = null), 850);
}

function changeQuantity(key, amount) {
    const index = cart.value.findIndex((item) => cartKey(item) === key);
    if (index < 0) return;
    const quantity = cart.value[index].quantity + amount;
    if (quantity === 0) cart.value.splice(index, 1);
    else if (quantity <= 50) cart.value[index].quantity = quantity;
}

function openCart() {
    if (window.matchMedia('(max-width: 900px)').matches) {
        drawerOpen.value = true;
        return;
    }
    cartAnchor.value?.focus({ preventScroll: true });
    cartAnchor.value?.scrollIntoView({ block: 'nearest', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

async function openAccount() {
    accountForCheckout.value = false;
    await restoreSession();
    accountOpen.value = true;
}

async function openCheckout() {
    drawerOpen.value = false;
    if (customer.value) await restoreSession();
    if (!customer.value) {
        accountForCheckout.value = true;
        accountOpen.value = true;
        return;
    }
    const city = [customer.value.municipality, customer.value.uf].filter(Boolean).join(' / ');
    const address = [customer.value.address, customer.value.neighborhood, city].filter(Boolean).join(' · ');
    checkout.value = { address: address.length <= 250 ? address : customer.value.address, payment: 'Pix', notes: '' };
    checkoutOpen.value = true;
}

function receiveCustomer(data) {
    customer.value = data;
    if (accountOpen.value) resumeCheckout();
}

function receiveSavedCustomer(data) {
    customer.value = data;
    accountForCheckout.value = accountForCheckout.value && accountOpen.value;
}

function resumeCheckout() {
    if (!customer.value || !accountForCheckout.value) return;
    accountForCheckout.value = false;
    accountOpen.value = false;
    openCheckout();
}

async function sendOrder(event) {
    if (submitting.value || !customer.value || !rows.value.length || !settings.value?.isOpen) return;
    const focusTarget = lastFormField(event.currentTarget);
    submitting.value = true;
    const data = {
        ...checkout.value,
        type: type.value,
        items: cart.value.map(({ productId, size, quantity }) => ({ productId, size, quantity })),
        expectedTotal: total.value
    };
    const signature = JSON.stringify([customer.value.id, data]);
    if (attempt?.signature !== signature) {
        const requestId = Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
        attempt = { signature, requestId };
    }
    try {
        const receipt = await api('/customer/orders', { method: 'POST', body: { ...data, requestId: attempt.requestId } });
        attempt = null;
        cart.value = [];
        checkoutOpen.value = false;
        notify({ severity: 'success', summary: 'Pedido recebido', detail: `Seu pedido #${receipt.id} chegou à pizzaria. Total de ${formatCurrency(receipt.total)}.` });
    } catch (error) {
        if (error.status === 401) {
            customer.value = null;
            checkoutOpen.value = false;
            notify({ severity: 'warn', summary: 'Entre novamente para continuar', detail: error.message, onConfirm: openCheckout });
        } else {
            notify({ severity: 'error', summary: 'Não foi possível enviar o pedido', detail: error.message, focusTarget });
            if ([409, 422].includes(error.status)) await refreshMenu();
        }
    } finally {
        submitting.value = false;
    }
}
</script>

<template>
    <div class="storefront">
        <a class="skip-link" href="#cardapio">Ir para o cardápio</a>
        <header class="store-header store-container">
            <RouterLink :to="{ name: 'storefront' }" class="store-brand">
                <img src="/pizza-mark.svg" alt="" width="48" height="48" />
                <span
                    ><strong>{{ settings?.name || 'Bella Massa' }}</strong
                    ><small>{{ settings?.subtitle || 'Pizzaria artesanal' }}</small></span
                >
            </RouterLink>
            <nav class="store-header-actions" aria-label="Conta e carrinho">
                <button class="store-account-button" type="button" aria-label="Minha conta" @click="openAccount"><i class="pi pi-user" aria-hidden="true"></i><span>Minha conta</span></button>
                <button class="store-bag" type="button" :aria-label="'Abrir carrinho, ' + itemCount + ' itens'" @click="openCart">
                    <i class="pi pi-shopping-bag" aria-hidden="true"></i><span>Carrinho</span><strong :key="itemCount" :class="{ 'store-bag-pulse': addFeedback }">{{ itemCount }}</strong>
                </button>
            </nav>
        </header>

        <main class="store-container">
            <section class="store-hero" aria-labelledby="store-hero-title">
                <img src="/loja/banner.webp" alt="" width="1800" height="600" fetchpriority="high" />
                <div class="store-hero-copy">
                    <h1 id="store-hero-title">Do forno à<br />sua mesa.</h1>
                    <a href="#cardapio">Escolher pizza <i class="pi pi-arrow-right" aria-hidden="true"></i></a>
                </div>
            </section>

            <div class="store-layout">
                <section id="cardapio" class="store-menu" aria-labelledby="store-menu-title">
                    <div class="store-menu-heading">
                        <h2 id="store-menu-title">Cardápio</h2>
                        <small v-if="settings && !settings.isOpen">Fechada para pedidos</small>
                    </div>
                    <div class="store-categories" role="group" aria-label="Categorias do cardápio">
                        <button v-for="item in categories" :key="item" type="button" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
                    </div>
                    <p v-if="loading" class="store-notice" role="status">Carregando cardápio…</p>
                    <div v-else-if="menuError" class="store-notice">
                        <p role="alert">{{ menuError }}</p>
                        <Button label="Tentar novamente" outlined @click="refreshMenu(true)" />
                    </div>
                    <p v-else-if="!menu.length" class="store-notice">Nenhum produto disponível nesta categoria.</p>
                    <div v-else class="store-products">
                        <article v-for="product in menu" :key="product.id" class="store-product">
                            <div class="store-product-photo">
                                <img v-if="productPhoto(product)" :src="productPhoto(product)" :alt="product.name" width="640" height="400" loading="lazy" />
                                <PizzaArt v-else :variant="product.art" />
                            </div>
                            <div class="store-product-copy">
                                <h3>{{ product.name }}</h3>
                                <p v-if="product.description">{{ product.description }}</p>
                            </div>
                            <div v-if="product.kind === 'pizza'" class="store-sizes" role="group" :aria-label="'Tamanho de ' + product.name">
                                <button v-for="size in SIZES" :key="size.value" type="button" :title="size.label" :aria-label="size.label" :aria-pressed="chosenSize(product) === size.value" @click="selectedSizes[product.id] = size.value">
                                    {{ size.value }}
                                </button>
                            </div>
                            <div class="store-product-action">
                                <div class="store-product-price">
                                    <strong>{{ formatCurrency(productPrice(product, chosenSize(product))) }}</strong>
                                    <small v-if="product.kind !== 'pizza'">{{ product.kind === 'extra' ? 'por porção' : 'por unidade' }}</small>
                                </div>
                                <button type="button" :class="{ 'store-added': addFeedback === product.id }" :aria-label="'Adicionar ' + product.name" :disabled="!settings?.isOpen" @click="add(product)">
                                    <i :class="['pi', addFeedback === product.id ? 'pi-check' : 'pi-plus']" aria-hidden="true"></i>{{ addFeedback === product.id ? 'Adicionado' : 'Adicionar' }}
                                </button>
                            </div>
                        </article>
                    </div>
                </section>

                <aside ref="cartAnchor" class="store-desktop-cart" tabindex="-1">
                    <StoreCart v-bind="cartProps" @change-type="type = $event" @quantity="changeQuantity" @checkout="openCheckout" />
                </aside>
            </div>
        </main>

        <footer class="store-footer store-container">
            <span>{{ settings?.name || 'Bella Massa' }} · {{ settings?.subtitle || 'Pizzaria artesanal' }}</span>
            <RouterLink :to="{ name: 'dashboard' }">Área da pizzaria</RouterLink>
        </footer>

        <button v-if="itemCount" type="button" class="store-mobile-bag" @click="openCart">
            <i class="pi pi-shopping-bag" aria-hidden="true"></i><span>Ver carrinho · {{ itemCount }}</span
            ><strong>{{ formatCurrency(total) }}</strong>
        </button>
        <Drawer v-model:visible="drawerOpen" position="right" header="Seu carrinho" class="storefront-drawer" :style="{ width: 'min(100vw, 420px)' }">
            <StoreCart v-bind="cartProps" drawer @change-type="type = $event" @quantity="changeQuantity" @checkout="openCheckout" />
        </Drawer>
        <StoreAccount v-model:visible="accountOpen" :customer="customer" @customer="receiveCustomer" @saved="receiveSavedCustomer" @confirmed="resumeCheckout" />
        <Dialog v-model:visible="checkoutOpen" modal header="Revisar pedido" :closable="!submitting" class="storefront-dialog" :style="{ width: '480px' }" :breakpoints="{ '560px': '94vw' }">
            <form class="store-form" v-feedback-form @submit.prevent="sendOrder">
                <p class="store-form-hint">
                    <strong>{{ customer?.name }}</strong> · {{ type }}
                </p>
                <div v-if="type === 'Entrega'" class="field">
                    <label for="store-order-address">Endereço de entrega</label
                    ><InputText id="store-order-address" v-model="checkout.address" autocomplete="street-address" placeholder="Ex.: Rua das Flores, 125, ap. 302, Centro" maxlength="250" minlength="8" required fluid />
                </div>
                <p v-else class="store-form-hint">Retirada em {{ settings?.address }}</p>
                <div class="field">
                    <label for="store-order-payment">Forma de pagamento</label><Select inputId="store-order-payment" v-model="checkout.payment" :options="PAYMENT_METHODS" placeholder="Selecione o pagamento" fluid /><small
                        >Combine o pagamento na entrega ou retirada.</small
                    >
                </div>
                <div class="field"><label for="store-order-notes">Observações</label><Textarea id="store-order-notes" v-model="checkout.notes" placeholder="Ex.: sem cebola ou interfone 12" rows="2" maxlength="400" fluid /></div>
                <div class="store-checkout-total">
                    <span>Total do pedido</span><strong>{{ formatCurrency(total) }}</strong>
                </div>
                <Button type="submit" label="Enviar pedido à pizzaria" :disabled="!rows.length || !settings?.isOpen" :loading="submitting" />
            </form>
        </Dialog>
        <div class="store-sr-only" role="status" aria-live="polite">{{ announcement }}</div>
    </div>
</template>
