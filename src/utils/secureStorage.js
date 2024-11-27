// src/utils/secureStorage.js

import CryptoJS from 'crypto-js';
import { openDB } from 'idb';

/**
 * Derives a symmetric key from a password using PBKDF2 with SHA-256.
 * @param {string} password - The user's password.
 * @param {string} salt - A unique salt value.
 * @returns {CryptoJS.lib.WordArray} - The derived 256-bit symmetric key.
 */
export const deriveSymmetricKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: 256 / 32, // 256-bit key
    iterations: 100000, // Increased iterations for enhanced security
    hasher: CryptoJS.algo.SHA256,
  });
};

/**
 * Encrypts data using AES.
 * @param {string} plaintext - The plaintext data to encrypt.
 * @param {string} password - The user's password.
 * @param {string} salt - A unique salt value.
 * @returns {string} - The encrypted data as a Base64 string.
 */
export const encryptData = (plaintext, password, salt) => {
  const key = deriveSymmetricKey(password, salt);
  const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
  return ciphertext;
};

/**
 * Decrypts data using AES.
 * @param {string} ciphertext - The encrypted data as a Base64 string.
 * @param {string} password - The user's password.
 * @param {string} salt - The unique salt value used during encryption.
 * @returns {string} - The decrypted plaintext data.
 */
export const decryptData = (ciphertext, password, salt) => {
  const key = deriveSymmetricKey(password, salt);
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
};

/**
 * Stores encrypted data securely in IndexedDB under the 'secureData' object store.
 * @param {string} userId - The user's unique identifier.
 * @param {string} encryptedData - The encrypted data.
 * @param {string} salt - The unique salt used for encryption.
 * @returns {Promise<void>}
 */
export const storePrivateKey = async (userId, encryptedData, salt) => {
  const db = await initDB('secureData');
  await db.put('secureData', { id: userId, encryptedKey: encryptedData, salt });
};

/**
 * Retrieves secure data from IndexedDB.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Object>} - The encrypted key and salt.
 */
export const getPrivateKey = async (userId) => {
  const db = await initDB('secureData');
  const record = await db.get('secureData', userId);
  if (!record) {
    throw new Error('No secure data found for this user.');
  }
  return { encryptedKey: record.encryptedKey, salt: record.salt };
};

/**
 * Initializes and returns the IndexedDB instance with the specified object store.
 * @param {string} storeName - The name of the object store to create/access.
 * @returns {Promise<IDBPDatabase>}
 */
const initDB = async (storeName = 'secureData') => {
  return await openDB('PrimeChainSecureDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    },
  });
};
