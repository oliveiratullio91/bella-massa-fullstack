import { fingerprint, token } from './security.mjs';

export function googleReceiptSender(url = process.env.BELLA_MASSA_MAIL_URL) {
    if (!url) return null;
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(url)) throw new Error('Confira a URL de implantação do Google Apps Script.');
    return async (ticket) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket }),
            signal: AbortSignal.timeout(25000)
        });
        return response.ok && (await response.json()).sent === true;
    };
}

export function createReceiptClaims(db, now) {
    const issue = db.prepare('INSERT INTO receipt_claims (digest, email, order_id, total, expires_at) VALUES (?, ?, ?, ?, ?)');
    const redeem = db.prepare('DELETE FROM receipt_claims WHERE digest = ? AND expires_at > ? RETURNING email, order_id AS id, total');
    const discard = db.prepare('DELETE FROM receipt_claims WHERE digest = ?');
    const expire = db.prepare('DELETE FROM receipt_claims WHERE expires_at <= ?');
    return {
        issue(email, order) {
            const timestamp = now().getTime();
            expire.run(timestamp);
            const ticket = token();
            issue.run(fingerprint(ticket), email, order.id, order.total, timestamp + 60000);
            return ticket;
        },
        redeem(ticket) {
            return redeem.get(fingerprint(ticket), now().getTime());
        },
        discard(ticket) {
            discard.run(fingerprint(ticket));
        }
    };
}
