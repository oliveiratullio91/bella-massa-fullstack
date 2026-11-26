<script setup>
import { ref } from 'vue';
import { swaggerUrl } from '@/service/api';
import { STORAGE_KEY, usePizzaria, validSavedState } from '@/stores/pizzaria';
import { lastFormField, notify } from '@/service/feedback';
import { useConfirm } from 'primevue/useconfirm';
import PageHeader from '@/components/pizzaria/PageHeader.vue';
import PhoneInput from '@/components/pizzaria/PhoneInput.vue';
const { state, saveSettings, resetDemo, canImport, importLegacy, logout } = usePizzaria();
const draft = ref({ ...state.settings });
const saving = ref(false);
const movingData = ref(false);

const confirm = useConfirm();
let legacyState = null;
try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (validSavedState(parsed)) legacyState = parsed;
} catch {
    /* A importação só aparece em navegadores com uma cópia local válida. */
}
async function save(event) {
    if (saving.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    saving.value = true;
    try {
        await saveSettings(draft.value);
        notify({ severity: 'success', summary: 'Tudo no ponto!', detail: 'As configurações da pizzaria foram atualizadas.' });
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível salvar as configurações', detail: exception.message, focusTarget });
    } finally {
        saving.value = false;
    }
}
async function copyLocalData() {
    if (movingData.value) return;
    movingData.value = true;
    try {
        await importLegacy(legacyState);
        draft.value = { ...state.settings };
        notify({ severity: 'success', summary: 'Dados copiados para o servidor' });
    } catch (exception) {
        notify({ severity: 'error', summary: 'Importação indisponível', detail: exception.message });
    } finally {
        movingData.value = false;
    }
}
async function signOut() {
    try {
        await logout();
    } catch (exception) {
        notify({ severity: 'error', summary: 'Não foi possível sair', detail: exception.message });
    }
}
function reset() {
    confirm.require({
        header: 'Restaurar dados de exemplo?',
        message: 'Os dados do painel serão substituídos pelos exemplos iniciais enquanto o site ainda não tiver cadastros e pedidos.',
        icon: 'pi pi-refresh',
        rejectLabel: 'Manter meus dados',
        acceptLabel: 'Restaurar exemplos',
        acceptProps: { severity: 'danger' },
        accept: async () => {
            try {
                await resetDemo();
                draft.value = { ...state.settings };
                notify({ severity: 'success', summary: 'Exemplos restaurados' });
            } catch (exception) {
                notify({ severity: 'warn', summary: 'Restauração indisponível', detail: exception.message });
            }
        }
    });
}
</script>
<template>
    <div>
        <PageHeader title="Do seu jeito" description="A identidade da casa e os detalhes que fazem a operação funcionar." />
        <form v-feedback-form class="settings-grid" @submit.prevent="save">
            <div>
                <section class="surface-panel settings-section">
                    <div class="panel-heading">
                        <div>
                            <h2>Sobre a pizzaria</h2>
                            <p>Os dados que dão identidade ao seu negócio.</p>
                        </div>
                        <i class="pi pi-shop muted" aria-hidden="true"></i>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="settings-name">Nome da pizzaria <span>*</span></label
                            ><InputText id="settings-name" v-model="draft.name" placeholder="Ex.: Bella Massa" maxlength="50" fluid />
                        </div>
                        <div class="field">
                            <label for="settings-subtitle">Descrição curta <span>*</span></label
                            ><InputText id="settings-subtitle" v-model="draft.subtitle" placeholder="Ex.: Pizzaria artesanal" maxlength="60" fluid />
                        </div>
                        <div class="field">
                            <label for="settings-phone">Telefone com DDD <span>*</span></label
                            ><PhoneInput id="settings-phone" v-model="draft.phone" />
                        </div>
                        <div class="field">
                            <label for="settings-address">Endereço da pizzaria <span>*</span></label
                            ><InputText id="settings-address" v-model="draft.address" placeholder="Ex.: Rua das Flores, 125, Centro" maxlength="200" fluid />
                        </div>
                    </div>
                </section>
                <section class="surface-panel settings-section">
                    <div class="panel-heading">
                        <div>
                            <h2>Atendimento e entrega</h2>
                            <p>Deixe as expectativas claras, do pedido à entrega.</p>
                        </div>
                        <i class="pi pi-truck muted" aria-hidden="true"></i>
                    </div>
                    <div class="form-grid">
                        <div class="field">
                            <label for="settings-fee">Taxa de entrega</label><InputNumber inputId="settings-fee" v-model="draft.deliveryFee" placeholder="R$ 6,00" mode="currency" currency="BRL" locale="pt-BR" :min="0" :max="1000" fluid /><small
                                >Aplicada apenas a novos pedidos com entrega.</small
                            >
                        </div>
                        <div class="field">
                            <label for="settings-estimate">Prazo estimado (minutos)</label><InputNumber inputId="settings-estimate" v-model="draft.estimatedTime" placeholder="45" locale="pt-BR" :min="5" :max="180" :useGrouping="false" fluid />
                        </div>
                        <div class="field">
                            <label for="settings-opens">Horário de abertura</label><InputText id="settings-opens" v-model="draft.opensAt" type="time" aria-describedby="settings-opens-example" fluid /><small id="settings-opens-example"
                                >Ex.: 18:00</small
                            >
                        </div>
                        <div class="field">
                            <label for="settings-closes">Horário de fechamento</label><InputText id="settings-closes" v-model="draft.closesAt" type="time" aria-describedby="settings-closes-example" fluid /><small id="settings-closes-example"
                                >Ex.: 23:30</small
                            >
                        </div>
                    </div>
                    <div class="settings-open">
                        <div>
                            <strong>Receber novos pedidos</strong>
                            <p>A abertura e o fechamento são controlados manualmente.</p>
                        </div>
                        <div class="switch-field">
                            <ToggleSwitch inputId="settings-open" v-model="draft.isOpen" /><label for="settings-open">{{ draft.isOpen ? 'Pizzaria aberta' : 'Pizzaria fechada' }}</label>
                        </div>
                    </div>
                </section>
                <div class="settings-save"><span class="muted">As alterações valem após salvar.</span><Button type="submit" label="Salvar configurações" icon="pi pi-check" :loading="saving" /></div>
            </div>
            <aside>
                <section class="surface-panel about-project">
                    <span class="about-icon"><i class="pi pi-graduation-cap" aria-hidden="true"></i></span><span class="eyebrow">DA FACULDADE PARA A PRÁTICA</span>
                    <h2>Uma pizzaria.<br />Muitas possibilidades.</h2>
                    <p>Um projeto acadêmico de gestão de pizzaria, adaptado do template Sakai da família PrimeFaces, com Vue e PrimeVue.</p>
                    <ul>
                        <li><i class="pi pi-check" aria-hidden="true"></i>Interface em português</li>
                        <li><i class="pi pi-check" aria-hidden="true"></i>Dados de demonstração</li>
                        <li><i class="pi pi-check" aria-hidden="true"></i>Loja e painel com dados compartilhados</li>
                    </ul>
                    <div class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                        <RouterLink :to="{ name: 'storefront' }" class="text-link">Abrir loja</RouterLink>
                        <a :href="swaggerUrl" class="text-link" target="_blank" rel="noopener">Swagger da API</a>
                        <Button type="button" label="Sair do painel" icon="pi pi-sign-out" text @click="signOut" />
                    </div>
                </section>
                <section v-if="legacyState && canImport" class="surface-panel reset-panel">
                    <h3>Dados da versão anterior</h3>
                    <p>Copie os pedidos, produtos, clientes e configurações deste navegador para o banco compartilhado.</p>
                    <Button type="button" label="Importar dados deste navegador" :loading="movingData" outlined @click="copyLocalData" />
                </section>
                <section class="surface-panel reset-panel">
                    <h3>Recomeçar a demonstração</h3>
                    <p>Disponível antes dos primeiros cadastros ou pedidos pelo site.</p>
                    <Button label="Restaurar dados de exemplo" icon="pi pi-refresh" severity="secondary" outlined @click="reset" />
                </section>
            </aside>
        </form>
    </div>
</template>
