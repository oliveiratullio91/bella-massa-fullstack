<script setup>
import { usePizzaria } from '@/stores/pizzaria';
import { dayKey } from '@/utils/pizzaria';
import { useRoute, useRouter } from 'vue-router';

const { state } = usePizzaria();
const route = useRoute();
const router = useRouter();
const today = new Date();
const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Fortaleza'
})
    .format(today)
    .replace('.,', ',');

function newOrder() {
    router.replace({ name: 'orders', query: { ...route.query, novo: '1' }, hash: route.hash });
}
</script>

<template>
    <a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <header class="admin-topbar">
        <RouterLink :to="{ name: 'dashboard' }" class="admin-brand" aria-label="Visão geral da pizzaria">
            <img src="/pizza-mark.svg" alt="" width="60" height="60" />
            <span>
                <strong>{{ state.settings.name }}</strong>
                <small>{{ state.settings.subtitle }}</small>
            </span>
        </RouterLink>
        <template v-if="route.name === 'orders'">
            <h1 class="admin-topbar-title">Pedidos</h1>
            <time class="admin-date" :datetime="dayKey(today)">
                <i class="pi pi-calendar" aria-hidden="true"></i>
                <span>{{ dateLabel }} (Fortaleza)</span>
                <strong>Hoje</strong>
            </time>
            <Button class="admin-new-order" label="Novo pedido" icon="pi pi-plus" @click="newOrder" />
        </template>
        <span v-else class="admin-store-status store-status" :class="{ closed: !state.settings.isOpen }"> <span class="status-dot"></span>{{ state.settings.isOpen ? 'Aberta para pedidos' : 'Pizzaria fechada' }} </span>
    </header>
</template>
