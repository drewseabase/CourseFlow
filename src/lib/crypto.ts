import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = 'aes-256-gcm';
const KEY_HEX = process.env.CANVAS_ENCRYPTION_KEY!;

if(!KEY_HEX) {
    throw new Error('CANVAS_ENCRYPTION_KEY is not set in environment variables');
}

const KEY = Buffer.from(KEY_HEX, 'hex');

if(KEY.length !== 32){
    throw new Error('CANVAS_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
}

export interface EncryptedToken{
    encryptedData: string;
    iv: string;
}

export function encrypt(plaintext: string): EncryptedToken{

    const iv = randomBytes(16);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();
    const encryptedWithTag = Buffer.concat([encrypted, authTag]);

    return {
        encryptedData: encryptedWithTag.toString('hex'),
        iv: iv.toString('hex'),
    };
}

export function decrypt(encryptedData: string, iv: string): string{
    const encryptedBuffer = Buffer.from(encryptedData, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');

    const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);
    const ciphertext = encryptedBuffer.subarray(0, encryptedBuffer.length - 16);

    const decipher = createDecipheriv(ALGORITHM, KEY, ivBuffer);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
    ]);

    return decrypted.toString('utf8');
}