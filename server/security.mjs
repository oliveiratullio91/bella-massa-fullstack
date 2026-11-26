import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export const token = (bytes = 32) => randomBytes(bytes).toString('base64url');
export const fingerprint = (value) => createHash('sha256').update(value).digest('hex');
export const sameSecret = (left, right) => timingSafeEqual(Buffer.from(fingerprint(left), 'hex'), Buffer.from(fingerprint(right), 'hex'));

export function hashPassword(password) {
    const salt = token(16);
    return salt + ':' + scryptSync(password, salt, 64).toString('hex');
}

export function verifyPassword(password, encoded) {
    const [salt, key] = encoded.split(':');
    return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(key, 'hex'));
}

export function loadAdminPassword(filename) {
    const configured = process.env.BELLA_MASSA_ADMIN_PASSWORD;
    if (configured) {
        if (configured.length < 12 || configured.length > 128) throw new Error('BELLA_MASSA_ADMIN_PASSWORD precisa ter de 12 a 128 caracteres.');
        return configured;
    }
    mkdirSync(dirname(filename), { recursive: true });
    try {
        writeFileSync(filename, token(18) + '\n', { flag: 'wx', mode: 0o600 });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
    const password = readFileSync(filename, 'utf8').trim();
    if (password.length < 12) throw new Error('A senha local de acesso ao painel precisa ter pelo menos 12 caracteres.');
    return password;
}

export function loadJwtKey(databasePath) {
    const configured = process.env.BELLA_MASSA_JWT_SECRET;
    if (configured) {
        if (Buffer.byteLength(configured) < 32) throw new Error('BELLA_MASSA_JWT_SECRET precisa ter pelo menos 32 bytes.');
        return Buffer.from(configured);
    }
    if (databasePath === ':memory:') return randomBytes(32);
    const filename = databasePath + '.jwt-key';
    mkdirSync(dirname(filename), { recursive: true });
    try {
        writeFileSync(filename, randomBytes(32), { flag: 'wx', mode: 0o600 });
    } catch (error) {
        if (error.code !== 'EEXIST') throw error;
    }
    const key = readFileSync(filename);
    if (key.length !== 32) throw new Error('A chave JWT local está inválida.');
    return key;
}
