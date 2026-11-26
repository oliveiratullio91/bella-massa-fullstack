import { ApiError, requireValue } from './validation.mjs';

const ibge = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';

export function locationRoutes(fetchAddress = fetch) {
    async function lookup(url) {
        try {
            const response = await fetchAddress(url, { signal: AbortSignal.timeout(6000) });
            if (!response.ok) throw new Error();
            return await response.json();
        } catch {
            throw new ApiError(503, 'O serviço de endereços está indisponível. Tente novamente ou preencha o endereço manualmente.');
        }
    }

    return {
        'GET /api/addresses/cep/:cep': async ({ params }) => {
            requireValue(/^\d{8}$/.test(params.cep), 422, 'Informe um CEP de oito dígitos.');
            const result = await lookup(`https://viacep.com.br/ws/${params.cep}/json/`);
            requireValue(result && !result.erro, 404, 'CEP não encontrado.');
            return {
                postalCode: params.cep,
                address: result.logradouro ?? '',
                neighborhood: result.bairro ?? '',
                uf: result.uf ?? '',
                municipalityId: result.ibge ?? '',
                municipality: result.localidade ?? ''
            };
        },
        'GET /api/addresses/states': async () => {
            const rows = await lookup(ibge + '?orderBy=nome');
            requireValue(Array.isArray(rows), 503, 'O IBGE não retornou a lista de estados.');
            return rows.map(({ sigla, nome }) => ({ uf: sigla, name: nome }));
        },
        'GET /api/addresses/states/:uf/municipalities': async ({ params }) => {
            requireValue(/^(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)$/.test(params.uf), 422, 'Selecione um estado válido.');
            const rows = await lookup(`${ibge}/${params.uf}/municipios?orderBy=nome`);
            requireValue(Array.isArray(rows), 503, 'O IBGE não retornou a lista de municípios.');
            return rows.map(({ id, nome }) => ({ id: String(id), name: nome }));
        }
    };
}
