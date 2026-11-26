<script setup>
import { computed, ref, watch } from 'vue';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency, formatPhone, phoneDigits } from '@/utils/locale';
import { lastFormField, notify } from '@/service/feedback';
import PageHeader from '@/components/pizzaria/PageHeader.vue';
import AddressFields from '@/components/pizzaria/AddressFields.vue';
import PhoneInput from '@/components/pizzaria/PhoneInput.vue';
import { useDeleteConfirmation } from '@/components/pizzaria/useDeleteConfirmation';
const { state, saveCustomer, deleteCustomer, activation } = usePizzaria();

const confirmDeletion = useDeleteConfirmation();
const search = ref('');
const sort = ref('recent');
const first = ref(0);
const rows = 8;
const dialogOpen = ref(false);
const draft = ref({});
const saving = ref(false);
const activating = ref(null);
const activationOpen = ref(false);
const activationResult = ref(null);
const customers = computed(() =>
    state.customers.map((customer) => {
        const orders = state.orders.filter((order) => order.customerId === customer.id && order.status !== 'Cancelado');
        return { ...customer, orders: orders.length, spent: orders.filter((order) => order.status === 'Finalizado').reduce((sum, order) => sum + order.total, 0) };
    })
);
const sortOptions = [
    { label: 'Recentes', value: 'recent' },
    { label: 'Nome A–Z', value: 'name-asc', compare: (a, b) => a.name.localeCompare(b.name, 'pt-BR') },
    { label: 'Nome Z–A', value: 'name-desc', compare: (a, b) => b.name.localeCompare(a.name, 'pt-BR') },
    { label: 'Mais pedidos', value: 'orders-desc', compare: (a, b) => b.orders - a.orders },
    { label: 'Menos pedidos', value: 'orders-asc', compare: (a, b) => a.orders - b.orders },
    { label: 'Maior total', value: 'spent-desc', compare: (a, b) => b.spent - a.spent },
    { label: 'Menor total', value: 'spent-asc', compare: (a, b) => a.spent - b.spent }
];
const filtered = computed(() => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR');
    const phoneTerm = /^[\d\s()+-]+$/.test(term) ? phoneDigits(term) : '';
    const matches = customers.value.filter((customer) => {
        const entry = `${customer.name} ${formatPhone(customer.phone)} ${customer.neighborhood}`.toLocaleLowerCase('pt-BR');
        return entry.includes(term) || (phoneTerm && phoneDigits(customer.phone).includes(phoneTerm));
    });
    const compare = sortOptions.find((option) => option.value === sort.value)?.compare;
    return compare ? matches.sort(compare) : matches;
});
const visibleCustomers = computed(() => filtered.value.slice(first.value, first.value + rows));
const recurring = computed(() => filtered.value.filter((customer) => customer.orders > 1).length);

watch([search, sort], () => {
    first.value = 0;
});
watch(
    () => filtered.value.length,
    (count) => {
        if (first.value >= count) first.value = Math.max(0, Math.ceil(count / rows) - 1) * rows;
    }
);

