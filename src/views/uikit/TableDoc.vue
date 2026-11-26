<script setup>
import { formatCurrency, formatDate, translateStatus } from '@/utils/locale';
import { CustomerService } from '@/service/CustomerService';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { onBeforeMount, reactive, ref } from 'vue';

const customers1 = ref(null);
const customers2 = ref(null);
const customers3 = ref(null);
const filters1 = ref(null);
const loading1 = ref(null);
const balanceFrozen = ref(false);
const products = ref(null);
const expandedRows = ref([]);
const statuses = reactive(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal'].map((value) => ({ label: translateStatus(value), value })));
const representatives = reactive([
    { name: 'Amy Elsner', image: 'amyelsner.png' },
    { name: 'Anna Fali', image: 'annafali.png' },
    { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
    { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
    { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
    { name: 'Onyama Limba', image: 'onyamalimba.png' },
    { name: 'Stephen Shaw', image: 'stephenshaw.png' },
    { name: 'XuXue Feng', image: 'xuxuefeng.png' }
]);

function getOrderSeverity(order) {
    switch (order.status) {
        case 'DELIVERED':
            return 'success';

        case 'CANCELLED':
            return 'danger';

        case 'PENDING':
            return 'warn';

        case 'RETURNED':
            return 'info';

        default:
            return null;
    }
}

function getSeverity(status) {
    switch (status) {
        case 'unqualified':
            return 'danger';

        case 'qualified':
            return 'success';

        case 'new':
            return 'info';

        case 'negotiation':
            return 'warn';

        case 'renewal':
            return null;
    }
}

function getStockSeverity(product) {
    switch (product.inventoryStatus) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
}

onBeforeMount(() => {
    ProductService.getProductsWithOrdersSmall().then((data) => (products.value = data));
    CustomerService.getCustomersLarge().then((data) => {
        customers1.value = data;
        loading1.value = false;
        customers1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });
    CustomerService.getCustomersLarge().then((data) => (customers2.value = data));
    CustomerService.getCustomersMedium().then((data) => (customers3.value = data));

    initFilters1();
});

function initFilters1() {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 100], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
}

function expandAll() {
    expandedRows.value = products.value.reduce((acc, p) => (acc[p.id] = true) && acc, {});
}

function collapseAll() {
    expandedRows.value = null;
}

function calculateCustomerTotal(name) {
    let total = 0;
    if (customers3.value) {
        for (let customer of customers3.value) {
            if (customer.representative.name === name) {
                total++;
            }
        }
    }

    return total;
}
</script>

<template>
    <div class="card">
        <div class="font-semibold text-xl mb-4">Filtros</div>
        <DataTable
            :value="customers1"
            :paginator="true"
            :rows="10"
            dataKey="id"
            :rowHover="true"
            v-model:filters="filters1"
            filterDisplay="menu"
            :loading="loading1"
            :filters="filters1"
            :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
            showGridlines
        >
            <template #header>
                <div class="flex justify-between">
                    <Button type="button" icon="pi pi-filter-slash" label="Limpar" outlined @click="clearFilter()" />
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters1['global'].value" placeholder="Pesquisar por palavra-chave" />
                    </IconField>
                </div>
            </template>
            <template #empty> Nenhum cliente encontrado. </template>
            <template #loading> Carregando os dados dos clientes. Aguarde. </template>
            <Column field="name" header="Nome" style="min-width: 12rem">
                <template #body="{ data }">
                    {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Pesquisar por nome" />
                </template>
            </Column>
            <Column header="País" filterField="country.name" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img alt="Bandeira" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <InputText v-model="filterModel.value" type="text" placeholder="Pesquisar por país" />
                </template>
                <template #filterclear="{ filterCallback }">
                    <Button type="button" icon="pi pi-times" @click="filterCallback()" severity="secondary"></Button>
                </template>
                <template #filterapply="{ filterCallback }">
                    <Button type="button" icon="pi pi-check" @click="filterCallback()" severity="success"></Button>
                </template>
            </Column>
            <Column header="Agente" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                <template #body="{ data }">
                    <div class="flex items-center gap-2">
                        <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                        <span>{{ data.representative.name }}</span>
                    </div>
                </template>
                <template #filter="{ filterModel }">
                    <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Qualquer">
                        <template #option="slotProps">
                            <div class="flex items-center gap-2">
                                <img :alt="slotProps.option.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.option.image}`" style="width: 32px" />
                                <span>{{ slotProps.option.name }}</span>
                            </div>
                        </template>
                    </MultiSelect>
                </template>
            </Column>
            <Column header="Data" filterField="date" dataType="date" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatDate(data.date) }}
                </template>
                <template #filter="{ filterModel }">
                    <DatePicker v-model="filterModel.value" dateFormat="dd/mm/yy" placeholder="dd/mm/aaaa" />
                </template>
            </Column>
            <Column header="Saldo" filterField="balance" dataType="numeric" style="min-width: 10rem">
                <template #body="{ data }">
                    {{ formatCurrency(data.balance) }}
                </template>
                <template #filter="{ filterModel }">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="BRL" locale="pt-BR" />
                </template>
            </Column>
            <Column header="Situação" field="status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                <template #body="{ data }">
                    <Tag :value="translateStatus(data.status)" :severity="getSeverity(data.status)" />
                </template>
                <template #filter="{ filterModel }">
                    <Select v-model="filterModel.value" :options="statuses" optionLabel="label" optionValue="value" placeholder="Selecione uma opção" showClear>
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.label" :severity="getSeverity(slotProps.option.value)" />
                        </template>
                    </Select>
                </template>
            </Column>
            <Column field="activity" header="Atividade" :showFilterMatchModes="false" style="min-width: 12rem">
                <template #body="{ data }">
                    <ProgressBar :value="data.activity" :showValue="false" style="height: 6px"></ProgressBar>
                </template>
                <template #filter="{ filterModel }">
                    <Slider v-model="filterModel.value" range class="m-4"></Slider>
                    <div class="flex items-center justify-between px-2">
                        <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                        <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                    </div>
                </template>
            </Column>
            <Column field="verified" header="Verificado" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                <template #body="{ data }">
                    <i class="pi" :class="{ 'pi-check-circle text-green-500 ': data.verified, 'pi-times-circle text-red-500': !data.verified }"></i>
                </template>
                <template #filter="{ filterModel }">
                    <label for="verified-filter" class="font-bold"> Verificado </label>
                    <Checkbox v-model="filterModel.value" :indeterminate="filterModel.value === null" binary inputId="verified-filter" />
                </template>
            </Column>
        </DataTable>
    </div>

    <div class="card">
        <div class="font-semibold text-xl mb-4">Colunas fixas</div>
        <ToggleButton v-model="balanceFrozen" onIcon="pi pi-lock" offIcon="pi pi-lock-open" onLabel="Saldo" offLabel="Saldo" />

        <DataTable :value="customers2" scrollable scrollHeight="400px" class="mt-6">
            <Column field="name" header="Nome" style="min-width: 200px" frozen class="font-bold"></Column>
            <Column field="id" header="Identificador" style="min-width: 100px"></Column>
            <Column field="name" header="Nome" style="min-width: 200px"></Column>
            <Column field="country.name" header="País" style="min-width: 200px"></Column>
            <Column field="date" header="Data" style="min-width: 200px"
                ><template #body="{ data }">{{ formatDate(data.date) }}</template></Column
            >
            <Column field="company" header="Empresa" style="min-width: 200px"></Column>
            <Column field="status" header="Situação" style="min-width: 200px"
                ><template #body="{ data }">{{ translateStatus(data.status) }}</template></Column
            >
            <Column field="activity" header="Atividade" style="min-width: 200px"></Column>
            <Column field="representative.name" header="Representante" style="min-width: 200px"></Column>
            <Column field="balance" header="Saldo" style="min-width: 200px" alignFrozen="right" :frozen="balanceFrozen">
                <template #body="{ data }">
                    <span class="font-bold">{{ formatCurrency(data.balance) }}</span>
                </template>
            </Column>
        </DataTable>
    </div>

    <div class="card">
        <div class="font-semibold text-xl mb-4">Expansão de linhas</div>
        <DataTable v-model:expandedRows="expandedRows" :value="products" dataKey="id" tableStyle="min-width: 60rem">
            <template #header>
                <div class="flex flex-wrap justify-end gap-2">
                    <Button text icon="pi pi-plus" label="Expandir tudo" @click="expandAll" />
                    <Button text icon="pi pi-minus" label="Recolher tudo" @click="collapseAll" />
                </div>
            </template>
            <Column expander style="width: 5rem" />
            <Column field="name" header="Nome"></Column>
            <Column header="Imagem">
                <template #body="slotProps">
                    <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="shadow-lg" width="64" />
                </template>
            </Column>
            <Column field="price" header="Preço">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.price) }}
                </template>
            </Column>
            <Column field="category" header="Categoria"></Column>
            <Column field="rating" header="Avaliações">
                <template #body="slotProps">
                    <Rating :modelValue="slotProps.data.rating" readonly />
                </template>
            </Column>
            <Column header="Situação">
                <template #body="slotProps">
                    <Tag :value="translateStatus(slotProps.data.inventoryStatus)" :severity="getStockSeverity(slotProps.data)" />
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>Pedidos de {{ slotProps.data.name }}</h5>
                    <DataTable :value="slotProps.data.orders">
                        <Column field="id" header="Identificador" sortable></Column>
                        <Column field="customer" header="Cliente" sortable></Column>
                        <Column field="date" header="Data" sortable
                            ><template #body="{ data }">{{ formatDate(data.date) }}</template></Column
                        >
                        <Column field="amount" header="Valor" sortable>
                            <template #body="slotProps">
                                {{ formatCurrency(slotProps.data.amount) }}
                            </template>
                        </Column>
                        <Column field="status" header="Situação" sortable>
                            <template #body="slotProps">
                                <Tag :value="translateStatus(slotProps.data.status.toLowerCase())" :severity="getOrderSeverity(slotProps.data)" />
                            </template>
                        </Column>
                        <Column headerStyle="width:4rem">
                            <template #body>
                                <Button icon="pi pi-search" />
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>
    </div>

    <div class="card">
        <div class="font-semibold text-xl mb-4">Agrupamento</div>
        <DataTable :value="customers3" rowGroupMode="subheader" groupRowsBy="representative.name" sortMode="single" sortField="representative.name" :sortOrder="1" scrollable scrollHeight="400px" tableStyle="min-width: 50rem">
            <template #groupheader="slotProps">
                <div class="flex items-center gap-2">
                    <img :alt="slotProps.data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${slotProps.data.representative.image}`" width="32" style="vertical-align: middle" />
                    <span>{{ slotProps.data.representative.name }}</span>
                </div>
            </template>
            <Column field="representative.name" header="Representante"></Column>
            <Column field="name" header="Nome" style="min-width: 200px"></Column>
            <Column field="country" header="País" style="min-width: 200px">
                <template #body="slotProps">
                    <div class="flex items-center gap-2">
                        <img alt="Bandeira" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.data.country.code}`" style="width: 24px" />
                        <span>{{ slotProps.data.country.name }}</span>
                    </div>
                </template>
            </Column>
            <Column field="company" header="Empresa" style="min-width: 200px"></Column>
            <Column field="status" header="Situação" style="min-width: 200px">
                <template #body="slotProps">
                    <Tag :value="translateStatus(slotProps.data.status)" :severity="getSeverity(slotProps.data.status)" />
                </template>
            </Column>
            <Column field="date" header="Data" style="min-width: 200px"></Column>
            <template #groupfooter="slotProps">
                <div class="flex justify-end font-bold w-full">Total de clientes: {{ calculateCustomerTotal(slotProps.data.representative.name) }}</div>
            </template>
        </DataTable>
    </div>
</template>

<style scoped lang="scss">
:deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

:deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
</style>
