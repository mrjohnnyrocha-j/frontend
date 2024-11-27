// src/utils/primeChainCrypto.js

import { generateLargePrime } from './primeUtils'; // We'll create this utility
import { BigInteger } from 'jsbn'; // Use jsbn library for big integer arithmetic

/**
 * @module PrimeChainCrypto
 * @description Implements Prime Chain Based Cryptography with large primes.
 */

/**
 * Generates a Prime Chain with securely generated large primes.
 * @param {number} chainLength - Number of primes in the chain.
 * @param {number} bitLength - Bit length of each prime (e.g., 2048).
 * @returns {Promise<BigInteger[]>} - The generated prime chain.
 */
export const generatePrimeChain = async (chainLength, bitLength) => {
  const primeChain = [];
  let currentPrime = await generateLargePrime(bitLength);
  primeChain.push(currentPrime);

  for (let i = 1; i < chainLength; i++) {
    // Generate the next prime by adding a random even number
    let nextPrimeFound = false;
    while (!nextPrimeFound) {
      const randomIncrement = BigInteger.probablePrime(64, Math.random).abs();
      currentPrime = currentPrime.add(randomIncrement);
      if (await isProbablyPrime(currentPrime)) {
        primeChain.push(currentPrime);
        nextPrimeFound = true;
      }
    }
  }

  return primeChain;
};

/**
 * Generates the public and private keys based on the prime chain.
 * @param {BigInteger[]} primeChain - The generated prime chain.
 * @returns {{ publicKey: BigInteger, privateKey: BigInteger[] }}
 */
export const generateKeysFromPrimeChain = (primeChain) => {
  const privatePrimes = [];
  const publicPrimes = [];

  // Randomly select half of the primes for the private key
  primeChain.forEach((prime, index) => {
    if (Math.random() < 0.5) {
      privatePrimes.push(prime);
    } else {
      publicPrimes.push(prime);
    }
  });

  // Compute the public key as the product of public primes
  let publicKey = new BigInteger('1');
  publicPrimes.forEach((prime) => {
    publicKey = publicKey.multiply(prime);
  });

  return { publicKey, privateKey: privatePrimes };
};

/**
 * Encrypts a message using the recipient's public key.
 * @param {BigInteger} message - The message represented as a BigInteger.
 * @param {BigInteger} publicKey - The recipient's public key.
 * @param {BigInteger} prime - A prime from the sender's prime chain.
 * @returns {BigInteger} - The encrypted message.
 */
export const encryptMessage = (message, publicKey, prime) => {
  // Ciphertext C = (message * publicKey) mod prime
  return message.multiply(publicKey).mod(prime);
};

/**
 * Decrypts a ciphertext using the private key primes.
 * @param {BigInteger} ciphertext - The encrypted message.
 * @param {BigInteger} publicKey - The recipient's public key.
 * @param {BigInteger} prime - A prime from the private key primes.
 * @returns {BigInteger} - The decrypted message.
 */
export const decryptMessage = (ciphertext, publicKey, prime) => {
  // Compute the modular inverse of publicKey mod prime
  const publicKeyInverse = publicKey.modInverse(prime);
  // Message m = (ciphertext * publicKeyInverse) mod prime
  return ciphertext.multiply(publicKeyInverse).mod(prime);
};

/**
 * Converts a string message to a BigInteger.
 * @param {string} message - The plaintext message.
 * @returns {BigInteger} - The message as a BigInteger.
 */
export const messageToBigInteger = (message) => {
  return new BigInteger(Buffer.from(message, 'utf-8').toString('hex'), 16);
};

/**
 * Converts a BigInteger back to a string message.
 * @param {BigInteger} bigIntMessage - The message as a BigInteger.
 * @returns {string} - The plaintext message.
 */
export const bigIntegerToMessage = (bigIntMessage) => {
  const hex = bigIntMessage.toString(16);
  return Buffer.from(hex, 'hex').toString('utf-8');
};
