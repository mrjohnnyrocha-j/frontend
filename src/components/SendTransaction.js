// frontend/src/components/SendTransaction.js

import React, { useState, useContext } from 'react';
import Web3 from 'web3';
import { ContractContext } from '../context/ContractContext';
import { QNNValidator } from '../utils/QNNValidator';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Box,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const SendTransaction = () => {
  const { JToken } = useContext(ContractContext);
  const { authData } = useContext(AuthContext);

  const [recipient, setRecipient] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSend = async () => {
    if (!recipient || !tokenAmount) {
      setSnackbarMessage('Please fill in all fields.');
      setSnackbarOpen(true);
      return;
    }

    if (!Web3.utils.isAddress(recipient)) {
      setSnackbarMessage('Invalid Ethereum address.');
      setSnackbarOpen(true);
      return;
    }

    if (!JToken) {
      setSnackbarMessage('JToken contract not initialized.');
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);

      // Get user's Ethereum address
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAddress = accounts[0];

      // Encrypt transaction data using Prime Chain-based methods
      const transactionData = JToken.methods.transfer(recipient, Web3.utils.toWei(tokenAmount, 'ether')).encodeABI();

      // Validate transaction using QNNValidator
      const validator = new QNNValidator(256, 3);
      const hash = await validator.hashData(transactionData);
      const prime = validator.generatePrimeFromHash(hash);
      const isValid = validator.isPrime(prime);

      if (!isValid) {
        setSnackbarMessage('Transaction detected as fraudulent. Aborting.');
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      // Send transaction
      await JToken.methods.transfer(recipient, Web3.utils.toWei(tokenAmount, 'ether')).send({
        from: userAddress,
      });

      setSnackbarMessage('Transaction successful!');
      setSnackbarOpen(true);
      setRecipient('');
      setTokenAmount('');
    } catch (error) {
      console.error('Error sending transaction:', error);
      setSnackbarMessage('Transaction failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Send JTokens
      </Typography>
      <form>
        <TextField
          label="Recipient Address"
          type="text"
          fullWidth
          required
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Amount of JTokens"
          type="number"
          fullWidth
          required
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
          inputProps={{ min: '0', step: '0.01' }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Send Tokens'}
        </Button>
      </form>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default SendTransaction;
