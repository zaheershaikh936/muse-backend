export const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-gcm',
  ivLength: 12,
  authTagLength: 16,
  key: process.env.ENCRYPTION_KEY,
};
