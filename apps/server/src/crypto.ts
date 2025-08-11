import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'utf8'); // 32 bytes

export function encryptSecret(secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    encrypted: Buffer.concat([enc, tag]).toString('base64'),
    iv: iv.toString('base64')
  };
}

export function decryptSecret(encrypted: string, ivB64: string) {
  const buf = Buffer.from(encrypted, 'base64');
  const iv = Buffer.from(ivB64, 'base64');
  const data = buf.subarray(0, buf.length - 16);
  const tag = buf.subarray(buf.length - 16);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}