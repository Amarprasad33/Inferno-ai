import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const KEY_B64 = process.env.API_KEY_ENCRYPTION_KEY!;
if (!KEY_B64) {
	throw new Error('Missing env API_KEY_ENCRYPTION_KEY (base64, 32 bytes)');
}
const key = Buffer.from(KEY_B64, 'base64');
if (key.length !== 32) {
	throw new Error('API_KEY_ENCRYPTION_KEY must decode to 32 bytes');
}

export function encryptSecret(plain: string) {
	const iv = randomBytes(12);
	const cipher = createCipheriv('aes-256-gcm', key, iv);
	const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
	const tag = cipher.getAuthTag();
	// Store ciphertext||tag in one field; iv separately
	return {
		encrypted: Buffer.concat([enc, tag]).toString('base64'),
		iv: iv.toString('base64')
	};
}

export function decryptSecret(encryptedB64: string, ivB64: string) {
	const buf = Buffer.from(encryptedB64, 'base64');
	const iv = Buffer.from(ivB64, 'base64');
	const enc = buf.subarray(0, buf.length - 16);
	const tag = buf.subarray(buf.length - 16);
	const decipher = createDecipheriv('aes-256-gcm', key, iv);
	decipher.setAuthTag(tag);
	const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
	return dec.toString('utf8');
}