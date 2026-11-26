import { randomUUID } from 'node:crypto';
import { hashPassword, sameSecret, token, verifyPassword } from './security.mjs';
import { requireValue } from './validation.mjs';

const bootstrap = { id: 'principal', username: 'admin', name: 'Administrador principal', active: true, system: true };

function publicUser({ id, username, name, active }) {
    return { id, username, name, active: Boolean(active), system: false };
}

export function createAdminUsers(repository, adminPassword) {
    const { db } = repository;
    const byId = db.prepare('SELECT * FROM admin_users WHERE id = ?');
    const byUsername = db.prepare('SELECT * FROM admin_users WHERE username = ?');
    const revoke = db.prepare("DELETE FROM sessions WHERE role = 'admin' AND customer_id = ?");
    const dummyHash = hashPassword(token());

    function find(id) {
        if (id === bootstrap.id) return bootstrap;
        const user = byId.get(id);
        requireValue(user, 404, 'Usuário não encontrado.');
        return publicUser(user);
    }

    return {
        authenticate(username, password) {
            const login = username?.toLowerCase() ?? bootstrap.username;
            if (login === bootstrap.username) return sameSecret(password, adminPassword) ? bootstrap : null;
            const user = byUsername.get(login);
            const valid = verifyPassword(password, user?.password_hash ?? dummyHash);
            return user?.active && valid ? publicUser(user) : null;
        },
        active(id) {
            return id === bootstrap.id || Boolean(byId.get(id)?.active);
        },
        list() {
            return [bootstrap, ...db.prepare('SELECT * FROM admin_users ORDER BY name, username').all().map(publicUser)];
        },
        find,
        save(id, data, actorId) {
            requireValue(id !== bootstrap.id, 403, 'A conta principal é configurada no servidor.');
            const existing = id ? find(id) : null;
            const username = data.username.toLowerCase();
            const name = data.name.trim();
            const found = byUsername.get(username);
            requireValue(name.length >= 2, 422, 'Informe o nome do usuário.');
            requireValue(username !== bootstrap.username && (!found || found.id === id), 409, 'Este nome de acesso já está em uso.');
            requireValue(id !== actorId || data.active, 409, 'Você não pode desativar a própria conta.');
            const passwordHash = data.password ? hashPassword(data.password) : null;
            const userId = existing?.id ?? randomUUID();
            repository.transaction(() => {
                if (existing) {
                    db.prepare('UPDATE admin_users SET username = ?, name = ?, active = ?, password_hash = COALESCE(?, password_hash) WHERE id = ?').run(username, name, Number(data.active), passwordHash, userId);
                    if (!data.active || passwordHash) revoke.run(userId);
                } else {
                    db.prepare('INSERT INTO admin_users (id, username, name, active, password_hash) VALUES (?, ?, ?, ?, ?)').run(userId, username, name, Number(data.active), passwordHash);
                }
            });
            return find(userId);
        },
        remove(id, actorId) {
            requireValue(id !== bootstrap.id, 403, 'A conta principal é configurada no servidor.');
            requireValue(id !== actorId, 409, 'Você não pode excluir a própria conta.');
            find(id);
            repository.transaction(() => {
                revoke.run(id);
                db.prepare('DELETE FROM admin_users WHERE id = ?').run(id);
            });
            return { ok: true };
        }
    };
}
