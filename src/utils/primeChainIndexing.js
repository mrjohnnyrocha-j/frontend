import { isPrime } from './primeUtils';

/**
 * @title Prime Chain Indexing (PCI) Utility
 * @dev Provides functions to integrate Prime Chain Indexing into data operations.
 */

/**
 * Assigns a unique prime number to a new shard.
 * @param {number[]} existingPrimes - Array of already assigned prime numbers.
 * @returns {number} - The next available prime number.
 */
export const assignPrimeToShard = (existingPrimes) => {
  let candidate = existingPrimes.length > 0 ? existingPrimes[existingPrimes.length - 1] + 2 : 2;

  while (true) {
    if (isPrime(candidate)) {
      return candidate;
    }
    candidate += 2;
  }
};

/**
 * Generates a unique identifier for a data record based on assigned shard primes.
 * @param {number[]} shardPrimes - Array of prime numbers assigned to shards.
 * @param {number[]} shardIndices - Array of shard indices associated with the data record.
 * @returns {number} - The unique identifier (product of shard primes).
 */
export const generateRecordId = (shardPrimes, shardIndices) => {
  let recordId = 1;
  shardIndices.forEach((index) => {
    if (index < shardPrimes.length) {
      recordId *= shardPrimes[index];
    }
  });
  return recordId;
};
