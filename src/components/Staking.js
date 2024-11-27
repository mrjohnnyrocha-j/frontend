// src/components/Staking.js

import React, { useState, useEffect, useMemo } from 'react';
import Web3 from 'web3';
import StakingABI from '../contracts/abi_definitions/StakingABI.json';
import JTokenABI from '../contracts/abi_definitions/JTokenABI.json';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
  useTheme,
} from '@mui/material';
import axios from 'axios';

const Staking = () => {
  const [amount, setAmount] = useState('');
  const [stakedTokens, setStakedTokens] = useState(0);
  const [rewards, setRewards] = useState(0);
  const [account, setAccount] = useState('');
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Initialize Web3 instance
  const web3 = useMemo(() => new Web3(Web3.givenProvider), []);

  // Initialize contract instances
  const stakingContract = useMemo(
    () =>
      new web3.eth.Contract(
        StakingABI,
        process.env.REACT_APP_STAKING_CONTRACT_ADDRESS
      ),
    [web3]
  );
  const jTokenContract = useMemo(
    () =>
      new web3.eth.Contract(
        JTokenABI,
        process.env.REACT_APP_JTOKEN_CONTRACT_ADDRESS
      ),
    [web3]
  );

  const theme = useTheme();

  // Load user's account and fetch balances
  useEffect(() => {
    const loadAccount = async () => {
      try {
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);
        fetchTokenBalance(accounts[0]);
        fetchStakedTokens(accounts[0]);
        fetchRewards(accounts[0]);
      } catch (error) {
        console.error('Error loading account:', error);
        setSnackbarMessage('Error connecting to wallet. Please try again.');
        setSnackbarOpen(true);
      }
    };
    loadAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  // Fetch user's token balance
  const fetchTokenBalance = async (userAccount) => {
    try {
      const balance = await jTokenContract.methods
        .balanceOf(userAccount)
        .call();
      setTokenBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  // Fetch staked tokens
  const fetchStakedTokens = async (userAccount) => {
    try {
      const staked = await stakingContract.methods
        .stakedBalance(userAccount)
        .call();
      setStakedTokens(web3.utils.fromWei(staked, 'ether'));
    } catch (error) {
      console.error('Error fetching staked tokens:', error);
    }
  };

  // Fetch rewards
  const fetchRewards = async (userAccount) => {
    try {
      const reward = await stakingContract.methods
        .calculateReward(userAccount)
        .call();
      setRewards(web3.utils.fromWei(reward, 'ether'));
    } catch (error) {
      console.error('Error fetching rewards:', error);
    }
  };

  // Stake tokens
  const stakeTokens = async () => {
    try {
      if (!amount || parseFloat(amount) <= 0) {
        setSnackbarMessage('Please enter a valid amount.');
        setSnackbarOpen(true);
        return;
      }

      setLoading(true);
      const amountInWei = web3.utils.toWei(amount, 'ether');

      // Approve tokens for staking contract
      await jTokenContract.methods
        .approve(process.env.REACT_APP_STAKING_CONTRACT_ADDRESS, amountInWei)
        .send({ from: account });

      // Stake tokens
      await stakingContract.methods
        .stake(amountInWei)
        .send({ from: account });

      setSnackbarMessage('Tokens staked successfully.');
      setSnackbarOpen(true);

      // Update balances
      fetchTokenBalance(account);
      fetchStakedTokens(account);
      fetchRewards(account);
      setAmount('');
    } catch (error) {
      console.error('Error staking tokens:', error);
      setSnackbarMessage('Error staking tokens. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Withdraw staked tokens
  const withdrawTokens = async () => {
    try {
      setLoading(true);
      await stakingContract.methods.withdraw().send({ from: account });

      setSnackbarMessage('Tokens withdrawn successfully.');
      setSnackbarOpen(true);

      // Update balances
      fetchTokenBalance(account);
      fetchStakedTokens(account);
      fetchRewards(account);
    } catch (error) {
      console.error('Error withdrawing tokens:', error);
      setSnackbarMessage('Error withdrawing tokens. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Claim rewards
  const claimRewards = async () => {
    try {
      setLoading(true);
      await stakingContract.methods.claimReward().send({ from: account });

      setSnackbarMessage('Rewards claimed successfully.');
      setSnackbarOpen(true);

      // Update balances
      fetchTokenBalance(account);
      fetchRewards(account);
    } catch (error) {
      console.error('Error claiming rewards:', error);
      setSnackbarMessage('Error claiming rewards. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Close snackbar notification
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stake Your JTokens
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        Connected Account: <strong>{account}</strong>
      </Typography>
      <Typography variant="body1">
        Token Balance: <strong>{tokenBalance} JTK</strong>
      </Typography>
      <Typography variant="body1">
        Staked Tokens: <strong>{stakedTokens} JTK</strong>
      </Typography>
      <Typography variant="body1">
        Rewards: <strong>{rewards} JTK</strong>
      </Typography>

      <Box sx={{ mt: 3, maxWidth: 400 }}>
        <TextField
          label="Amount to Stake (JTK)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          inputProps={{ min: '0', step: '0.01' }}
          variant="outlined"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={stakeTokens}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Stake Tokens'}
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={withdrawTokens}
          disabled={loading}
          sx={{ mr: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Withdraw Tokens'}
        </Button>
        <Button
          variant="text"
          onClick={claimRewards}
          disabled={loading}
          sx={{ mt: { xs: 2, sm: 0 } }}
        >
          Claim Rewards
        </Button>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Staking;
