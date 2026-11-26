<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency } from '@/utils/locale';
import { completionDate, dayKey, formatTime, money, statusSeverity, summarizeOrders } from '@/utils/pizzaria';
import PizzaArt from '@/components/pizzaria/PizzaArt.vue';
import OrderDetails from '@/components/pizzaria/OrderDetails.vue';
const { state } = usePizzaria();
const router = useRouter();
const selectedId = ref(null);
const detailsOpen = ref(false);
const summary = computed(() => summarizeOrders(state.orders));
const recent = computed(() => state.orders.filter((order) => dayKey(order.createdAt) === dayKey()).slice(0, 5));
const stages = computed(() => [
    { label: 'Recebidos', icon: 'pi-receipt', color: 'blue', count: state.orders.filter((o) => o.status === 'Recebido').length },
    { label: 'Em produção', icon: 'pi-sparkles', color: 'orange', count: state.orders.filter((o) => ['Em preparo', 'No forno'].includes(o.status)).length },
    { label: 'Prontos', icon: 'pi-check-circle', color: 'green', count: state.orders.filter((o) => o.status === 'Pronto').length },
    { label: 'Em entrega', icon: 'pi-truck', color: 'purple', count: state.orders.filter((o) => o.status === 'Em entrega').length }
]);
const popular = computed(() => {
    const counts = {};
    for (const order of state.orders.filter((item) => item.status !== 'Cancelado')) {
        for (const item of order.items.filter((line) => !['Bebidas', 'Acompanhamentos'].includes(line.category))) {
            if (!counts[item.productId]) counts[item.productId] = { name: item.name, art: item.art, quantity: 0 };
            counts[item.productId].quantity += item.quantity;
        }
    }
    return Object.values(counts)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);
});
const week = computed(() =>
    Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const value = money(state.orders.filter((order) => order.status === 'Finalizado' && dayKey(completionDate(order)) === dayKey(date)).reduce((sum, order) => sum + order.total, 0));
        return { label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short', timeZone: 'America/Fortaleza' }).format(date).replace('.', ''), value, date: dayKey(date), today: index === 6 };
    })
);
const maxRevenue = computed(() => Math.max(...week.value.map((day) => day.value), 1));
const weekTotal = computed(() => money(week.value.reduce((sum, day) => sum + day.value, 0)));
const dateLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Fortaleza' }).format(new Date());
function showOrder(id) {
    selectedId.value = id;
    detailsOpen.value = true;
}
</script>

