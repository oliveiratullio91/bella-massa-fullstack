<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import OrderDetails from '@/components/pizzaria/OrderDetails.vue';
import OrderEditor from '@/components/pizzaria/OrderEditor.vue';
import { useOrderDeletion } from '@/components/pizzaria/useDeleteConfirmation';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency } from '@/utils/locale';
import { ORDER_STATUSES, ORDER_TYPES, canDeleteOrder, canEditOrder, dayKey, formatTime, statusSeverity } from '@/utils/pizzaria';

const { state } = usePizzaria();
const confirmDelete = useOrderDeletion();
const route = useRoute();
const router = useRouter();
const search = ref('');
const status = ref(null);
const type = ref(null);
const period = ref('Hoje');
const sort = ref('recent');
const first = ref(0);
const automaticRows = ref(8);
const preferredRows = ref(null);
const rows = computed(() => preferredRows.value ?? automaticRows.value);
const filters = ref(null);
const editorOpen = ref(false);
const editingId = ref(null);
const detailsOpen = ref(false);
const selectedId = ref(null);

const periods = ['Hoje', 'Últimos 7 dias', 'Todo o histórico'];
const pageSizes = [{ label: 'Automático', value: null }, ...[2, 4, 6, 8, 10, 12, 24].map((value) => ({ label: String(value), value }))];
const quickFilters = [
    { label: 'Todos', value: null },
    { label: 'Recebidos', value: 'Recebido' },
    { label: 'Em preparo', value: 'production' },
    { label: 'Prontos', value: 'Pronto' },
    { label: 'Em entrega', value: 'Em entrega' }
];
const statusOptions = [...ORDER_STATUSES.map((value) => ({ label: value, value })), { label: 'Em preparo ou no forno', value: 'production' }];
const sortOptions = [
    { label: 'Mais recentes', value: 'recent', compare: (a, b) => b.id - a.id },
    { label: 'Mais antigos', value: 'oldest', compare: (a, b) => a.id - b.id },
    { label: 'Cliente de A a Z', value: 'customer', compare: (a, b) => a.customerName.localeCompare(b.customerName, 'pt-BR') },
    { label: 'Menor total', value: 'lowest', compare: (a, b) => a.total - b.total },
    { label: 'Maior total', value: 'highest', compare: (a, b) => b.total - a.total }
];
const serviceIcons = { Entrega: 'pi-truck', Retirada: 'pi-shopping-bag', Balcão: 'pi-shop' };
const orderDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Fortaleza' });
const advancedFiltersApplied = computed(() => type.value !== null || period.value !== 'Hoje' || sort.value !== 'recent' || !quickFilters.some((item) => item.value === status.value));

const periodOrders = computed(() => {
    if (period.value === 'Todo o histórico') return state.orders;
    const today = dayKey();
    const start = period.value === 'Hoje' ? today : dayKey(Date.now() - 6 * 86400000);
    return state.orders.filter((order) => {
        const day = dayKey(order.createdAt);
        return day >= start && day <= today;
    });
});

function searchable(value) {
    return value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{M}/gu, '');
}

const filteredOrders = computed(() => {
    const term = searchable(search.value.trim());
    return periodOrders.value
        .filter((order) => {
            const matchesStatus = status.value === 'production' ? ['Em preparo', 'No forno'].includes(order.status) : !status.value || order.status === status.value;
            const matchesType = !type.value || order.type === type.value;
            const matchesSearch = !term || searchable(`#${order.id} ${order.customerName} ${order.items.map((item) => item.name).join(' ')}`).includes(term);
            return matchesStatus && matchesType && matchesSearch;
        })
        .sort(sortOptions.find((option) => option.value === sort.value).compare);
});
const visibleOrders = computed(() => filteredOrders.value.slice(first.value, first.value + rows.value));

function syncPageSize() {
    if (window.innerWidth <= 760) {
        automaticRows.value = 4;
        return;
    }
    const height = window.innerHeight;
    automaticRows.value = height >= 730 ? 10 : height >= 640 ? 8 : 6;
}
onMounted(() => {
    syncPageSize();
    window.addEventListener('resize', syncPageSize);
});
onUnmounted(() => window.removeEventListener('resize', syncPageSize));

watch([search, status, type, period, sort, rows], () => {
    first.value = 0;
});
watch(
    () => filteredOrders.value.length,
    (count) => {
        if (first.value >= count) first.value = Math.max(0, Math.ceil(count / rows.value) - 1) * rows.value;
    }
);
watch(
    () => route.query.novo,
    (value) => {
        if (value === '1') {
            openEditor();
            const query = { ...route.query };
            delete query.novo;
            router.replace({ name: 'orders', query, hash: route.hash });
        }
    },
    { immediate: true }
);

function openEditor(id = null) {
    editingId.value = id;
    editorOpen.value = true;
}
function showDetails(id) {
    selectedId.value = id;
    detailsOpen.value = true;
}
function onSaved(id, edited) {
    if (!edited) clearFilters();
    showDetails(id);
}
function clearFilters() {
    search.value = '';
    status.value = null;
    type.value = null;
    period.value = 'Hoje';
    sort.value = 'recent';
}
</script>

