// frontend/src/components/BuyJToken.js

import React, { useState, useContext } from 'react';
import Web3 from 'web3';
import { ContractContext } from '../context/ContractContext';
import { QNNValidator } from '../utils/QNNValidator';
import axios from '../utils/axiosConfig';
import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Box,
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const BuyJToken = () => {
  const { JToken } = useContext(ContractContext);
  const { authData } = useContext(AuthContext);

  const [ethAmount, setEthAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleBuyTokens = async () => {
    if (!ethAmount) {
      setSnackbarMessage('Please enter the amount of ETH to spend.');
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
      const transactionData = JToken.methods.buyTokens().encodeABI();

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
      await JToken.methods.buyTokens().send({
        from: userAddress,
        value: Web3.utils.toWei(ethAmount, 'ether'),
      });

      setSnackbarMessage('Tokens purchased successfully!');
      setSnackbarOpen(true);
      setEthAmount('');
    } catch (error) {
      console.error('Error purchasing tokens:', error);
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
        Buy JTokens
      </Typography>
      <form>
        <TextField
          label="Amount of ETH to Spend"
          type="number"
          fullWidth
          required
          value={ethAmount}
          onChange={(e) => setEthAmount(e.target.value)}
          inputProps={{ min: '0', step: '0.01' }}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleBuyTokens}
          disabled={loading}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Buy JTokens'}
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

export default BuyJToken;
