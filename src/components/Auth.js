// src/components/Auth.js

import React, { useState, useContext } from 'react';
import { TextField, Button, Typography, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { AuthContext } from '../context/AuthContext';
import {
  generatePrimeChain,
  generateKeysFromPrimeChain,
} from '../utils/primeChainCrypto';
import { storePrivateKey, getPrivateKey, encryptData, decryptData } from '../utils/secureStorage';

/**
 * Auth Component for handling user login and signup.
 */
const Auth = () => {
  const navigate = useNavigate();
  const { setAuthData } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /**
   * Handles form submission for login or signup.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Handle Login
        const response = await axios.post('/api/auth/login', {
          email,
          password,
        });

        const { token, user, publicKey } = response.data;

        // Retrieve encrypted private key from secure storage
        const storedData = await getPrivateKey(user.id);

        if (!storedData) {
          setError('Private key not found. Please sign up again.');
          setLoading(false);
          return;
        }

        const { encryptedKey, salt } = storedData;

        // Decrypt the private key using the password
        const decryptedPrivateKeyString = decryptData(encryptedKey, password, salt);

        if (!decryptedPrivateKeyString) {
          setError('Failed to decrypt private key. Incorrect password.');
          setLoading(false);
          return;
        }

        const privateKey = JSON.parse(decryptedPrivateKeyString);

        // Update Auth Context
        setAuthData({
          token,
          user,
          publicKey,
          privateKey,
        });

        // Redirect to dashboard or protected route
        navigate('/dashboard');
      } else {
        // Handle Signup
        // Generate Prime Chain-based key pair
        const chainLength = 10; // Adjust as needed
        const bitLength = 2048; // Use 2048-bit primes
        const primeChain = await generatePrimeChain(chainLength, bitLength);
        const { publicKey, privateKey } = generateKeysFromPrimeChain(primeChain);

        // Generate a unique salt for this user
        const salt = uuidv4().replace(/-/g, ''); // 32-character salt

        // Encrypt the private key with the user's password before storing
        const encryptedPrivateKey = encryptData(JSON.stringify(privateKey), password, salt);

        // Send signup request to the backend with the public key
        const response = await axios.post('/api/auth/signup', {
          email,
          password,
          publicKey: publicKey.toString(), // Send public key to the server
        });

        const { token, user } = response.data;

        // Store the encrypted private key in secure storage
        await storePrivateKey(user.id, encryptedPrivateKey, salt);

        // Update Auth Context
        setAuthData({
          token,
          user,
          publicKey: publicKey.toString(),
          privateKey,
        });

        // Redirect to dashboard or protected route
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(err.response.data.message || 'Authentication failed. Please try again.');
      } else if (err.request) {
        // No response received
        setError('No response from server. Please check your internet connection.');
      } else {
        // Other errors
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '0 auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {isLogin ? 'Login' : 'Sign Up'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
          aria-label="email for authentication"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
          aria-label="password for authentication"
        />
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <div style={{ position: 'relative' }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                marginTop: '-12px',
              }}
            />
          )}
        </div>
      </form>
      <Button
        color="secondary"
        onClick={() => setIsLogin(!isLogin)}
        disabled={loading}
        sx={{ mt: 2 }}
        fullWidth
      >
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
      </Button>
    </Box>
  );
};

export default Auth;
