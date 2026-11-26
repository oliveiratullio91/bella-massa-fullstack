<script setup>
defineProps({ title: String, description: String, eyebrow: { type: String, default: 'SUA PIZZARIA, NO PONTO' } });
</script>
<template>
    <div class="page-header">
        <div>
            <span class="eyebrow">{{ eyebrow }}</span>
            <h1>{{ title }}</h1>
            <p>{{ description }}</p>
        </div>
        <div class="page-actions"><slot /></div>
    </div>
</template>
