<script setup>
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const message = ref([]);
const username = ref(null);
const email = ref(null);

function showSuccess() {
    toast.add({ severity: 'success', summary: 'Mensagem de sucesso', detail: 'Detalhes da mensagem', life: 3000 });
}

function showInfo() {
    toast.add({ severity: 'info', summary: 'Mensagem informativa', detail: 'Detalhes da mensagem', life: 3000 });
}

function showWarn() {
    toast.add({ severity: 'warn', summary: 'Mensagem de aviso', detail: 'Detalhes da mensagem', life: 3000 });
}

function showError() {
    toast.add({ severity: 'error', summary: 'Mensagem de erro', detail: 'Detalhes da mensagem', life: 3000 });
}
</script>

<template>
    <div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Notificações flutuantes</div>
                <div class="flex flex-wrap gap-2">
                    <Button @click="showSuccess()" label="Sucesso" severity="success" />
                    <Button @click="showInfo()" label="Informação" severity="info" />
                    <Button @click="showWarn()" label="Aviso" severity="warn" />
                    <Button @click="showError()" label="Erro" severity="danger" />
                </div>

                <div class="font-semibold text-xl mt-4 mb-4">Em linha</div>
                <div class="flex flex-wrap mb-4 gap-2">
                    <InputText v-model="username" placeholder="Nome de usuário" aria-label="Nome de usuário" invalid />
                    <Message severity="error">O nome de usuário é obrigatório</Message>
                </div>
                <div class="flex flex-wrap gap-2">
                    <InputText v-model="email" placeholder="E-mail" aria-label="E-mail" invalid />
                    <Message severity="error" icon="pi pi-times-circle" />
                </div>
            </div>
        </div>
        <div class="md:w-1/2">
            <div class="card">
                <div class="font-semibold text-xl mb-4">Mensagens</div>
                <div class="flex flex-col gap-4 mb-4">
                    <Message severity="success">Mensagem de sucesso</Message>
                    <Message severity="info">Mensagem informativa</Message>
                    <Message severity="warn">Mensagem de aviso</Message>
                    <Message severity="error">Mensagem de erro</Message>
                    <Message severity="secondary">Mensagem secundária</Message>
                    <Message severity="contrast">Mensagem de contraste</Message>
                </div>

                <transition-group name="p-message" tag="div">
                    <Message v-for="msg of message" :severity="msg.severity" :key="msg.content">{{ msg.content }}</Message>
                </transition-group>
            </div>
        </div>
    </div>
</template>
