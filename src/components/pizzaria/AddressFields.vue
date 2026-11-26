<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { notify } from '@/service/feedback';
import { api } from '@/service/api';

const props = defineProps({ prefix: { type: String, required: true }, modelValue: { type: Object, required: true } });
const emit = defineEmits(['update:modelValue']);
const states = ref([]);
const municipalities = ref([]);
const busy = ref(false);
const statesError = ref('');
const municipalitiesError = ref('');
const fields = ref(null);
let municipalityRequest = 0;

const postalCode = computed(() => (props.modelValue.postalCode ?? '').replace(/\D/g, '').slice(0, 8));
const formattedPostalCode = computed(() => postalCode.value.replace(/^(\d{5})(\d)/, '$1-$2'));
const foundMunicipality = computed(() => municipalities.value.some((item) => item.id === props.modelValue.municipalityId));

function update(fields) {
    emit('update:modelValue', { ...props.modelValue, ...fields });
}

function reportListIssue() {
    if (!fields.value?.getClientRects().length || (fields.value.closest('details') && !fields.value.closest('details').open)) return;
    notify({ severity: 'warn', summary: 'Lista do IBGE indisponível', detail: 'Você pode preencher o endereço manualmente ou tentar carregar a lista de novo.' });
}

async function loadStates() {
    statesError.value = '';
    try {
        states.value = await api('/addresses/states');
    } catch (error) {
        statesError.value = error.message;
        reportListIssue();
    }
}

async function loadMunicipalities(uf) {
    const request = ++municipalityRequest;
    municipalities.value = [];
    municipalitiesError.value = '';
    if (!uf) return;
    try {
        const result = await api(`/addresses/states/${encodeURIComponent(uf)}/municipalities`);
        if (request === municipalityRequest) municipalities.value = result;
    } catch (error) {
        if (request === municipalityRequest) {
            municipalitiesError.value = error.message;
            reportListIssue();
        }
    }
}

function changePostalCode(value) {
    update({ postalCode: value.replace(/\D/g, '').slice(0, 8) });
}

async function lookup() {
    if (busy.value) return;
    const requested = postalCode.value;
    if (requested.length !== 8) {
        notify({ severity: 'warn', summary: 'Confira o CEP', detail: 'Digite os oito dígitos do CEP.', focusTarget: document.getElementById(props.prefix + '-cep') });
        return;
    }
    busy.value = true;
    try {
        const result = await api(`/addresses/cep/${requested}`);
        if (!fields.value || postalCode.value !== requested) return;
        const existingStreet = props.modelValue.address ?? '';
        const streetMatches = result.address && existingStreet.toLocaleLowerCase('pt-BR').startsWith(result.address.toLocaleLowerCase('pt-BR'));
        update({ ...result, address: streetMatches ? existingStreet : result.address || existingStreet, neighborhood: result.neighborhood || props.modelValue.neighborhood || '' });
        notify({ severity: 'success', summary: 'CEP localizado', detail: 'Confira o logradouro e acrescente o número.', focusTarget: document.getElementById(props.prefix + '-street') });
    } catch (error) {
        if (fields.value && postalCode.value === requested) notify({ severity: 'error', summary: 'Não foi possível consultar o CEP', detail: error.message, focusTarget: document.getElementById(props.prefix + '-cep') });
    } finally {
        busy.value = false;
    }
}

function changeMunicipality(id) {
    update({ municipalityId: id ?? '', municipality: municipalities.value.find((item) => item.id === id)?.name ?? '' });
}

watch(() => props.modelValue.uf, loadMunicipalities, { immediate: true });
onMounted(loadStates);
</script>

<template>
    <fieldset ref="fields" class="address-fields full">
        <legend>Endereço</legend>
        <div class="form-grid">
            <div class="field full">
                <label :for="prefix + '-cep'">CEP</label>
                <div class="cep-lookup">
                    <InputText :id="prefix + '-cep'" :modelValue="formattedPostalCode" inputmode="numeric" autocomplete="postal-code" placeholder="Ex.: 60060-100" maxlength="9" fluid @update:modelValue="changePostalCode" />
                    <Button type="button" label="Buscar CEP" icon="pi pi-search" severity="secondary" outlined :loading="busy" @click="lookup" />
                </div>
            </div>
            <div class="field full">
                <label :for="prefix + '-street'">Logradouro, número e complemento</label>
                <InputText :id="prefix + '-street'" :modelValue="modelValue.address ?? ''" autocomplete="street-address" placeholder="Ex.: Rua das Flores, 125, ap. 302" maxlength="200" fluid @update:modelValue="update({ address: $event })" />
            </div>
            <div class="field full">
                <label :for="prefix + '-neighborhood'">Bairro</label>
                <InputText :id="prefix + '-neighborhood'" :modelValue="modelValue.neighborhood ?? ''" placeholder="Ex.: Centro" maxlength="80" fluid @update:modelValue="update({ neighborhood: $event })" />
            </div>
            <div class="field">
                <label :id="prefix + '-uf-label'" :for="prefix + '-uf'">Estado</label>
                <Select
                    v-if="states.length"
                    :inputId="prefix + '-uf'"
                    :aria-labelledby="prefix + '-uf-label'"
                    :options="states"
                    optionLabel="name"
                    optionValue="uf"
                    :modelValue="modelValue.uf || null"
                    placeholder="Selecione o estado"
                    filter
                    showClear
                    fluid
                    @update:modelValue="update({ uf: $event ?? '', municipalityId: '', municipality: '' })"
                />
                <InputText
                    v-else
                    :id="prefix + '-uf'"
                    :modelValue="modelValue.uf ?? ''"
                    autocomplete="address-level1"
                    placeholder="Ex.: CE"
                    maxlength="2"
                    fluid
                    @update:modelValue="update({ uf: $event.toUpperCase().replace(/[^A-Z]/g, ''), municipalityId: '', municipality: '' })"
                />
            </div>
            <div class="field">
                <label :id="prefix + '-city-label'" :for="prefix + '-city'">Município</label>
                <Select
                    v-if="municipalities.length && (!modelValue.municipality || foundMunicipality)"
                    :inputId="prefix + '-city'"
                    :aria-labelledby="prefix + '-city-label'"
                    :options="municipalities"
                    optionLabel="name"
                    optionValue="id"
                    :modelValue="modelValue.municipalityId || null"
                    placeholder="Selecione o município"
                    filter
                    showClear
                    fluid
                    @update:modelValue="changeMunicipality"
                />
                <InputText
                    v-else
                    :id="prefix + '-city'"
                    :modelValue="modelValue.municipality ?? ''"
                    autocomplete="address-level2"
                    placeholder="Ex.: Fortaleza"
                    maxlength="100"
                    fluid
                    @update:modelValue="update({ municipality: $event, municipalityId: '' })"
                />
                <Button v-if="municipalities.length && modelValue.municipality && !foundMunicipality" type="button" label="Selecionar no IBGE" text @click="update({ municipality: '', municipalityId: '' })" />
            </div>
            <p v-if="statesError || municipalitiesError" class="full muted" role="status">
                Lista do IBGE indisponível. Você pode preencher os campos.
                <Button type="button" label="Tentar novamente" text @click="statesError ? loadStates() : loadMunicipalities(modelValue.uf)" />
            </p>
        </div>
    </fieldset>
</template>

<style scoped>
.address-fields {
    min-width: 0;
    padding: 0;
    border: 0;
}
.address-fields legend {
    margin-bottom: 0.55rem;
    font-weight: 650;
}
.cep-lookup {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
}
.cep-lookup :deep(input) {
    flex: 1 1 8rem;
    width: auto;
}
</style>
