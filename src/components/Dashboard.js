import React, { useEffect, useState, useContext } from 'react';
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import JTokenABI from '../contracts/abi_definitions/JTokenABI.json';
import { AuthContext } from '../context/AuthContext';

/**
 * @title Dashboard
 * @dev React component that displays user wallet information, token balances, and provides actions.
 */

const Dashboard = () => {
  const { wallet, provider, connectWallet, disconnectWallet } = useWallet();
  const { authData, logout } = useContext(AuthContext);

  const [tokenBalance, setTokenBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const CONTRACT_ADDRESS = process.env.REACT_APP_JTOKEN_CONTRACT_ADDRESS;

  /**
   * Fetches the token balance from the smart contract.
   */
  const fetchTokenBalance = async () => {
    if (!wallet) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, JTokenABI, provider);
      const balance = await contract.balanceOf(await wallet.getAddress());
      setTokenBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setSnackbar({ open: true, message: 'Failed to fetch token balance.', severity: 'error' });
    }
    setLoading(false);
  };

  /**
   * Handles user logout.
   */
  const handleLogout = () => {
    logout();
    disconnectWallet();
    setSnackbar({ open: true, message: 'Logged out successfully.', severity: 'success' });
  };

  /**
   * Initializes dashboard data.
   */
  useEffect(() => {
    if (wallet) {
      fetchTokenBalance();
    }
  }, [wallet]);

  /**
   * Closes the snackbar notification.
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {authData.user && (
        <Typography variant="subtitle1" gutterBottom>
          Logged in as: {authData.user.username}
        </Typography>
      )}

      {!wallet ? (
        <Button variant="contained" color="primary" onClick={connectWallet}>
          Connect Wallet
        </Button>
      ) : (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Wallet Address:</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {wallet && (wallet.provider && wallet.provider.provider.selectedAddress
              ? wallet.provider.provider.selectedAddress
              : 'Address not available')}
          </Typography>

          <Typography variant="h6">JToken Balance:</Typography>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {tokenBalance} JTK
            </Typography>
          )}

          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
