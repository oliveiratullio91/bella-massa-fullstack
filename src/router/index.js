import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const adminPages = [
    { path: '', name: 'dashboard', meta: { title: 'Visão geral' }, component: () => import('@/views/Dashboard.vue') },
    { path: 'pedidos', name: 'orders', meta: { title: 'Pedidos' }, component: () => import('@/views/pizzaria/Orders.vue') },
    { path: 'entregas', name: 'deliveries', meta: { title: 'Entregas' }, component: () => import('@/views/pizzaria/Deliveries.vue') },
    { path: 'cardapio', name: 'menu', meta: { title: 'Cardápio' }, component: () => import('@/views/pizzaria/Menu.vue') },
    { path: 'clientes', name: 'customers', meta: { title: 'Clientes' }, component: () => import('@/views/pizzaria/Customers.vue') },
    { path: 'usuarios', name: 'users', meta: { title: 'Usuários' }, component: () => import('@/views/pizzaria/Users.vue') },
    { path: 'configuracoes', name: 'settings', meta: { title: 'Configurações' }, component: () => import('@/views/pizzaria/Settings.vue') }
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ top: 0 }),
    routes: [
        { path: '/', name: 'storefront', component: () => import('@/views/Storefront.vue') },
        {
            path: '/admin',
            component: AppLayout,
            children: [...adminPages, { path: ':pathMatch(.*)*', name: 'notfound', meta: { title: 'Página não encontrada' }, component: () => import('@/views/pizzaria/NotFound.vue') }]
        },
        ...adminPages.filter((page) => page.path).map((page) => ({ path: '/' + page.path, redirect: { name: page.name } })),
        { path: '/:pathMatch(.*)*', redirect: (route) => ({ name: 'notfound', params: route.params }) }
    ]
});
export default router;
