import Ajv2020 from 'ajv/dist/2020.js';
import { createSchemas, requestNames } from './api-contract.mjs';

const schemaId = 'urn:bella-massa:api';
const schemas = createSchemas((name) => ({ $ref: `#/$defs/${name}` }));
const validator = new Ajv2020({ allErrors: true, strictTuples: false, validateFormats: false });
validator.addSchema({ $id: schemaId, $defs: schemas });

const requestValidators = Object.fromEntries(Object.entries(requestNames).map(([route, name]) => [route, validator.getSchema(`${schemaId}#/$defs/${name}`)]));
const argumentValidators = new Map(schemas.AdminAction.oneOf.map(({ properties }, index) => [properties.action.const, validator.getSchema(`${schemaId}#/$defs/AdminAction/oneOf/${index}/properties/args`)]));

const fieldNames = {
    action: 'operação',
    address: 'endereço',
    art: 'imagem do produto',
    category: 'categoria',
    closesAt: 'horário de fechamento',
    code: 'código de ativação',
    customerId: 'cliente',
    deliveryFee: 'taxa de entrega',
    description: 'descrição',
    estimatedTime: 'prazo estimado',
    expectedTotal: 'total do pedido',
    items: 'itens do pedido',
    name: 'nome',
    neighborhood: 'bairro',
    notes: 'observações',
    opensAt: 'horário de abertura',
    password: 'senha',
    payment: 'pagamento',
    phone: 'telefone com DDD',
    postalCode: 'CEP',
    price: 'preço',
    productId: 'produto',
    quantity: 'quantidade',
    requestId: 'identificação do pedido',
    size: 'tamanho',
    state: 'dados a importar',
    type: 'atendimento',
    uf: 'estado',
    municipalityId: 'município',
    username: 'nome de acesso'
};

export class ApiError extends Error {
    constructor(status, message, details) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export function requireValue(condition, status, message) {
    if (!condition) throw new ApiError(status, message);
}

function check(validate, input, prefix = '') {
    if (validate(input)) return;
    const issues = validate.errors.filter(({ keyword }) => !['anyOf', 'oneOf'].includes(keyword));
    const details = issues.slice(0, 8).map(({ instancePath, keyword, params }) => ({
        field: prefix + instancePath + (keyword === 'required' ? `/${params.missingProperty}` : '') || '/',
        rule: keyword
    }));
    const field = fieldNames[details[0]?.field.split('/').at(-1)];
    throw new ApiError(422, field ? `Confira o campo ${field}.` : 'Confira os campos enviados.', details);
}

export function validateRequest(route, data) {
    const validate = requestValidators[route];
    if (validate) check(validate, data);
}

export function validateAdminAction(action, args) {
    const validate = argumentValidators.get(action);
    requireValue(validate && Array.isArray(args), 400, 'Operação desconhecida.');
    check(validate, args, '/args');
}
