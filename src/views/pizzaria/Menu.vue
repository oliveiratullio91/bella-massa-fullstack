<script setup>
import { computed, ref } from 'vue';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency } from '@/utils/locale';
import { CATEGORIES, SIZES, productKind, productPrice } from '@/utils/pizzaria';
import { productArtwork, productPhoto, productPhotoOptions } from '@/utils/productMedia';
import { lastFormField, notify } from '@/service/feedback';
import PageHeader from '@/components/pizzaria/PageHeader.vue';
import PizzaArt from '@/components/pizzaria/PizzaArt.vue';
import { useDeleteConfirmation } from '@/components/pizzaria/useDeleteConfirmation';
const { state, saveProduct, deleteProduct } = usePizzaria();

const confirmDeletion = useDeleteConfirmation();
const search = ref('');
const category = ref('Todos');
const availability = ref('Todos os produtos');
const dialogOpen = ref(false);
const draft = ref({});
const saving = ref(false);
const catalogSummary = computed(() => `${state.products.length} produtos · ${state.products.filter((product) => product.active).length} disponíveis`);
const filtered = computed(() =>
    state.products.filter(
        (product) =>
            (category.value === 'Todos' || product.category === category.value) &&
            (!search.value.trim() || `${product.name} ${product.description}`.toLocaleLowerCase('pt-BR').includes(search.value.trim().toLocaleLowerCase('pt-BR'))) &&
            (availability.value === 'Todos os produtos' || (availability.value === 'Disponíveis' ? product.active : !product.active))
    )
);
const priceLabels = { pizza: 'Preço da pizza grande', bebida: 'Preço por unidade', extra: 'Preço da porção', sobremesa: 'Preço por unidade' };
const examplePrices = { pizza: 49.9, bebida: 12, extra: 18.9, sobremesa: 12.9 };
function changeCategory(value) {
    draft.value.category = value;
    const photos = productPhotoOptions(value);
    if (!photos.some((photo) => photo.value === draft.value.art)) draft.value.art = photos[0].value;
}
function openEditor(product) {
    draft.value = product ? { ...product, art: productArtwork(product) } : { name: '', description: '', category: 'Tradicionais', price: null, art: 'margherita', active: true, featured: false };
    dialogOpen.value = true;
}
async function save(event) {
    if (saving.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    saving.value = true;
    try {
        await saveProduct(draft.value);
        dialogOpen.value = false;
        notify({ severity: 'success', summary: 'Cardápio atualizado', detail: draft.value.id ? 'As alterações do produto foram salvas.' : 'O novo produto já está no cardápio.' });
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível salvar o produto', detail: exception.message, focusTarget });
    } finally {
        saving.value = false;
    }
}
async function toggleProduct(product, active) {
    try {
        await saveProduct({ ...product, active });
        notify({ severity: 'info', summary: active ? 'Produto disponível' : 'Produto pausado', detail: product.name });
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível alterar', detail: exception.message });
    }
}
function confirmDelete(product) {
    confirmDeletion({
        label: product.name,
        message: 'O produto será removido do cardápio. Os itens e os preços registrados nos pedidos serão preservados.',
        summary: 'Produto excluído',
        remove: () => deleteProduct(product.id)
    });
}
</script>
<template>
    <div class="menu-catalog">
        <PageHeader title="Nosso cardápio" eyebrow="" :description="catalogSummary"><Button label="Adicionar produto" icon="pi pi-plus" @click="openEditor()" /></PageHeader>
        <div class="menu-toolbar">
            <div class="category-tabs" role="group" aria-label="Categorias do cardápio">
                <button v-for="item in ['Todos', ...CATEGORIES]" :key="item" :class="{ selected: category === item }" :aria-pressed="category === item" @click="category = item">{{ item }}</button>
            </div>
            <div class="menu-search-row">
                <IconField class="search-field"><InputIcon class="pi pi-search" /><InputText v-model="search" placeholder="Buscar produto" aria-label="Buscar produto no cardápio" fluid /></IconField>
                <Select v-model="availability" :options="['Todos os produtos', 'Disponíveis', 'Pausados']" aria-label="Filtrar disponibilidade" placeholder="Disponibilidade" />
            </div>
        </div>
        <div v-if="!filtered.length" class="surface-panel empty-state">
            <i class="pi pi-search" aria-hidden="true"></i>
            <h3>Nenhum sabor encontrado</h3>
            <p>Altere a busca ou escolha outra categoria.</p>
            <Button
                label="Limpar filtros"
                text
                @click="
                    search = '';
                    category = 'Todos';
                    availability = 'Todos os produtos';
                "
            />
        </div>
        <div v-else class="menu-grid">
            <article v-for="product in filtered" :key="product.id" class="product-card" :class="{ paused: !product.active }">
                <div class="product-card-main">
                    <div class="product-art">
                        <img v-if="productPhoto(product)" :src="productPhoto(product)" class="admin-product-photo" alt="" width="72" height="48" loading="lazy" />
                        <PizzaArt v-else :variant="product.art" />
                    </div>
                    <div class="product-copy">
                        <div class="product-title">
                            <h2>{{ product.name }}</h2>
                            <i v-if="product.featured" class="pi pi-star-fill" title="Destaque da casa" role="img" aria-label="Destaque da casa"></i>
                        </div>
                        <p :title="product.description">
                            {{ product.category }}<template v-if="product.description"> · {{ product.description }}</template>
                        </p>
                        <dl v-if="product.kind === 'pizza'" class="size-prices">
                            <div v-for="size in SIZES" :key="size.value">
                                <dt>{{ size.value }}</dt>
                                <dd>{{ formatCurrency(productPrice(product, size.value)) }}</dd>
                            </div>
                        </dl>
                        <div v-else class="product-price">
                            <strong>{{ formatCurrency(product.price) }}</strong
                            ><small>{{ product.kind === 'extra' ? 'Por porção' : 'Por unidade' }}</small>
                        </div>
                    </div>
                </div>
                <div class="product-card-footer">
                    <div class="availability-toggle">
                        <ToggleSwitch :inputId="'available-' + product.id" :modelValue="product.active" :aria-label="'Disponibilidade de ' + product.name" @update:modelValue="toggleProduct(product, $event)" /><label
                            :for="'available-' + product.id"
                            >{{ product.active ? 'Disponível' : 'Pausado' }}</label
                        >
                    </div>
                    <div class="record-actions">
                        <Button icon="pi pi-pencil" text severity="secondary" title="Editar produto" :aria-label="'Editar ' + product.name" @click="openEditor(product)" />
                        <Button icon="pi pi-trash" text severity="danger" title="Excluir produto" :aria-label="'Excluir ' + product.name" @click="confirmDelete(product)" />
                    </div>
                </div>
            </article>
        </div>
        <p class="section-footnote">Pizzas pequenas e médias custam, respectivamente, 70% e 85% do preço da grande. A disponibilidade vale para novos pedidos.</p>
        <Dialog v-model:visible="dialogOpen" modal :header="draft.id ? 'Editar produto' : 'Novo produto'" :style="{ width: '630px' }" :breakpoints="{ '700px': '94vw' }">
            <form v-feedback-form @submit.prevent="save">
                <div class="product-editor-preview">
                    <img v-if="productPhoto(draft)" :src="productPhoto(draft)" alt="" width="92" height="70" />
                    <PizzaArt v-else :variant="draft.art" />
                    <div>
                        <strong>{{ draft.name || 'Um novo sabor vem aí' }}</strong
                        ><span>{{ formatCurrency(draft.price) }}</span>
                    </div>
                </div>
                <div class="form-grid">
                    <div class="field full">
                        <label for="product-name">Nome do produto <span>*</span></label
                        ><InputText id="product-name" v-model="draft.name" placeholder="Ex.: Calabresa da casa" maxlength="80" fluid />
                    </div>
                    <div class="field">
                        <label for="product-category">Categoria <span>*</span></label
                        ><Select inputId="product-category" aria-label="Categoria do produto" :modelValue="draft.category" :options="CATEGORIES" placeholder="Selecione a categoria" fluid @update:modelValue="changeCategory" />
                    </div>
                    <div class="field">
                        <label for="product-price">{{ priceLabels[productKind(draft.category)] }} <span>*</span></label
                        ><InputNumber inputId="product-price" v-model="draft.price" :placeholder="formatCurrency(examplePrices[productKind(draft.category)])" mode="currency" currency="BRL" locale="pt-BR" :min="0.01" :max="5000" fluid />
                    </div>
                    <div class="field full">
                        <label for="product-description">Ingredientes e descrição</label><Textarea id="product-description" v-model="draft.description" rows="3" maxlength="300" placeholder="Ex.: molho de tomate, muçarela e orégano" fluid />
                    </div>
                    <div class="field full">
                        <label for="product-art">Imagem do produto</label
                        ><Select inputId="product-art" aria-label="Imagem do produto" v-model="draft.art" :options="productPhotoOptions(draft.category)" optionLabel="label" optionValue="value" placeholder="Selecione a imagem" fluid />
                    </div>
                    <div class="field">
                        <div class="switch-field"><ToggleSwitch inputId="product-active" v-model="draft.active" /><label for="product-active">Disponível para pedidos</label></div>
                    </div>
                    <div class="field">
                        <div class="switch-field"><ToggleSwitch inputId="product-featured" v-model="draft.featured" /><label for="product-featured">Destaque da casa</label></div>
                    </div>
                </div>
                <div class="dialog-actions"><Button label="Cancelar" severity="secondary" text @click="dialogOpen = false" /><Button type="submit" label="Salvar produto" icon="pi pi-check" :loading="saving" /></div>
            </form>
        </Dialog>
    </div>
</template>