function openEditor(customer) {
    draft.value = customer ? { ...customer } : { name: '', phone: '', address: '', neighborhood: '', notes: '' };
    dialogOpen.value = true;
}
async function save(event) {
    if (saving.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    saving.value = true;
    try {
        await saveCustomer(draft.value);
        dialogOpen.value = false;
        notify({ severity: 'success', summary: 'Cliente salvo', detail: 'O cadastro está pronto para os próximos pedidos.' });
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível salvar o cliente', detail: exception.message, focusTarget });
    } finally {
        saving.value = false;
    }
}
async function generateActivation(customer) {
    if (activating.value) return;
    activating.value = customer.id;
    try {
        const result = await activation(customer.id);
        activationResult.value = { ...result, name: customer.name };
        activationOpen.value = true;
    } catch (exception) {
        notify({ severity: 'warn', summary: 'Acesso ao site', detail: exception.message });
    } finally {
        activating.value = null;
    }
}
function confirmDelete(customer) {
    confirmDeletion({
        label: customer.name,
        message: 'O cliente será removido da lista de cadastros. Os dados registrados nos pedidos serão preservados.',
        summary: 'Cliente excluído',
        remove: () => deleteCustomer(customer.id)
    });
}
</script>
<template>
    <div class="customers-page">
        <PageHeader title="Clientes" eyebrow=""><Button class="customers-add-button" label="Cadastrar cliente" icon="pi pi-user-plus" @click="openEditor()" /></PageHeader>
        <div class="customers-toolbar">
            <IconField><InputIcon class="pi pi-search" /><InputText v-model="search" aria-label="Buscar cliente" placeholder="Nome, telefone ou bairro" fluid /></IconField>
            <Select v-model="sort" :options="sortOptions" optionLabel="label" optionValue="value" aria-label="Ordenar clientes" placeholder="Ordenar" fluid />
        </div>
        <div v-if="filtered.length" class="admin-list-results">
            <p role="status">
                <span v-if="filtered.length > rows">{{ first + 1 }}–{{ Math.min(first + rows, filtered.length) }} de </span>{{ filtered.length }} {{ filtered.length === 1 ? 'cliente' : 'clientes' }}
                <span v-if="recurring"> · {{ recurring }} {{ recurring === 1 ? 'recorrente' : 'recorrentes' }}</span>
            </p>
            <Paginator
                v-if="filtered.length > rows"
                v-model:first="first"
                :rows="rows"
                :totalRecords="filtered.length"
                class="admin-list-pagination"
                aria-label="Páginas de clientes"
                :template="{ '660px': 'PrevPageLink NextPageLink', default: 'PrevPageLink PageLinks NextPageLink' }"
            />
        </div>
        <div v-if="visibleCustomers.length" class="surface-panel customers-list-panel">
            <div class="admin-list-heading customers-list-heading" aria-hidden="true">
                <span>Cliente</span>
                <span>Telefone</span>
                <span>Bairro</span>
                <span>Pedidos</span>
                <span>Total em compras</span>
                <span>Ações</span>
            </div>
            <ul class="admin-list" role="list" aria-label="Cadastros de clientes">
                <li v-for="customer in visibleCustomers" :key="customer.id" class="admin-list-row customers-list-row">
                    <strong class="customers-list-name">{{ customer.name }}</strong>
                    <span class="customers-list-phone"><span class="sr-only">Telefone </span>{{ formatPhone(customer.phone) }}</span>
                    <span class="customers-list-neighborhood muted"><span class="sr-only">Bairro </span>{{ customer.neighborhood || 'Não informado' }}</span>
                    <div class="customers-list-metrics">
                        <span
                            >{{ customer.orders }} <span class="customers-orders-label">{{ customer.orders === 1 ? 'pedido' : 'pedidos' }}</span></span
                        >
                        <strong class="customers-list-spent"><span class="sr-only">Total em compras </span>{{ formatCurrency(customer.spent) }}</strong>
                    </div>
                    <div class="admin-list-actions customers-list-actions">
                        <Button icon="pi pi-key" title="Gerar código de ativação" :aria-label="`Gerar código de ativação para ${customer.name}`" text severity="secondary" :loading="activating === customer.id" @click="generateActivation(customer)" />
                        <Button icon="pi pi-pencil" title="Editar cliente" :aria-label="`Editar cliente ${customer.name}`" text severity="secondary" @click="openEditor(customer)" />
                        <Button icon="pi pi-trash" title="Excluir cliente" :aria-label="`Excluir cliente ${customer.name}`" text severity="danger" @click="confirmDelete(customer)" />
                    </div>
                </li>
            </ul>
        </div>
        <div v-else class="surface-panel empty-state">
            <i class="pi pi-users" aria-hidden="true"></i>
            <h2>Nenhum cliente encontrado</h2>
            <p>Altere a busca ou faça um novo cadastro.</p>
            <Button v-if="search.trim()" label="Limpar busca" text @click="search = ''" />
        </div>
        <p class="section-footnote">O total em compras considera apenas pedidos finalizados. Todos os contatos iniciais são fictícios.</p>
        <Dialog v-model:visible="dialogOpen" modal :header="draft.id ? 'Editar cliente' : 'Cadastrar cliente'" :style="{ width: '620px' }" :breakpoints="{ '700px': '94vw' }"
            ><form v-feedback-form @submit.prevent="save">
                <p class="dialog-intro">Um atendimento próximo começa com um cadastro bem cuidado.</p>
                <div class="form-grid">
                    <div class="field full">
                        <label for="customer-name">Nome completo <span>*</span></label
                        ><InputText id="customer-name" v-model="draft.name" placeholder="Ex.: Ana Oliveira" maxlength="100" fluid />
                    </div>
                    <div class="field">
                        <label for="customer-phone">Telefone com DDD <span>*</span></label
                        ><PhoneInput id="customer-phone" v-model="draft.phone" />
                    </div>
                    <AddressFields v-if="dialogOpen" v-model="draft" prefix="customer" />
                    <div class="field full">
                        <label for="customer-notes">Observações do cadastro</label><Textarea id="customer-notes" v-model="draft.notes" placeholder="Ex.: interfone 12 ou portão azul" rows="3" maxlength="400" fluid /><small
                            >As observações específicas da pizza devem ser informadas no pedido.</small
                        >
                    </div>
                </div>
                <div class="dialog-actions"><Button label="Cancelar" severity="secondary" text @click="dialogOpen = false" /><Button type="submit" label="Salvar cliente" icon="pi pi-check" :loading="saving" /></div></form
        ></Dialog>
        <Dialog v-model:visible="activationOpen" modal header="Ativar acesso ao site" :style="{ width: '460px' }" :breakpoints="{ '520px': '94vw' }">
            <div v-if="activationResult" class="field">
                <p>Entregue este código a {{ activationResult.name }}. O cliente deve usar o telefone cadastrado na opção <strong>Ativar cadastro</strong> da loja.</p>
                <label for="activation-code">Código de uso único, válido por 24 horas</label>
                <InputText id="activation-code" :modelValue="activationResult.code" readonly fluid />
            </div>
        </Dialog>
    </div>
</template>
