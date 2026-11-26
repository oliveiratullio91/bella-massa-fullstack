<script setup>
import { computed, ref } from 'vue';
import { usePizzaria } from '@/stores/pizzaria';
import { DRIVERS, completionDate, dayKey, isActiveOrder, statusSeverity } from '@/utils/pizzaria';
import { formatCurrency, formatPhone } from '@/utils/locale';
import { notify } from '@/service/feedback';
import PageHeader from '@/components/pizzaria/PageHeader.vue';
import OrderDetails from '@/components/pizzaria/OrderDetails.vue';
const { state, assignDriver, changeStatus } = usePizzaria();

const selectedId = ref(null);
const advancing = ref(null);
const detailsOpen = ref(false);
const deliveries = computed(() => state.orders.filter((order) => order.type === 'Entrega' && isActiveOrder(order)));
const ready = computed(() => deliveries.value.filter((order) => order.status === 'Pronto').length);
const inTransit = computed(() => deliveries.value.filter((order) => order.status === 'Em entrega').length);
const completedToday = computed(() => state.orders.filter((order) => order.type === 'Entrega' && order.status === 'Finalizado' && dayKey(completionDate(order)) === dayKey()).length);
function openDetails(id) {
    selectedId.value = id;
    detailsOpen.value = true;
}
async function setDriver(id, value) {
    try {
        await assignDriver(id, value);
    } catch (error) {
        notify({ severity: 'error', summary: 'Confira a entrega', detail: error.message });
    }
}
async function advance(order) {
    if (advancing.value) return;
    advancing.value = order.id;
    try {
        const updated = await changeStatus(order.id);
        notify({ severity: 'success', summary: updated.status === 'Finalizado' ? 'Entrega concluída!' : 'Pedido a caminho!', detail: `Pedido #${order.id} atualizado.` });
    } catch (error) {
        notify({ severity: 'warn', summary: 'Falta um detalhe', detail: error.message });
    } finally {
        advancing.value = null;
    }
}
</script>
<template>
    <div class="deliveries-page">
        <PageHeader title="Entregas" eyebrow="" description="Acompanhe os pedidos e atribua entregadores." />
        <div class="delivery-summary">
            <div>
                <span class="metric-icon orange"><i class="pi pi-shopping-bag" aria-hidden="true"></i></span
                ><span
                    ><strong>{{ ready }}</strong
                    >Prontas para sair</span
                >
            </div>
            <div>
                <span class="metric-icon blue"><i class="pi pi-truck" aria-hidden="true"></i></span
                ><span
                    ><strong>{{ inTransit }}</strong
                    >A caminho</span
                >
            </div>
            <div>
                <span class="metric-icon green"><i class="pi pi-check-circle" aria-hidden="true"></i></span
                ><span
                    ><strong>{{ completedToday }}</strong
                    >Entregues hoje</span
                >
            </div>
        </div>
        <div class="section-title delivery-list-title">
            <h2 id="active-deliveries">Entregas em andamento</h2>
            <span class="muted">{{ deliveries.length }} {{ deliveries.length === 1 ? 'pedido' : 'pedidos' }}</span>
        </div>
        <div v-if="!deliveries.length" class="surface-panel empty-state">
            <i class="pi pi-check-circle" aria-hidden="true"></i>
            <h3>Tudo entregue por aqui!</h3>
            <p>Os próximos pedidos de entrega aparecerão nesta tela.</p>
            <RouterLink :to="{ name: 'orders' }" class="text-link">Ir para pedidos</RouterLink>
        </div>
        <div v-else class="surface-panel delivery-list-panel">
            <div class="admin-list-heading delivery-list-header" aria-hidden="true">
                <span>Pedido</span>
                <span>Cliente</span>
                <span>Endereço e itens</span>
                <span>Status</span>
                <span>Entregador</span>
                <span>Ação</span>
            </div>
            <ul class="admin-list" role="list" aria-labelledby="active-deliveries">
                <li v-for="order in deliveries" :key="order.id" class="admin-list-row delivery-row">
                    <div class="delivery-order">
                        <button type="button" class="text-link order-number" :aria-label="`Ver pedido #${order.id}`" @click="openDetails(order.id)">#{{ order.id }}</button>
                        <span class="muted">{{ formatCurrency(order.total) }}</span>
                    </div>
                    <div class="delivery-customer">
                        <strong>{{ order.customerName }}</strong>
                        <span v-if="order.phone" class="muted">{{ formatPhone(order.phone) }}</span>
                    </div>
                    <div class="delivery-destination">
                        <p class="delivery-address">
                            <i class="pi pi-map-marker" aria-hidden="true"></i><span>{{ order.address }}</span>
                        </p>
                        <p class="delivery-items">{{ order.items.map((item) => item.quantity + '× ' + item.name).join(' · ') }}</p>
                    </div>
                    <div class="delivery-status"><Tag :value="order.status" :severity="statusSeverity(order.status)" /></div>
                    <Select
                        class="delivery-driver"
                        :aria-label="`Entregador do pedido #${order.id}`"
                        :modelValue="order.driver || null"
                        :options="DRIVERS"
                        placeholder="Entregador"
                        size="small"
                        fluid
                        @update:modelValue="setDriver(order.id, $event)"
                    />
                    <div class="delivery-action">
                        <Button v-if="order.status === 'Pronto'" label="Iniciar entrega" icon="pi pi-truck" size="small" :loading="advancing === order.id" @click="advance(order)" />
                        <Button v-else-if="order.status === 'Em entrega'" label="Confirmar entrega" icon="pi pi-check" size="small" :loading="advancing === order.id" @click="advance(order)" />
                        <span v-else class="muted">Aguardando a cozinha</span>
                    </div>
                </li>
            </ul>
        </div>
        <section class="surface-panel drivers-panel">
            <div class="panel-heading">
                <div>
                    <h2>Equipe de entregas</h2>
                    <p>Entregadores de exemplo disponíveis para atribuição.</p>
                </div>
                <i class="pi pi-users muted" aria-hidden="true"></i>
            </div>
            <div class="driver-list">
                <div v-for="driver in DRIVERS" :key="driver">
                    <span class="customer-avatar">{{
                        driver
                            .split(' ')
                            .map((part) => part[0])
                            .join('')
                    }}</span
                    ><span
                        ><strong>{{ driver }}</strong
                        ><small>{{ deliveries.filter((order) => order.driver === driver && order.status === 'Em entrega').length }} entrega(s) em rota</small></span
                    >
                </div>
            </div>
        </section>
        <OrderDetails v-model:visible="detailsOpen" :orderId="selectedId" />
    </div>
</template>