<template>
    <section class="orders-board" aria-label="Lista de pedidos">
        <div class="orders-toolbar">
            <div class="orders-search">
                <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="search" placeholder="Buscar pedido, cliente ou item" aria-label="Buscar pedido, cliente ou item" fluid />
                </IconField>
                <Button
                    class="orders-filter-button"
                    icon="pi pi-sliders-h"
                    :label="advancedFiltersApplied ? 'Filtros ativos' : 'Filtros'"
                    :aria-label="advancedFiltersApplied ? 'Filtros avançados ativos' : 'Filtros avançados'"
                    severity="secondary"
                    outlined
                    @click="filters.toggle($event)"
                />
                <Popover ref="filters">
                    <div class="orders-filter-popover">
                        <div class="field">
                            <label for="orders-status">Situação</label>
                            <Select inputId="orders-status" v-model="status" :options="statusOptions" optionLabel="label" optionValue="value" placeholder="Todas as situações" showClear fluid />
                        </div>
                        <div class="field">
                            <label for="orders-type">Atendimento</label>
                            <Select inputId="orders-type" v-model="type" :options="ORDER_TYPES" placeholder="Todo atendimento" showClear fluid />
                        </div>
                        <div class="field">
                            <label for="orders-period">Período</label>
                            <Select inputId="orders-period" v-model="period" :options="periods" placeholder="Selecione o período" fluid />
                        </div>
                        <div class="field">
                            <label for="orders-sort">Ordenar por</label>
                            <Select inputId="orders-sort" v-model="sort" :options="sortOptions" optionLabel="label" optionValue="value" placeholder="Selecione a ordem" fluid />
                        </div>
                        <div class="field">
                            <label for="orders-size">Pedidos por página</label>
                            <Select inputId="orders-size" v-model="preferredRows" :options="pageSizes" optionLabel="label" optionValue="value" placeholder="Automático" fluid />
                        </div>
                        <Button label="Limpar filtros" text @click="clearFilters" />
                    </div>
                </Popover>
            </div>
            <div class="orders-status-filter" role="group" aria-label="Filtrar pedidos por situação">
                <button v-for="filter in quickFilters" :key="filter.label" type="button" :aria-pressed="status === filter.value" @click="status = filter.value">{{ filter.label }}</button>
            </div>
        </div>

        <div v-if="filteredOrders.length" class="admin-list-results">
            <p role="status">{{ first + 1 }}–{{ Math.min(first + rows, filteredOrders.length) }} de {{ filteredOrders.length }} {{ filteredOrders.length === 1 ? 'pedido' : 'pedidos' }}</p>
            <Paginator v-if="filteredOrders.length > rows" v-model:first="first" :rows="rows" class="admin-list-pagination" aria-label="Páginas de pedidos" :totalRecords="filteredOrders.length" template="PrevPageLink NextPageLink" />
        </div>

        <div v-if="visibleOrders.length" class="surface-panel orders-list-panel">
            <div class="admin-list-heading orders-list-heading" aria-hidden="true">
                <span>Pedido</span>
                <span>Cliente</span>
                <span>Itens</span>
                <span>Situação</span>
                <span>Atendimento</span>
                <span>Total</span>
                <span>Ações</span>
            </div>
            <ul class="admin-list orders-list" role="list" aria-label="Pedidos encontrados">
                <li v-for="order in visibleOrders" :key="order.id" class="admin-list-row orders-list-row">
                    <div class="orders-list-number">
                        <strong>#{{ order.id }}</strong>
                        <time class="muted" :datetime="order.createdAt">{{ period === 'Hoje' ? formatTime(order.createdAt) : orderDate.format(new Date(order.createdAt)) }}</time>
                    </div>
                    <strong class="orders-list-customer">{{ order.customerName }}</strong>
                    <p class="orders-list-items muted">{{ order.items.map((item) => `${item.quantity}× ${item.name}`).join(' · ') }}</p>
                    <div class="orders-list-status"><Tag :value="order.status" :severity="statusSeverity(order.status)" /></div>
                    <div class="orders-list-service">
                        <span><i :class="['pi', serviceIcons[order.type]]" aria-hidden="true"></i>{{ order.type }}</span>
                        <small v-if="order.source === 'site'" class="orders-list-origin">Site</small>
                    </div>
                    <div class="orders-list-total">
                        <!-- O total já inclui a taxa de entrega. A legenda esclarece isso sem somar a taxa outra vez. [Tullio e Tassiana Oliveira] -->
                        <strong><span class="sr-only">Total </span>{{ formatCurrency(order.total) }}</strong>
                        <small v-if="order.deliveryFee > 0" class="muted">Entrega incluída</small>
                    </div>
                    <div class="admin-list-actions orders-list-actions">
                        <Button icon="pi pi-eye" :aria-label="`Ver pedido #${order.id}`" :title="`Ver pedido #${order.id}`" text severity="secondary" @click="showDetails(order.id)" />
                        <Button v-if="canEditOrder(order)" icon="pi pi-pencil" :aria-label="`Editar pedido #${order.id}`" :title="`Editar pedido #${order.id}`" text severity="secondary" @click="openEditor(order.id)" />
                        <Button v-if="canDeleteOrder(order)" icon="pi pi-trash" :aria-label="`Excluir pedido #${order.id}`" :title="`Excluir pedido #${order.id}`" text severity="danger" @click="confirmDelete(order.id)" />
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="surface-panel empty-state">
            <i class="pi pi-search" aria-hidden="true"></i>
            <h2>Nenhum pedido encontrado</h2>
            <p>Altere os filtros ou registre um pedido.</p>
            <Button label="Limpar filtros" text @click="clearFilters" />
        </div>
        <OrderEditor v-model:visible="editorOpen" :orderId="editingId" @saved="onSaved" />
        <OrderDetails v-model:visible="detailsOpen" :orderId="selectedId" />
    </section>
</template>
