<script setup>
import { ref } from 'vue';

const items = ref([
    {
        label: 'Atualizar',
        icon: 'pi pi-refresh'
    },
    {
        label: 'Excluir',
        icon: 'pi pi-times'
    },
    {
        separator: true
    },
    {
        label: 'Início',
        icon: 'pi pi-home'
    }
]);

const loading = ref([false, false, false]);

function load(index) {
    loading.value[index] = true;
    setTimeout(() => (loading.value[index] = false), 1000);
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Padrão</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Enviar"></Button>
                    <Button label="Desabilitado" :disabled="true"></Button>
                    <Button label="Hiperlink" class="p-button-link" />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Níveis de destaque</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Cor principal" />
                    <Button label="Secundário" severity="secondary" />
                    <Button label="Sucesso" severity="success" />
                    <Button label="Informação" severity="info" />
                    <Button label="Aviso" severity="warn" />
                    <Button label="Ajuda" severity="help" />
                    <Button label="Perigo" severity="danger" />
                    <Button label="Contraste" severity="contrast" />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Texto</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Cor principal" text />
                    <Button label="Secundário" severity="secondary" text />
                    <Button label="Sucesso" severity="success" text />
                    <Button label="Informação" severity="info" text />
                    <Button label="Aviso" severity="warn" text />
                    <Button label="Ajuda" severity="help" text />
                    <Button label="Perigo" severity="danger" text />
                    <Button label="Simples" plain text />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Com contorno</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Cor principal" outlined />
                    <Button label="Secundário" severity="secondary" outlined />
                    <Button label="Sucesso" severity="success" outlined />
                    <Button label="Informação" severity="info" outlined />
                    <Button label="Aviso" severity="warn" outlined />
                    <Button label="Ajuda" severity="help" outlined />
                    <Button label="Perigo" severity="danger" outlined />
                    <Button label="Contraste" severity="contrast" outlined />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Grupo</div>
                <div class="flex flex-wrap gap-2">
                    <ButtonGroup>
                        <Button label="Salvar" icon="pi pi-check" />
                        <Button label="Excluir" icon="pi pi-trash" />
                        <Button label="Cancelar" icon="pi pi-times" />
                    </ButtonGroup>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Botão com menu</div>
                <div class="flex flex-wrap gap-2">
                    <SplitButton label="Salvar" :model="items"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="secondary"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="success"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="info"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="warn"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="help"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="danger"></SplitButton>
                    <SplitButton label="Salvar" :model="items" severity="contrast"></SplitButton>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Personalização</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button">
                        <img alt="Logotipo" src="/demo/images/logo-white.svg" style="width: 1.5rem" />
                    </Button>
                    <Button type="button" outlined severity="success">
                        <img alt="Logotipo" src="/demo/images/logo.svg" style="width: 1.5rem" />
                        <span class="ml-2 text-bold">PrimeVue</span>
                    </Button>
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Ícones</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-star-fill" class="mr-2 mb-2"></Button>
                    <Button label="Favoritar" icon="pi pi-bookmark" class="mr-2 mb-2"></Button>
                    <Button label="Favoritar" icon="pi pi-bookmark" iconPos="right" class="mr-2 mb-2"></Button>
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Com sombra</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Cor principal" raised />
                    <Button label="Secundário" severity="secondary" raised />
                    <Button label="Sucesso" severity="success" raised />
                    <Button label="Informação" severity="info" raised />
                    <Button label="Aviso" severity="warn" raised />
                    <Button label="Ajuda" severity="help" raised />
                    <Button label="Perigo" severity="danger" raised />
                    <Button label="Contraste" severity="contrast" raised />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Arredondado</div>
                <div class="flex flex-wrap gap-2">
                    <Button label="Cor principal" rounded />
                    <Button label="Secundário" severity="secondary" rounded />
                    <Button label="Sucesso" severity="success" rounded />
                    <Button label="Informação" severity="info" rounded />
                    <Button label="Aviso" severity="warn" rounded />
                    <Button label="Ajuda" severity="help" rounded />
                    <Button label="Perigo" severity="danger" rounded />
                    <Button label="Contraste" severity="contrast" rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Ícones arredondados</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" rounded />
                    <Button icon="pi pi-bookmark" severity="secondary" rounded />
                    <Button icon="pi pi-search" severity="success" rounded />
                    <Button icon="pi pi-user" severity="info" rounded />
                    <Button icon="pi pi-bell" severity="warn" rounded />
                    <Button icon="pi pi-heart" severity="help" rounded />
                    <Button icon="pi pi-times" severity="danger" rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Texto arredondado</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" text raised rounded />
                    <Button icon="pi pi-bookmark" severity="secondary" text raised rounded />
                    <Button icon="pi pi-search" severity="success" text raised rounded />
                    <Button icon="pi pi-user" severity="info" text raised rounded />
                    <Button icon="pi pi-bell" severity="warn" text raised rounded />
                    <Button icon="pi pi-heart" severity="help" text raised rounded />
                    <Button icon="pi pi-times" severity="danger" text raised rounded />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Contorno arredondado</div>
                <div class="flex flex-wrap gap-2">
                    <Button icon="pi pi-check" rounded outlined />
                    <Button icon="pi pi-bookmark" severity="secondary" rounded outlined />
                    <Button icon="pi pi-search" severity="success" rounded outlined />
                    <Button icon="pi pi-user" severity="info" rounded outlined />
                    <Button icon="pi pi-bell" severity="warn" rounded outlined />
                    <Button icon="pi pi-heart" severity="help" rounded outlined />
                    <Button icon="pi pi-times" severity="danger" rounded outlined />
                </div>
            </div>
            <div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Carregando</div>
                <div class="flex flex-wrap gap-2">
                    <Button type="button" class="mr-2 mb-2" label="Pesquisar" icon="pi pi-search" :loading="loading[0]" @click="load(0)" />
                    <Button type="button" class="mr-2 mb-2" label="Pesquisar" icon="pi pi-search" iconPos="right" :loading="loading[1]" @click="load(1)" />
                    <Button type="button" class="mr-2 mb-2" icon="pi pi-search" :loading="loading[2]" @click="load(2)" />
                    <Button type="button" class="mr-2 mb-2" label="Pesquisar" :loading="loading[3]" @click="load(3)" />
                </div>
            </div>
        </div>
    </div>
</template>
