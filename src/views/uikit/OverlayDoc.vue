<script setup>
import { formatCurrency } from '@/utils/locale';
import { ProductService } from '@/service/ProductService';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const display = ref(false);
const displayConfirmation = ref(false);
const visibleLeft = ref(false);
const visibleRight = ref(false);
const visibleTop = ref(false);
const visibleBottom = ref(false);
const visibleFull = ref(false);
const products = ref(null);
const selectedProduct = ref(null);
const op = ref(null);
const popup = ref(null);

const toast = useToast();
const confirmPopup = useConfirm();

onMounted(() => {
    ProductService.getProductsSmall().then((data) => (products.value = data));
});

function open() {
    display.value = true;
}

function close() {
    display.value = false;
}

function openConfirmation() {
    displayConfirmation.value = true;
}

function closeConfirmation() {
    displayConfirmation.value = false;
}

function toggleDataTable(event) {
    op.value.toggle(event);
}

function onProductSelect(event) {
    op.value.hide();
    toast.add({ severity: 'info', summary: 'Produto selecionado', detail: event.data.name, life: 3000 });
}

function confirm(event) {
    confirmPopup.require({
        target: event.target,
        message: 'Tem certeza de que deseja continuar?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Salvar'
        },
        accept: () => {
            toast.add({ severity: 'info', summary: 'Confirmado', detail: 'Você confirmou a ação', life: 3000 });
        },
        reject: () => {
            toast.add({ severity: 'info', summary: 'Rejeitado', detail: 'Você rejeitou a ação', life: 3000 });
        }
    });
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Janela de diálogo</div>
                <Dialog header="Janela de diálogo" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                    <p class="leading-normal m-0">
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                    <template #footer>
                        <Button label="Salvar" @click="close" />
                    </template>
                </Dialog>
                <Button label="Exibir" style="width: auto" @click="open" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Painel flutuante</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" label="Exibir" @click="toggleDataTable" />
                    <Popover ref="op" id="overlay_panel" style="width: 450px">
                        <DataTable v-model:selection="selectedProduct" :value="products" selectionMode="single" :paginator="true" :rows="5" @row-select="onProductSelect">
                            <Column field="name" header="Nome" sortable style="min-width: 12rem"></Column>
                            <Column header="Imagem">
                                <template #body="slotProps">
                                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="w-16 shadow-sm" />
                                </template>
                            </Column>
                            <Column field="price" header="Preço" sortable style="min-width: 8rem">
                                <template #body="slotProps"> {{ formatCurrency(slotProps.data.price) }} </template>
                            </Column>
                        </DataTable>
                    </Popover>
                </div>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Dica</div>
                <div class="inline-flex gap-4">
                    <InputText type="text" placeholder="Nome de usuário" v-tooltip="'Seu nome de usuário'" />
                    <Button type="button" label="Salvar" v-tooltip="'Clique para continuar'" />
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Painel lateral</div>
                <Drawer v-model:visible="visibleLeft" header="Painel lateral">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleRight" header="Painel lateral" position="right">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleTop" header="Painel lateral" position="top">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleBottom" header="Painel lateral" position="bottom">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                </Drawer>

                <Drawer v-model:visible="visibleFull" header="Painel lateral" position="full">
                    <p>
                        Este conteúdo de exemplo demonstra a apresentação de informações neste componente. Você pode substituir este texto pelos dados do seu projeto, organizar os detalhes em seções e adaptar a interface às necessidades dos seus
                        usuários. Os componentes permitem criar páginas consistentes, responsivas e fáceis de usar em diferentes dispositivos.
                    </p>
                </Drawer>

                <Button icon="pi pi-arrow-right" @click="visibleLeft = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-left" @click="visibleRight = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-down" @click="visibleTop = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-arrow-up" @click="visibleBottom = true" style="margin-right: 0.25em" />
                <Button icon="pi pi-external-link" @click="visibleFull = true" />
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Confirmação flutuante</div>
                <ConfirmPopup></ConfirmPopup>
                <Button ref="popup" @click="confirm($event)" icon="pi pi-check" label="Confirmar" class="mr-2"></Button>
            </div>

            <div class="card">
                <div class="font-semibold text-xl mb-4">Diálogo de confirmação</div>
                <Button label="Excluir" icon="pi pi-trash" severity="danger" style="width: auto" @click="openConfirmation" />
                <Dialog header="Confirmação" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
                    <div class="flex items-center justify-center">
                        <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                        <span>Tem certeza de que deseja continuar?</span>
                    </div>
                    <template #footer>
                        <Button label="Não" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
                        <Button label="Sim" icon="pi pi-check" @click="closeConfirmation" severity="danger" outlined autofocus />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
