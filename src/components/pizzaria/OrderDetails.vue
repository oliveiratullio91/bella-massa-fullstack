<script setup>
import { computed, ref } from 'vue';
import { usePizzaria } from '@/stores/pizzaria';
import { formatCurrency, formatPhone } from '@/utils/locale';
import { DRIVERS, canDeleteOrder, canEditOrder, formatTime, isActiveOrder, nextOrderStatus, orderItemSize, statusSeverity } from '@/utils/pizzaria';
import { notify } from '@/service/feedback';
import { useConfirm } from 'primevue/useconfirm';
import OrderEditor from './OrderEditor.vue';
import { useOrderDeletion } from './useDeleteConfirmation';
const props = defineProps({ orderId: Number, visible: Boolean });
const emit = defineEmits(['update:visible']);
const { state, changeStatus, assignDriver } = usePizzaria();
const order = computed(() => state.orders.find((entry) => entry.id === props.orderId));

const confirm = useConfirm();
const confirmDelete = useOrderDeletion();
const editorOpen = ref(false);
const editingId = ref(null);
const working = ref(false);
function edit() {
    editingId.value = order.value.id;
    emit('update:visible', false);
    editorOpen.value = true;
}
async function advance() {
    if (working.value) return;
    working.value = true;
    try {
        const updated = await changeStatus(order.value.id);
        notify({ severity: 'success', summary: 'Pedido atualizado', detail: `Pedido #${updated.id}: ${updated.status.toLowerCase()}.` });
    } catch (error) {
        notify({ severity: 'warn', summary: 'Confira o pedido', detail: error.message });
    } finally {
        working.value = false;
    }
}
async function setDriver(value) {
    try {
        await assignDriver(order.value.id, value);
    } catch (error) {
        notify({ severity: 'error', summary: 'Não foi possível alterar', detail: error.message });
    }
}
function cancel() {
    const id = order.value.id;
    confirm.require({
        header: 'Cancelar pedido?',
        message: `O pedido #${id} será encerrado como cancelado.`,
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Manter pedido',
        acceptLabel: 'Cancelar pedido',
        defaultFocus: 'reject',
        acceptProps: { severity: 'danger' },
        accept: async () => {
            try {
                await changeStatus(id, true);
                notify({ severity: 'info', summary: 'Pedido cancelado', detail: 'O histórico foi preservado.' });
            } catch (error) {
                notify({ severity: 'error', summary: 'Não foi possível cancelar', detail: error.message });
            }
        }
    });
}
</script>
<template>
    <Dialog :visible="visible" modal :header="order ? 'Pedido #' + order.id : 'Detalhes do pedido'" :style="{ width: '660px' }" :breakpoints="{ '760px': '94vw' }" @update:visible="emit('update:visible', $event)">
        <template v-if="order">
            <div class="detail-title">
                <div>
                    <h3>{{ order.customerName }}</h3>
                    <span class="muted">{{ new Date(order.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Fortaleza' }) }} às {{ formatTime(order.createdAt) }} · {{ order.type }}</span>
                </div>
                <Tag :value="order.status" :severity="statusSeverity(order.status)" />
            </div>
            <div class="detail-info">
                <p v-if="order.phone"><i class="pi pi-phone" aria-hidden="true"></i>{{ formatPhone(order.phone) }}</p>
                <p v-if="order.type === 'Entrega'"><i class="pi pi-map-marker" aria-hidden="true"></i>{{ order.address }}</p>
                <p><i class="pi pi-wallet" aria-hidden="true"></i>{{ order.payment }}</p>
            </div>
            <div class="section-divider"><h3>Resumo do pedido</h3></div>
            <div v-for="(item, index) in order.items" :key="index" class="detail-line">
                <span
                    ><strong>{{ item.quantity }}× {{ item.name }}</strong
                    ><small>{{ orderItemSize(item) }} · {{ formatCurrency(item.unitPrice) }} cada</small></span
                ><strong>{{ formatCurrency(item.quantity * item.unitPrice) }}</strong>
            </div>
            <div class="order-totals">
                <div>
                    <span>Subtotal</span><strong>{{ formatCurrency(order.subtotal) }}</strong>
                </div>
                <div>
                    <span>Taxa de entrega</span><strong>{{ formatCurrency(order.deliveryFee) }}</strong>
                </div>
                <div class="grand-total">
                    <span>Total</span><strong>{{ formatCurrency(order.total) }}</strong>
                </div>
            </div>
            <Message v-if="order.notes" severity="secondary" class="mt-4"><strong>Observações:</strong> {{ order.notes }}</Message>
            <div v-if="order.type === 'Entrega' && isActiveOrder(order)" class="field mt-5">
                <label for="order-driver">Entregador responsável</label
                ><Select inputId="order-driver" aria-label="Entregador responsável" :modelValue="order.driver || null" :options="DRIVERS" placeholder="Selecione um entregador" fluid @update:modelValue="setDriver" />
            </div>
            <p v-else-if="order.driver" class="muted mt-4">Entregador: {{ order.driver }}</p>
            <div class="section-divider"><h3>Histórico</h3></div>
            <ol class="order-history">
                <li v-for="(event, index) in order.history" :key="index">
                    <span class="history-dot"></span><strong>{{ event.action === 'edited' ? 'Pedido editado' : event.status }}</strong
                    ><span>{{ formatTime(event.at) }}</span>
                </li>
            </ol>
            <div class="dialog-actions">
                <Button v-if="canDeleteOrder(order)" label="Excluir pedido" icon="pi pi-trash" severity="danger" text @click="confirmDelete(order.id, () => emit('update:visible', false))" />
                <Button v-if="isActiveOrder(order)" label="Cancelar pedido" severity="danger" text @click="cancel" />
                <Button v-else label="Fechar" severity="secondary" text @click="emit('update:visible', false)" />
                <Button v-if="canEditOrder(order)" label="Editar pedido" icon="pi pi-pencil" severity="secondary" outlined @click="edit" />
                <Button v-if="isActiveOrder(order)" :label="'Avançar para: ' + nextOrderStatus(order)" icon="pi pi-arrow-right" iconPos="right" :loading="working" @click="advance" />
            </div>
        </template>
    </Dialog>
    <OrderEditor v-model:visible="editorOpen" :orderId="editingId" @saved="emit('update:visible', true)" />
</template>
