<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const moreMenu = ref(null);
const items = [
    { label: 'Visão geral', icon: 'pi-home', name: 'dashboard' },
    { label: 'Pedidos', icon: 'pi-receipt', name: 'orders' },
    { label: 'Entregas', icon: 'pi-truck', name: 'deliveries' },
    { label: 'Cardápio', icon: 'pi-book', name: 'menu' },
    { label: 'Clientes', icon: 'pi-users', name: 'customers' },
    { label: 'Usuários', icon: 'pi-id-card', name: 'users' },
    { label: 'Configurações', icon: 'pi-cog', name: 'settings' }
];
const moreItems = items.slice(4);
</script>

<template>
    <nav aria-label="Menu principal" class="admin-navigation">
        <ul>
            <li v-for="(item, index) in items" :key="item.name" :class="{ 'admin-nav-secondary': index >= 4 }">
                <RouterLink :to="{ name: item.name }" exact-active-class="admin-navigation-active">
                    <i :class="['pi', item.icon]" aria-hidden="true"></i>
                    <span>{{ item.label }}</span>
                </RouterLink>
            </li>
            <li class="admin-nav-more">
                <button type="button" :class="{ 'admin-navigation-active': moreItems.some((item) => item.name === route.name) }" aria-label="Mais opções do menu" @click="moreMenu.toggle($event)">
                    <i class="pi pi-ellipsis-h" aria-hidden="true"></i><span>Mais</span>
                </button>
                <Popover ref="moreMenu">
                    <div class="admin-more-links">
                        <RouterLink v-for="item in moreItems" :key="item.name" :to="{ name: item.name }" @click="moreMenu.hide()"> <i :class="['pi', item.icon]" aria-hidden="true"></i>{{ item.label }} </RouterLink>
                    </div>
                </Popover>
            </li>
        </ul>
    </nav>
</template>
