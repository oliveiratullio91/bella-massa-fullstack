<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
<template>
    <section class="surface-panel empty-state notfound-panel">
        <img src="/pizza-mark.svg" width="64" height="64" alt="" /><span class="eyebrow">ERRO 404</span>
        <h1>Essa fatia não está no cardápio.</h1>
        <p>A página que você procura não existe ou mudou de endereço.</p>
        <Button label="Voltar à visão geral" icon="pi pi-home" @click="router.push({ name: 'dashboard' })" />
    </section>
</template>
