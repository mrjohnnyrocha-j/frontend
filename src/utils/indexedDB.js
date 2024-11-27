/**
 * @title IndexedDB Utility
 * @dev Provides functions to interact with IndexedDB for storing and retrieving encrypted private keys.
 */

const DB_NAME = 'PrimeChainDB';
const DB_VERSION = 1;
const STORE_NAME = 'privateKeys';

/**
 * Opens a connection to the IndexedDB database.
 * @returns {Promise<IDBDatabase>} - Promise resolving to the database instance.
 */
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // keyPath is userId, assuming unique per user
        db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject('IndexedDB error: ' + event.target.errorCode);
    };
  });
};

/**
 * Stores the encrypted private key in IndexedDB.
 * @param {string} userId - The unique identifier for the user.
 * @param {string} encryptedKey - The encrypted private key.
 * @param {string} salt - The salt used for encryption.
 * @returns {Promise<void>}
 */
const storePrivateKey = async (userId, encryptedKey, salt) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const data = { userId, encryptedKey, salt };
      const request = store.put(data);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        reject('Error storing private key: ' + event.target.errorCode);
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Retrieves the encrypted private key from IndexedDB.
 * @param {string} userId - The unique identifier for the user.
 * @returns {Promise<{ encryptedKey: string, salt: string } | null>} - The encrypted key and salt, or null if not found.
 */
const getPrivateKey = async (userId) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(userId);

      request.onsuccess = (event) => {
        const result = event.target.result;
        if (result) {
          resolve({ encryptedKey: result.encryptedKey, salt: result.salt });
        } else {
          resolve(null);
        }
      };

      request.onerror = (event) => {
        reject('Error retrieving private key: ' + event.target.errorCode);
      };
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = { storePrivateKey, getPrivateKey };
