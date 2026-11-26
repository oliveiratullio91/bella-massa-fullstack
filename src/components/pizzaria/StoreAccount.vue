<script setup>
import { ref, watch } from 'vue';
import { lastFormField, notify } from '@/service/feedback';
import { api } from '@/service/api';
import { formatCurrency, formatPhone } from '@/utils/locale';
import { statusSeverity } from '@/utils/pizzaria';
import PhoneInput from './PhoneInput.vue';
import AddressFields from './AddressFields.vue';

const props = defineProps({ visible: Boolean, customer: Object });
const emit = defineEmits(['update:visible', 'customer', 'saved', 'confirmed']);
const modes = [
    { label: 'Entrar', value: 'login' },
    { label: 'Criar conta', value: 'register' },
    { label: 'Ativar cadastro', value: 'activate' }
];
const mode = ref('login');
const form = ref({ name: '', phone: '', password: '', code: '' });
const profile = ref({});
const orders = ref([]);
const busy = ref(false);
let confirmation = '';
const orderDate = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Fortaleza' });
let formShown = false;

watch(
    [() => props.visible, () => props.customer?.id],
    ([visible, id]) => {
        if (!visible) {
            form.value.password = '';
            form.value.code = '';
            return;
        }
        orders.value = [];
        if (id) {
            profile.value = { ...props.customer };
            refreshOrders(id);
        }
    },
    { immediate: true }
);

function changeMode(value) {
    mode.value = value;
    form.value.password = '';
    form.value.code = '';
}

async function refreshOrders(id) {
    try {
        const data = await api('/customer/orders');
        if (props.customer?.id === id) orders.value = data.orders;
    } catch (exception) {
        if (props.visible && props.customer?.id === id) notify({ severity: 'error', summary: 'Não foi possível carregar seus pedidos', detail: exception.message });
    }
}

function confirmSave(customer, message) {
    confirmation = message;
    emit('saved', customer);
    emit('update:visible', false);
    if (!formShown) showConfirmation();
}

function onFormHidden() {
    formShown = false;
    showConfirmation();
}

function showConfirmation() {
    if (!confirmation) return;
    notify({ severity: 'success', summary: confirmation, onConfirm: () => emit('confirmed') });
    confirmation = '';
}

