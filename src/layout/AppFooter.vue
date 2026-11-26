<script setup>
import { usePizzaria } from '@/stores/pizzaria';
const { state } = usePizzaria();
</script>
<template>
    <footer class="layout-footer">
        <span>{{ state.settings.name }} · Projeto acadêmico</span><span>Desenvolvido com <a href="https://primevue.org" target="_blank" rel="noopener noreferrer">PrimeVue Sakai</a></span>
    </footer>
</template>
