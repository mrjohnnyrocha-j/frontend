// src/utils/blockchain.js

// src/utils/blockchain.js

import { ethers } from 'ethers';
import JTokenABI from '../contracts/abi_definitions/JTokenABI.json';

// Access environment variables
const CONTRACT_ADDRESS = process.env.REACT_APP_JTOKEN_CONTRACT_ADDRESS;
const RPC_ENDPOINT = process.env.REACT_APP_RPC_ENDPOINT;

/**
 * Initializes the Ethereum provider using Ethers.js.
 * @returns {ethers.providers.JsonRpcProvider} - The initialized provider.
 */
export const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT);

/**
 * Initializes and returns the JToken contract instance with the provided signer.
 * @param {ethers.Signer} signer - The signer instance from WalletContext.
 * @returns {ethers.Contract} - The JToken contract instance.
 */
export const getJTokenContract = (signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, JTokenABI, signer);
};
