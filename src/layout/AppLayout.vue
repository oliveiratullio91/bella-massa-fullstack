<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { notify } from '@/service/feedback';
import { useRoute } from 'vue-router';
import AppFooter from './AppFooter.vue';
import AppMenu from './AppMenu.vue';
import AppTopbar from './AppTopbar.vue';
import { usePizzaria } from '@/stores/pizzaria';

const { storageError, state, phase, refresh, login } = usePizzaria();
const route = useRoute();
const username = ref('admin');
const password = ref('');
const signingIn = ref(false);
let refreshTimer;
watchEffect(() => {
    document.title = `${route.meta.title ?? 'Pizzaria'} · ${state.settings.name || 'Bella Massa'}`;
});

watch(
    storageError,
    (detail) => {
        if (detail) notify({ severity: phase.value === 'connected' ? 'warn' : 'error', summary: 'Falha na conexão com o painel', detail });
    },
    { immediate: true }
);

onMounted(() => {
    refresh();
    refreshTimer = window.setInterval(() => {
        if (phase.value !== 'signed-out' && document.visibilityState === 'visible') refresh();
    }, 3000);
    window.addEventListener('focus', refresh);
});
onUnmounted(() => {
    window.clearInterval(refreshTimer);
    window.removeEventListener('focus', refresh);
});

async function retryConnection() {
    const previous = storageError.value;
    await refresh();
    if (previous && previous === storageError.value) notify({ severity: 'error', summary: 'Falha na conexão com o painel', detail: previous });
}

async function enter() {
    if (signingIn.value) return;
    signingIn.value = true;
    try {
        await login(username.value.trim(), password.value);
        password.value = '';
    } catch (error) {
        notify({ severity: 'error', summary: 'Não foi possível entrar', detail: error.message, focusTarget: document.getElementById('admin-password') });
    } finally {
        signingIn.value = false;
    }
}
</script>

<template>
    <div v-if="phase === 'connected'" class="admin-shell">
        <AppTopbar />
        <main id="conteudo" class="admin-content" tabindex="-1">
            <Message v-if="storageError" severity="warn" class="mb-4">{{ storageError }}</Message>
            <router-view />
            <AppFooter v-if="route.name !== 'orders'" />
        </main>
        <AppMenu />
    </div>
    <main v-else class="admin-shell">
        <div class="admin-content admin-login-screen">
            <section class="surface-panel admin-login-card">
                <img src="/pizza-mark.svg" alt="" width="48" height="48" />
                <h1>Painel da pizzaria</h1>
                <p v-if="phase === 'checking'" role="status">Conectando ao servidor…</p>
                <template v-else-if="phase === 'unavailable'">
                    <Message severity="error">{{ storageError }}</Message>
                    <Button label="Tentar novamente" icon="pi pi-refresh" @click="retryConnection" />
                </template>
                <form v-else v-feedback-form @submit.prevent="enter">
                    <div class="field">
                        <label for="admin-username">Usuário</label>
                        <InputText id="admin-username" v-model="username" autocomplete="username" placeholder="Ex.: admin" autocapitalize="off" maxlength="40" required fluid />
                    </div>
                    <div class="field">
                        <label for="admin-password">Senha do painel</label>
                        <InputText id="admin-password" v-model="password" type="password" autocomplete="current-password" placeholder="Digite a senha do painel" required fluid />
                    </div>
                    <Button type="submit" label="Entrar no painel" :loading="signingIn" fluid />
                </form>
                <RouterLink :to="{ name: 'storefront' }" class="text-link">Voltar à loja</RouterLink>
            </section>
        </div>
    </main>
    <ConfirmDialog />
</template>
