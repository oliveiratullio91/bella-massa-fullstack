<script setup>
import { onMounted, ref } from 'vue';
import { lastFormField, notify } from '@/service/feedback';
import PageHeader from '@/components/pizzaria/PageHeader.vue';
import { useDeleteConfirmation } from '@/components/pizzaria/useDeleteConfirmation';
import { useAdmin } from '@/stores/admin';

const { listUsers, readUser, saveUser, deleteUser } = useAdmin();
const confirmDeletion = useDeleteConfirmation();

const users = ref([]);
const draft = ref({});
const open = ref(false);
const loading = ref(true);
const saving = ref(false);
const listError = ref('');

async function refresh() {
    listError.value = '';
    loading.value = true;
    try {
        users.value = (await listUsers()).users;
    } catch (error) {
        listError.value = error.message;
        notify({ severity: 'error', summary: 'Não foi possível carregar os usuários', detail: error.message });
    } finally {
        loading.value = false;
    }
}

async function edit(id) {
    try {
        const user = id ? await readUser(id) : { name: '', username: '', active: true };
        draft.value = { ...user, password: '' };
        open.value = true;
    } catch (error) {
        listError.value = error.message;
        notify({ severity: 'error', summary: 'Não foi possível carregar o usuário', detail: error.message });
    }
}

async function save(event) {
    if (saving.value) return;
    const focusTarget = lastFormField(event.currentTarget);
    saving.value = true;
    try {
        const { id, name, username, active, password } = draft.value;
        await saveUser(id, { name: name.trim(), username: username.trim(), active, ...(password ? { password } : {}) });
        draft.value = {};
        open.value = false;
        await refresh();
        notify({ severity: 'success', summary: 'Usuário salvo' });
    } catch (error) {
        notify({ severity: 'error', summary: 'Não foi possível salvar o usuário', detail: error.message, focusTarget });
    } finally {
        saving.value = false;
    }
}

function remove(user) {
    confirmDeletion({
        label: user.name,
        message: 'O usuário perderá o acesso ao painel.',
        summary: 'Usuário excluído',
        remove: async () => {
            await deleteUser(user.id);
            await refresh();
        }
    });
}

onMounted(refresh);
</script>

<template>
    <div>
        <PageHeader title="Usuários" eyebrow=""><Button label="Cadastrar usuário" icon="pi pi-user-plus" @click="edit()" /></PageHeader>
        <Message v-if="listError" class="mb-4" severity="error" role="alert">{{ listError }} <Button label="Tentar novamente" text @click="refresh" /></Message>
        <p v-if="loading" role="status">Carregando usuários…</p>
        <div v-else-if="users.length" class="surface-panel">
            <ul class="admin-list" role="list" aria-label="Usuários do painel">
                <li v-for="user in users" :key="user.id" class="admin-list-row users-list-row">
                    <div>
                        <strong>{{ user.name }}</strong
                        ><small class="muted block">{{ user.username }}</small>
                    </div>
                    <div><Tag :severity="user.active ? 'success' : 'secondary'" :value="user.active ? 'Ativo' : 'Inativo'" /></div>
                    <div v-if="!user.system" class="admin-list-actions">
                        <Button icon="pi pi-pencil" :aria-label="`Editar usuário ${user.name}`" text severity="secondary" @click="edit(user.id)" />
                        <Button icon="pi pi-trash" :aria-label="`Excluir usuário ${user.name}`" text severity="danger" @click="remove(user)" />
                    </div>
                </li>
            </ul>
        </div>
        <Dialog v-model:visible="open" modal :header="draft.id ? 'Editar usuário' : 'Cadastrar usuário'" :style="{ width: '480px' }" :breakpoints="{ '540px': '94vw' }" @hide="draft = {}">
            <form v-feedback-form @submit.prevent="save">
                <div class="form-grid">
                    <div class="field full"><label for="user-name">Nome</label><InputText id="user-name" v-model="draft.name" placeholder="Ex.: Ana Oliveira" minlength="2" maxlength="100" required fluid /></div>
                    <div class="field full">
                        <label for="user-username">Nome de acesso</label
                        ><InputText
                            id="user-username"
                            v-model="draft.username"
                            placeholder="Ex.: ana.oliveira"
                            autocomplete="off"
                            autocapitalize="off"
                            pattern="[a-zA-Z0-9][a-zA-Z0-9._\-]+"
                            title="Comece com uma letra ou um número. Depois, use letras, números, ponto, hífen ou sublinhado."
                            minlength="3"
                            maxlength="40"
                            required
                            fluid
                        />
                    </div>
                    <div class="field full">
                        <label for="user-password">{{ draft.id ? 'Nova senha' : 'Senha' }}</label
                        ><InputText
                            id="user-password"
                            v-model="draft.password"
                            type="password"
                            autocomplete="new-password"
                            :placeholder="draft.id ? 'Em branco para manter a senha' : 'Mínimo de 12 caracteres'"
                            minlength="12"
                            maxlength="128"
                            :required="!draft.id"
                            fluid
                        />
                    </div>
                    <div class="switch-field"><ToggleSwitch v-model="draft.active" inputId="user-active" /><label for="user-active">Acesso ativo</label></div>
                </div>
                <div class="dialog-actions"><Button type="button" label="Cancelar" severity="secondary" text @click="open = false" /><Button type="submit" label="Salvar usuário" :loading="saving" /></div>
            </form>
        </Dialog>
    </div>
</template>

<style scoped>
.users-list-row {
    grid-template-columns: minmax(0, 1fr) auto auto;
}
.users-list-row strong {
    overflow-wrap: anywhere;
}
.users-list-row .admin-list-actions {
    justify-content: flex-end;
}
</style>
