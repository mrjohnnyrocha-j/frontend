// src/utils/primeUtils.js

import { BigInteger, SecureRandom } from 'jsbn';

/**
 * Generates a large prime number of specified bit length.
 * @param {number} bitLength - The desired bit length of the prime.
 * @returns {Promise<BigInteger>} - The generated prime.
 */
export const generateLargePrime = async (bitLength) => {
  return new Promise((resolve, reject) => {
    const rng = new SecureRandom();
    const e = 65537; // Common choice for e in RSA

    const qs = bitLength >> 1;
    const num = new BigInteger(bitLength, 1, rng);

    const prime = num.nextProbablePrime();
    resolve(prime);
  });
};

/**
 * Checks if a BigInteger is probably prime.
 * @param {BigInteger} n - The number to test.
 * @param {number} iterations - Number of iterations for the test.
 * @returns {Promise<boolean>} - True if probably prime.
 */
export const isProbablyPrime = async (n, iterations = 10) => {
  return n.isProbablePrime(iterations);
};