async function authenticate(event) {
    if (busy.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    busy.value = true;
    try {
        const action = mode.value;
        const { phone, password, name, code, address, neighborhood, postalCode, uf, municipality, municipalityId } = form.value;
        const body = action === 'login' ? { phone, password } : action === 'activate' ? { phone, password, code } : { phone, password, name, address, neighborhood, postalCode, uf, municipality, municipalityId };
        const data = await api(action === 'login' ? '/customer/login' : '/customer/register', { method: 'POST', body });
        form.value = { name: '', phone: '', password: '', code: '' };
        if (action === 'login') emit('customer', data.customer);
        else confirmSave(data.customer, action === 'register' ? 'Conta criada com sucesso' : 'Cadastro ativado com sucesso');
    } catch (exception) {
        notify({
            severity: 'error',
            summary: mode.value === 'login' ? 'Não foi possível entrar' : mode.value === 'activate' ? 'Não foi possível ativar o cadastro' : 'Não foi possível criar a conta',
            detail: exception.message,
            focusTarget: mode.value === 'login' ? document.getElementById('account-password') : focusTarget
        });
    } finally {
        busy.value = false;
    }
}

async function saveProfile(event) {
    if (busy.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    busy.value = true;
    try {
        const { name, address, neighborhood, postalCode, uf, municipality, municipalityId } = profile.value;
        const data = await api('/customer/profile', { method: 'PATCH', body: { name, address, neighborhood, postalCode, uf, municipality, municipalityId } });
        profile.value = { ...data.customer };
        confirmSave(data.customer, 'Cadastro salvo com sucesso');
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível salvar o cadastro', detail: exception.message, focusTarget });
    } finally {
        busy.value = false;
    }
}

async function signOut() {
    if (busy.value) return;
    busy.value = true;
    try {
        await api('/customer/logout', { method: 'POST', body: {} });
        emit('customer', null);
        profile.value = {};
        orders.value = [];
        changeMode('login');
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível sair', detail: exception.message });
    } finally {
        busy.value = false;
    }
}
</script>

<template>
    <Dialog :visible="visible" modal header="Minha conta" class="storefront-dialog" :style="{ width: '490px' }" :breakpoints="{ '560px': '94vw' }" @update:visible="emit('update:visible', $event)" @show="formShown = true" @after-hide="onFormHidden">
        <template v-if="customer">
            <form class="store-form" v-feedback-form @submit.prevent="saveProfile">
                <div class="field"><label for="profile-name">Nome completo</label><InputText id="profile-name" v-model="profile.name" autocomplete="name" placeholder="Ex.: Ana Oliveira" maxlength="100" minlength="2" required fluid /></div>
                <div class="field"><label for="profile-phone">Telefone cadastrado</label><InputText id="profile-phone" :modelValue="formatPhone(customer.phone)" type="tel" readonly fluid /></div>
                <AddressFields v-if="visible" v-model="profile" prefix="profile" />
                <div class="store-form-actions">
                    <Button type="button" label="Sair da minha conta" text severity="secondary" :disabled="busy" @click="signOut" />
                    <Button type="submit" label="Salvar cadastro" :loading="busy" />
                </div>
            </form>
            <section v-if="orders.length" class="store-account-orders">
                <h3>Meus pedidos</h3>
                <ul>
                    <li v-for="order in orders" :key="order.id">
                        <span
                            ><strong>#{{ order.id }}</strong
                            ><small>{{ orderDate.format(new Date(order.createdAt)) }}</small></span
                        >
                        <Tag :value="order.status" :severity="statusSeverity(order.status)" />
                        <strong>{{ formatCurrency(order.total) }}</strong>
                    </li>
                </ul>
            </section>
        </template>
        <template v-else>
            <div class="store-account-modes" role="group" aria-label="Opções da conta">
                <button v-for="tab in modes" :key="tab.value" type="button" :aria-pressed="mode === tab.value" :disabled="busy" @click="changeMode(tab.value)">{{ tab.label }}</button>
            </div>
            <form class="store-form" v-feedback-form @submit.prevent="authenticate">
                <p v-if="mode === 'activate'" class="store-form-hint">Use o telefone cadastrado e o código de ativação fornecido pela pizzaria.</p>
                <div v-if="mode === 'register'" class="field">
                    <label for="account-name">Nome completo</label><InputText id="account-name" v-model="form.name" autocomplete="name" placeholder="Ex.: Ana Oliveira" minlength="2" maxlength="100" required fluid />
                </div>
                <div class="field"><label for="account-phone">Telefone com DDD</label><PhoneInput id="account-phone" v-model="form.phone" autocomplete="tel-national" required /></div>
                <div v-if="mode === 'activate'" class="field">
                    <label for="account-code">Código de ativação</label><InputText id="account-code" v-model="form.code" autocomplete="one-time-code" placeholder="Código recebido da pizzaria" maxlength="60" required fluid />
                </div>
                <div class="field">
                    <label for="account-password">{{ mode === 'login' ? 'Senha' : 'Crie uma senha' }}</label>
                    <InputText
                        id="account-password"
                        v-model="form.password"
                        type="password"
                        :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
                        :placeholder="mode === 'login' ? 'Digite sua senha' : 'Mínimo de 8 caracteres'"
                        :minlength="mode === 'login' ? 1 : 8"
                        maxlength="128"
                        required
                        fluid
                    />
                    <small v-if="mode !== 'login'">Use pelo menos 8 caracteres.</small>
                </div>
                <details v-if="mode === 'register' && visible">
                    <summary>Informar endereço (opcional)</summary>
                    <AddressFields v-model="form" prefix="account" />
                </details>
                <Button type="submit" :label="modes.find((tab) => tab.value === mode).label" :loading="busy" fluid />
            </form>
        </template>
    </Dialog>
</template>
