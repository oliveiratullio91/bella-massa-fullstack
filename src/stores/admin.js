import { reactive, readonly, ref } from 'vue';
import { api } from '../service/api.js';

const state = reactive({ settings: {}, products: [], customers: [], orders: [], nextOrderId: 0 });
const phase = ref('checking');
const storageError = ref('');
const canImport = ref(false);
let revision = -1;
let generation = 0;
let pendingRefresh = false;

function accept(snapshot) {
    if (snapshot.revision < revision) return;
    if (snapshot.revision > revision) {
        Object.assign(state, snapshot.state);
        revision = snapshot.revision;
    }
    canImport.value = snapshot.canImport;
    phase.value = 'connected';
    storageError.value = '';
}

function signedOut() {
    generation++;
    revision = -1;
    Object.assign(state, { settings: {}, products: [], customers: [], orders: [], nextOrderId: 0 });
    phase.value = 'signed-out';
    canImport.value = false;
    storageError.value = '';
}

async function refresh() {
    if (pendingRefresh) return;
    pendingRefresh = true;
    const attempt = generation;
    try {
        const snapshot = await api('/admin/state');
        if (attempt === generation) accept(snapshot);
    } catch (error) {
        if (attempt !== generation) return;
        if (error.status === 401) signedOut();
        else {
            storageError.value = error.message;
            if (phase.value === 'checking') phase.value = 'unavailable';
        }
    } finally {
        pendingRefresh = false;
    }
}

async function login(username, password) {
    generation++;
    const snapshot = await api('/admin/login', { method: 'POST', body: { username, password } });
    accept(snapshot);
}

async function logout() {
    await api('/admin/logout', { method: 'POST', body: {} });
    signedOut();
}

async function adminRequest(path, body, method = 'POST') {
    const attempt = generation;
    try {
        const snapshot = await api(path, { method, body });
        if (attempt === generation && snapshot.state) accept(snapshot);
        return snapshot;
    } catch (error) {
        if (attempt === generation && error.status === 401) signedOut();
        throw error;
    }
}

const methods = ['changeStatus', 'assignDriver', 'saveSettings', 'resetDemo'];
const resourceUrl = (resource, id) => `/admin/${resource}${id == null ? '' : '/' + encodeURIComponent(id)}`;
async function saveResource(resource, id, draft) {
    return (await adminRequest(resourceUrl(resource, id), draft, id == null ? 'POST' : 'PATCH')).result;
}
const deleteResource = (resource, id) => adminRequest(resourceUrl(resource, id), undefined, 'DELETE');

const admin = {
    state: readonly(state),
    phase: readonly(phase),
    storageError: readonly(storageError),
    canImport: readonly(canImport),
    refresh,
    login,
    logout,
    saveProduct: (draft) => saveResource('products', draft.id, draft),
    deleteProduct: (id) => deleteResource('products', id),
    saveCustomer: (draft) => saveResource('customers', draft.id, draft),
    deleteCustomer: (id) => deleteResource('customers', id),
    createOrder: (draft) => saveResource('orders', null, draft),
    updateOrder: (id, draft) => saveResource('orders', id, draft),
    deleteOrder: (id) => deleteResource('orders', id),
    listUsers: () => adminRequest('/admin/users', undefined, 'GET'),
    readUser: (id) => adminRequest(resourceUrl('users', id), undefined, 'GET'),
    saveUser: (id, draft) => adminRequest(resourceUrl('users', id), draft, id == null ? 'POST' : 'PATCH'),
    deleteUser: (id) => deleteResource('users', id),
    activation: (customerId) => adminRequest('/admin/activation', { customerId }),
    importLegacy: (data) => adminRequest('/admin/import', { state: data }),
    ...Object.fromEntries(methods.map((action) => [action, async (...args) => (await adminRequest('/admin/action', { action, args })).result]))
};

export const useAdmin = () => admin;
