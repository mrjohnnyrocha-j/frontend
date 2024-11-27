// src/context/WalletContext.js

import React, { createContext, useContext, useState } from 'react';
import { Wallet, providers, utils } from 'ethers';
import CryptoJS from 'crypto-js';
import { getJTokenContract } from '../utils/blockchain';
import { isProbablyPrime } from '../utils/primeUtils';

/**
 * @title WalletContext
 * @dev Provides wallet state and functions to manage blockchain interactions.
 */
const WalletContext = createContext();

/**
 * @title useWallet
 * @dev Custom hook to access WalletContext.
 */
export const useWallet = () => useContext(WalletContext);

/**
 * @title WalletProvider
 * @dev Wraps the application and provides wallet context.
 */

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [password, setPassword] = useState('');

  const STORAGE_KEY = 'encryptedPrivateKey';

  const createWallet = async (password) => {
    try {
      const newWallet = Wallet.createRandom();
      const privateKey = newWallet.privateKey;

      const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, password).toString();
      localStorage.setItem(STORAGE_KEY, encryptedPrivateKey);

      const provider = new providers.JsonRpcProvider(process.env.REACT_APP_RPC_ENDPOINT || 'http://localhost:8545');

      const signer = new Wallet(privateKey, provider);
      setWallet(signer);
      const address = await signer.getAddress();
      setWalletAddress(address);

      const contract = getJTokenContract(signer);
      const balance = await contract.balanceOf(address);
      setTokenBalance(utils.formatEther(balance));

      setSnackbarMessage('Wallet created and connected successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Wallet creation error:', error);
      setSnackbarMessage('Failed to create wallet.');
      setSnackbarOpen(true);
    }
  };

/**
 * Loads the wallet by decrypting the private key.
 * @param {string} passwordInput - The password to decrypt the private key.
 * @returns {Promise<void>}
 */
const loadWallet = async (passwordInput) => {
  try {
    const encryptedPrivateKey = localStorage.getItem(STORAGE_KEY);
    if (!encryptedPrivateKey) {
      throw new Error('No wallet found. Please create a new wallet.');
    }

    // Decrypt the private key using the password
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, passwordInput);
    const decryptedPrivateKey = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedPrivateKey) {
      throw new Error('Failed to decrypt private key. Incorrect password.');
    }

    // Initialize provider
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_ENDPOINT || 'http://localhost:8545');

    // Initialize signer with the decrypted private key
    const signer = new ethers.Wallet(decryptedPrivateKey, provider);
    setWallet(signer);
    const address = await signer.getAddress();
    setWalletAddress(address);

    // Interact with JToken contract to get balance
    const contract = getJTokenContract(signer);
    const balance = await contract.balanceOf(address);
    setTokenBalance(ethers.utils.formatEther(balance));

    setSnackbarMessage('Wallet loaded and connected successfully!');
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Wallet loading error:', error);
    setSnackbarMessage(error.message);
    setSnackbarOpen(true);
  }
  setLoading(false);
};

/**
 * Handles token purchase.
 * @param {number} amount - The number of tokens to purchase.
 */
const buyTokens = async (amount) => {
  if (!wallet || !walletAddress) {
    setSnackbarMessage('Please connect your wallet first.');
    setSnackbarOpen(true);
    return;
  }

  // Ensure the amount is a prime number before proceeding
  if (!isProbablyPrime(amount)) {
    setSnackbarMessage('Purchase amount must be a prime number.');
    setSnackbarOpen(true);
    return;
  }

  setLoading(true);
  try {
    const contract = getJTokenContract(wallet);
    const tokenPrice = ethers.utils.parseEther('0.01'); // Assuming 0.01 ETH per JTK
    const cost = tokenPrice.mul(amount);

    const tx = await contract.buyTokens(walletAddress, { value: cost });
    setSnackbarMessage('Transaction submitted. Awaiting confirmation...');
    setSnackbarOpen(true);

    await tx.wait();

    const balance = await contract.balanceOf(walletAddress);
    setTokenBalance(ethers.utils.formatEther(balance));

    setSnackbarMessage(`Successfully purchased ${amount} JTK!`);
    setSnackbarOpen(true);
  } catch (error) {
    console.error('Error purchasing tokens:', error);

    if (error.code === 'CALL_EXCEPTION') {
      setSnackbarMessage('Transaction failed: Contract call reverted.');
    } else {
      setSnackbarMessage('Failed to purchase tokens.');
    }

    setSnackbarOpen(true);
  }
  setLoading(false);
};

/**
 * Closes the snackbar notification.
 */
const handleSnackbarClose = () => {
  setSnackbarOpen(false);
};

const value = {
  wallet,
  walletAddress,
  tokenBalance,
  loading,
  createWallet,
  loadWallet,
  buyTokens,
  snackbarMessage,
  snackbarOpen,
  handleSnackbarClose,
  setPassword,
};

return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export default WalletContext;
