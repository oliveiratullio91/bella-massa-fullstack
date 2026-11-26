import { useConfirm } from 'primevue/useconfirm';
import { notify } from '@/service/feedback';
import { usePizzaria } from '@/stores/pizzaria';

export function useDeleteConfirmation() {
    const confirm = useConfirm();

    return ({ label, message, summary, remove, onDeleted }) =>
        confirm.require({
            header: `Excluir ${label}?`,
            message,
            icon: 'pi pi-exclamation-triangle',
            rejectLabel: 'Voltar',
            acceptLabel: 'Excluir',
            defaultFocus: 'reject',
            acceptProps: { severity: 'danger' },
            accept: async () => {
                try {
                    await remove();
                    onDeleted?.();
                    notify({ severity: 'success', summary });
                } catch (error) {
                    notify({ severity: 'error', summary: 'Não foi possível excluir', detail: error.message });
                }
            }
        });
}

export function useOrderDeletion() {
    const confirmDeletion = useDeleteConfirmation();
    const { deleteOrder } = usePizzaria();
    return (id, onDeleted) =>
        confirmDeletion({
            label: `pedido #${id}`,
            message: 'O pedido e seu histórico serão removidos permanentemente.',
            summary: `Pedido #${id} excluído`,
            remove: () => deleteOrder(id),
            onDeleted
        });
}
