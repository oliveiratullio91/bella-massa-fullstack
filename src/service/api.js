const apiOrigin = import.meta.env?.VITE_BELLA_MASSA_API_URL?.replace(/\/$/, '') ?? '';

export const swaggerUrl = apiOrigin + '/api/docs';

export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

export async function api(path, { method = 'GET', body } = {}) {
    let response;
    try {
        response = await fetch(apiOrigin + '/api' + path, {
            method,
            credentials: apiOrigin ? 'include' : 'same-origin',
            headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new ApiError(0, 'Não foi possível conectar ao servidor da pizzaria. Tente novamente.');
    }
    const data = await response.json().catch(() => null);
    if (!response.ok || !data) throw new ApiError(response.status, data?.error || 'Não foi possível carregar os dados da pizzaria.');
    return data;
}