<template>
    <div class="admin-overview">
        <header class="overview-header">
            <div>
                <h1>Visão geral</h1>
                <p><i class="pi pi-calendar" aria-hidden="true"></i>{{ dateLabel }}</p>
            </div>
            <Button label="Novo pedido" icon="pi pi-plus" @click="router.push({ name: 'orders', query: { novo: '1' } })" />
        </header>
        <div class="stats-grid">
            <article class="metric-card">
                <div class="metric-top">
                    <span>Pedidos de hoje</span><span class="metric-icon orange"><i class="pi pi-receipt" aria-hidden="true"></i></span>
                </div>
                <strong>{{ summary.count }}</strong>
            </article>
            <article class="metric-card">
                <div class="metric-top">
                    <span>Em andamento</span><span class="metric-icon blue"><i class="pi pi-clock" aria-hidden="true"></i></span>
                </div>
                <strong>{{ summary.active }}</strong>
            </article>
            <article class="metric-card">
                <div class="metric-top">
                    <span>Faturamento de hoje</span><span class="metric-icon green"><i class="pi pi-wallet" aria-hidden="true"></i></span>
                </div>
                <strong>{{ formatCurrency(summary.revenue) }}</strong>
            </article>
            <article class="metric-card">
                <div class="metric-top">
                    <span>Ticket médio</span><span class="metric-icon purple"><i class="pi pi-chart-bar" aria-hidden="true"></i></span>
                </div>
                <strong>{{ formatCurrency(summary.average) }}</strong>
            </article>
        </div>
        <div class="dashboard-grid overview-workspace">
            <section class="surface-panel dashboard-orders">
                <div class="panel-heading">
                    <div>
                        <h2>Pedidos recentes</h2>
                    </div>
                    <RouterLink :to="{ name: 'orders' }" class="text-link">Ver todos <i class="pi pi-arrow-right" aria-hidden="true"></i></RouterLink>
                </div>
                <ul v-if="recent.length" class="overview-recent">
                    <li v-for="order in recent" :key="order.id">
                        <button type="button" class="overview-recent-order" :aria-label="'Ver pedido #' + order.id + ' de ' + order.customerName" @click="showOrder(order.id)">
                            <span class="overview-recent-code"
                                ><strong>#{{ order.id }}</strong
                                ><small>{{ formatTime(order.createdAt) }}</small></span
                            >
                            <span class="overview-recent-customer"
                                ><strong>{{ order.customerName }}</strong
                                ><small>{{ order.type }}</small></span
                            >
                            <Tag :value="order.status" :severity="statusSeverity(order.status)" />
                            <strong class="overview-recent-value">{{ formatCurrency(order.total) }}</strong>
                        </button>
                    </li>
                </ul>
                <p v-else class="overview-empty">Nenhum pedido registrado hoje.</p>
            </section>
            <section class="surface-panel production-panel">
                <div class="panel-heading">
                    <div>
                        <h2>Operação</h2>
                    </div>
                    <span class="live-label"><span class="status-dot"></span>Agora</span>
                </div>
                <div class="overview-stage-list">
                    <RouterLink v-for="stage in stages" :key="stage.label" :to="{ name: 'orders' }" class="stage-row">
                        <span class="stage-icon" :class="stage.color"><i :class="'pi ' + stage.icon" aria-hidden="true"></i></span>
                        <span>{{ stage.label }}</span
                        ><strong>{{ stage.count }}</strong>
                        <i class="pi pi-angle-right" aria-hidden="true"></i>
                    </RouterLink>
                </div>
                <div class="production-note">
                    <i class="pi pi-clock" aria-hidden="true"></i
                    ><span
                        >Prazo estimado de entrega<strong>{{ state.settings.estimatedTime }} minutos</strong></span
                    >
                </div>
            </section>
        </div>
        <details class="surface-panel overview-insights">
            <summary>
                <i class="pi pi-chart-bar" aria-hidden="true"></i><span>Resumo de vendas</span>
                <small>{{ formatCurrency(weekTotal) }} <span class="overview-insights-period">nos últimos 7 dias</span></small>
                <i class="pi pi-chevron-down" aria-hidden="true"></i>
            </summary>
            <div class="dashboard-grid overview-insight-grid">
                <section class="surface-panel revenue-panel">
                    <div class="panel-heading">
                        <div>
                            <h2>Faturamento semanal</h2>
                            <p>Faturamento dos pedidos finalizados nos últimos 7 dias.</p>
                        </div>
                        <strong class="week-total">{{ formatCurrency(weekTotal) }}</strong>
                    </div>
                    <figure class="revenue-chart" aria-label="Faturamento diário dos últimos sete dias">
                        <div v-for="day in week" :key="day.date" class="chart-column">
                            <div class="bar-track">
                                <div
                                    class="revenue-bar"
                                    :class="{ today: day.today }"
                                    :style="{ height: Math.max((day.value / maxRevenue) * 100, day.value ? 3 : 0) + '%' }"
                                    :title="day.label + ': ' + formatCurrency(day.value)"
                                    tabindex="0"
                                    :aria-label="day.date + ': ' + formatCurrency(day.value)"
                                >
                                    <span class="chart-value">{{ formatCurrency(day.value) }}</span>
                                </div>
                            </div>
                            <span :class="{ 'today-label': day.today }">{{ day.today ? 'Hoje' : day.label }}</span>
                        </div>
                    </figure>
                    <div class="chart-legend"><span></span>Receita de pedidos finalizados, incluindo entrega</div>
                </section>
                <section class="surface-panel favorites-panel">
                    <div class="panel-heading">
                        <div>
                            <h2>Pizzas mais pedidas</h2>
                            <p>Pizzas mais pedidas no histórico.</p>
                        </div>
                        <i class="pi pi-heart muted" aria-hidden="true"></i>
                    </div>
                    <div v-for="(product, index) in popular" :key="product.name" class="favorite-row">
                        <span class="favorite-rank">0{{ index + 1 }}</span>
                        <div class="favorite-art"><PizzaArt :variant="product.art" /></div>
                        <div>
                            <strong>{{ product.name }}</strong
                            ><small>{{ product.quantity }} unidades pedidas</small>
                        </div>
                    </div>
                    <RouterLink :to="{ name: 'menu' }" class="favorites-link">Explorar cardápio <i class="pi pi-arrow-right" aria-hidden="true"></i></RouterLink>
                </section>
            </div>
        </details>
        <OrderDetails v-model:visible="detailsOpen" :orderId="selectedId" />
    </div>
</template>
