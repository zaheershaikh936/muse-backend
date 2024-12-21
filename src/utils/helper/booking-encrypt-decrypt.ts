import * as CryptoJS from 'crypto-js';
import { Logger } from '@nestjs/common';

// Helper function to make Base64 URL-safe
function toBase64UrlSafe(base64) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper function to decode Base64 URL-safe back to standard Base64
function fromBase64UrlSafe(base64UrlSafe) {
    return base64UrlSafe.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - base64UrlSafe.length % 4) % 4);
}

const encryptBookingData = async (id: string, startTime: string, endTime: string) => {
    try {
        const data = `${id},${startTime},${endTime}`;
        const ciphertext = CryptoJS.AES.encrypt(data, process.env.BOOKING_SECRET_KEY).toString();
        return toBase64UrlSafe(ciphertext); // Convert to URL-safe Base64
    } catch (error) {
        Logger.error(error);
        return error;
    }
};

const decryptBookingData = (encrypted: string): string[] => {
    try {
        const standardBase64 = fromBase64UrlSafe(encrypted);
        const bytes = CryptoJS.AES.decrypt(standardBase64, process.env.BOOKING_SECRET_KEY);
        const originalData = bytes.toString(CryptoJS.enc.Utf8);
        return originalData.split(',');
    } catch (error) {
        console.error(error);
        return error;
    }
};

export { encryptBookingData, decryptBookingData };
