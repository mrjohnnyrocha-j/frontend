// src/components/Wallet.js

import React, { useState } from 'react';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  TextField,
  Paper,
  useTheme,
} from '@mui/material';
import { useWallet } from '../context/WalletContext';

const Wallet = () => {
  const {
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
  } = useWallet();

  const [passwordInput, setPasswordInput] = useState('');

  const theme = useTheme();

  /**
   * Handles wallet creation.
   */
  const handleCreateWallet = async () => {
    await createWallet(passwordInput);
  };

  /**
   * Handles wallet loading.
   */
  const handleLoadWallet = async () => {
    await loadWallet(passwordInput);
  };

  /**
   * Handles token purchase.
   */
  const handleBuyTokensClick = async () => {
    const amountInput = prompt(
      'Enter the number of tokens you wish to purchase (Prime number only):'
    );
    if (!amountInput || isNaN(amountInput) || amountInput <= 0) {
      alert('Please enter a valid number of tokens.');
      return;
    }

    const amount = parseInt(amountInput, 10);
    await buyTokens(amount);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, margin: '0 auto' }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h5" gutterBottom>
          Wallet Management
        </Typography>

        {!walletAddress ? (
          <>
            <TextField
              label="Password"
              type="password"
              fullWidth
              value={passwordInput}
              onChange={(e) => {
                setPasswordInput(e.target.value);
                setPassword(e.target.value);
              }}
              sx={{ mb: 3 }}
              required
              variant="outlined"
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateWallet}
                disabled={loading}
                sx={{ width: '48%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Create New Wallet'}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleLoadWallet}
                disabled={loading}
                sx={{ width: '48%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Load Existing Wallet'}
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Wallet Address:</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {walletAddress}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                <strong>Token Balance:</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                {tokenBalance} JTK
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleBuyTokensClick}
              disabled={loading}
              sx={{ mt: 3 }}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Buy Tokens'}
            </Button>
          </>
        )}

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          action={
            <Button color="inherit" size="small" onClick={handleSnackbarClose}>
              Close
            </Button>
          }
        />
      </Paper>
    </Box>
  );
};

export default Wallet;
