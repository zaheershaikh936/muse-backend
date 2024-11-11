import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

const algorithm = 'aes-256-cbc';
const key = crypto.scryptSync(process.env.BOOKING_SECRET_KEY, 'salt', 32); // Ensures key is 32 bytes
const iv = crypto.randomBytes(16); // 16 bytes for aes-256-cbc

const encryptBookingData = (id: string, startTime: string, endTime: string) => {
    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted =
            cipher.update(`${id}__${startTime}__${endTime}`, 'utf8', 'hex') +
            cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`; // Store IV with the encrypted data
    } catch (error) {
        Logger.error(error);
        return error;
    }
};

const decryptBookingData = (encrypted: string) => {
    try {
        const [ivHex, encryptedData] = encrypted.split(':');
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
        return (
            decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8')
        );
    } catch (error) {
        console.error(error);
        return error;
    }
};

export { encryptBookingData, decryptBookingData };
