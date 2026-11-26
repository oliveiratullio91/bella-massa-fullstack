import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { createDemoData } from '../src/data/pizzaria.js';

export const runtimeDirectory = resolve(process.env.BELLA_MASSA_DATA_DIR || 'data');

export function openDatabase(filename, now) {
    if (filename !== ':memory:') mkdirSync(dirname(resolve(filename)), { recursive: true });
    const db = new DatabaseSync(filename);
    db.exec(`
        PRAGMA journal_mode = WAL;
        PRAGMA busy_timeout = 5000;
        CREATE TABLE IF NOT EXISTS pizzaria_state (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            document TEXT NOT NULL,
            revision INTEGER NOT NULL DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS customer_accounts (
            customer_id TEXT PRIMARY KEY,
            password_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS admin_users (
            id TEXT PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            active INTEGER NOT NULL CHECK (active IN (0, 1))
        );
        CREATE TABLE IF NOT EXISTS sessions (
            token_hash TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            customer_id TEXT,
            expires_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS activations (
            customer_id TEXT PRIMARY KEY,
            code_hash TEXT NOT NULL,
            expires_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS order_requests (
            customer_id TEXT NOT NULL,
            request_id TEXT NOT NULL,
            response TEXT NOT NULL,
            PRIMARY KEY (customer_id, request_id)
        );
    `);
    db.prepare('INSERT OR IGNORE INTO pizzaria_state (id, document) VALUES (1, ?)').run(JSON.stringify(createDemoData(now())));
    const selectState = db.prepare('SELECT document, revision FROM pizzaria_state WHERE id = 1');
    const updateState = db.prepare('UPDATE pizzaria_state SET document = ?, revision = revision + 1 WHERE id = 1');
    const checkState = db.prepare('SELECT 1 FROM pizzaria_state WHERE id = 1');

    return {
        db,
        isReady() {
            return Boolean(checkState.get());
        },
        read() {
            const row = selectState.get();
            return { state: JSON.parse(row.document), revision: row.revision };
        },
        write(state) {
            updateState.run(JSON.stringify(state));
        },
        transaction(work) {
            db.exec('BEGIN IMMEDIATE');
            try {
                const result = work();
                db.exec('COMMIT');
                return result;
            } catch (error) {
                db.exec('ROLLBACK');
                throw error;
            }
        }
    };
}
