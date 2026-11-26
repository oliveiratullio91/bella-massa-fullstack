<script setup>
import { NodeService } from '@/service/NodeService';
import { onMounted, ref } from 'vue';

const treeValue = ref(null);
const selectedTreeValue = ref(null);
const treeTableValue = ref(null);
const selectedTreeTableValue = ref(null);

onMounted(() => {
    NodeService.getTreeNodes().then((data) => (treeValue.value = data));
    NodeService.getTreeTableNodes().then((data) => (treeTableValue.value = data));
});
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl">Árvore</div>
        <Tree :value="treeValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeValue"></Tree>
    </div>

    <div class="card">
        <div class="font-semibold text-xl mb-4">Tabela em árvore</div>
        <TreeTable :value="treeTableValue" selectionMode="checkbox" v-model:selectionKeys="selectedTreeTableValue">
            <Column field="name" header="Nome" :expander="true"></Column>
            <Column field="size" header="Tamanho"></Column>
            <Column field="type" header="Tipo"></Column>
        </TreeTable>
    </div>
</template>
