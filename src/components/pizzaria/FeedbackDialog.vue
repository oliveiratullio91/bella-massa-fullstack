<script setup>
import { computed, ref, watch } from 'vue';
import { feedbackQueue } from '@/service/feedback';

const dialog = ref(null);
const current = computed(() => feedbackQueue[0]);
const icons = { success: 'pi-check', error: 'pi-times', warn: 'pi-exclamation-triangle', info: 'pi-info-circle' };

watch(
    [dialog, current],
    ([element, message]) => {
        if (element && message && !element.open) element.showModal();
    },
    { flush: 'post' }
);

function acknowledge() {
    const { focusTarget, onConfirm } = current.value;
    dialog.value.close();
    feedbackQueue.shift();
    if (focusTarget?.isConnected) {
        const details = focusTarget.closest('details');
        if (details) details.open = true;
        focusTarget.focus();
    }
    onConfirm?.();
}
</script>

<template>
    <dialog ref="dialog" class="feedback-dialog" aria-labelledby="feedback-title" :aria-describedby="current?.detail ? 'feedback-detail' : undefined" @cancel.prevent @keydown.esc.stop.prevent @keyup.esc.stop>
        <div v-if="current" class="feedback-content" :data-severity="current.severity">
            <span class="feedback-icon" aria-hidden="true"><i class="pi" :class="icons[current.severity]"></i></span>
            <h2 id="feedback-title">{{ current.summary }}</h2>
            <p v-if="current.detail" id="feedback-detail">{{ current.detail }}</p>
            <Button type="button" label="Entendi" autofocus @click="acknowledge" />
        </div>
    </dialog>
</template>

<style scoped>
.feedback-dialog {
    position: fixed;
    inset: 0;
    width: min(400px, calc(100% - 36px));
    max-height: calc(100dvh - 32px);
    margin: auto;
    padding: 0;
    overflow: auto;
    border: 1px solid #e4d9ca;
    border-radius: 20px;
    background: #fffaf1;
    color: #21291b;
    box-shadow: 0 16px 60px rgb(39 29 18 / 18%);
}
.feedback-dialog::backdrop {
    background: rgb(30 24 19 / 47%);
}
.feedback-content {
    display: grid;
    justify-items: center;
    gap: 18px;
    padding: clamp(24px, 5vw, 36px);
    text-align: center;
    overflow-wrap: anywhere;
}
.feedback-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #e9ecd9;
    color: #46532e;
}
.feedback-icon i {
    font-size: 22px;
}
[data-severity='error'] .feedback-icon {
    background: #f9e3dc;
    color: #9c362a;
}
[data-severity='warn'] .feedback-icon {
    background: #f9eacb;
    color: #815314;
}
[data-severity='info'] .feedback-icon {
    background: #deecf3;
    color: #315e77;
}
.feedback-content h2 {
    margin: 0;
    font:
        700 clamp(22px, 5vw, 27px) / 1.15 Georgia,
        'Times New Roman',
        serif;
}
.feedback-content p {
    margin: -8px 0 0;
    color: #514b42;
    line-height: 1.5;
}
.feedback-content .p-button {
    min-width: 132px;
}
</style>
