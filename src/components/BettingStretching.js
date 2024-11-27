// src/components/BettingStretching.js

import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  useTheme,
} from '@mui/material';

import { generateLargePrime } from '../utils/primeUtils';
import { useWallet } from '../context/WalletContext';

const BettingStretching = () => {
  const { walletAddress, tokenBalance, buyTokens } = useWallet();
  const [odds, setOdds] = useState(1);
  const [primeNumber, setPrimeNumber] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();

  // Fetches dynamic odds using prime number utilities.
  const fetchOdds = async () => {
    try {
      const primes = generateLargePrime(1000);
      const randomIndex = Math.floor(Math.random() * primes.length);
      const selectedPrime = primes[randomIndex];
      setPrimeNumber(selectedPrime);

      // Use the selected prime number to calculate odds
      const calculatedOdds = selectedPrime % 2 === 0 ? 2 : 1.5;
      setOdds(calculatedOdds);
    } catch (error) {
      console.error('Error generating prime numbers:', error);
      setOdds(1);
    }
  };

  useEffect(() => {
    fetchOdds();
    fetchEvents();
  }, []);

  // Mock function to fetch betting events from an API or database.
  const fetchEvents = async () => {
    // Mock data for events
    const mockEvents = [
      {
        id: 'event1',
        name: 'Market Uptrend Prediction',
        description: 'Bet on whether the market will be in an uptrend tomorrow.',
        image: '/images/uptrend.jpg', // Ensure these images are available in your public folder
      },
      {
        id: 'event2',
        name: 'Tech Stocks Rally',
        description: 'Predict if tech stocks will rally this week.',
        image: '/images/tech-stocks.jpg',
      },
      {
        id: 'event3',
        name: 'Gold Price Surge',
        description: 'Bet on gold prices surging above $2000/oz.',
        image: '/images/gold.jpg',
      },
      // Add more events as needed
    ];
    setEvents(mockEvents);
  };

  /**
   * Opens the betting dialog.
   * @param {Object} event - The selected event.
   */
  const handleOpenDialog = (event) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  /**
   * Closes the betting dialog.
   */
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setStakeAmount('');
    setSelectedEvent(null);
  };

  /**
   * Handles stake amount input change.
   */
  const handleStakeChange = (e) => {
    setStakeAmount(e.target.value);
  };

  /**
   * Submits the stake and interacts with the contract.
   */
  const handleSubmitStake = async () => {
    if (!stakeAmount || isNaN(stakeAmount) || stakeAmount <= 0) {
      setSnackbarMessage('Please enter a valid stake amount.');
      setSnackbarOpen(true);
      return;
    }

    if (!selectedEvent) {
      setSnackbarMessage('Please select an event.');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Assuming `buyTokens` handles token purchase and betting
      await buyTokens(parseInt(stakeAmount, 10));

      setSnackbarMessage(
        `Successfully placed a stake of ${stakeAmount} JTK on ${selectedEvent.name}!`
      );
      setSnackbarOpen(true);
      handleCloseDialog();
      fetchOdds();
    } catch (error) {
      console.error('Error placing stake:', error);
      setSnackbarMessage('Failed to place stake.');
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Betting & Stretching
      </Typography>

      {!walletAddress ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          Please connect your wallet to participate in betting.
        </Typography>
      ) : (
        <>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Token Balance: <strong>{tokenBalance} JTK</strong>
          </Typography>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            Available Events:
          </Typography>

          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    position: 'relative',
                    '&:hover': {
                      boxShadow: theme.shadows[6],
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={event.image}
                    alt={event.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(event)}
                    >
                      Place Bet
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Betting Dialog */}
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Place Your Bet on {selectedEvent?.name}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedEvent?.description}
              </Typography>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <TextField
                  label="Stake Amount (JTK)"
                  type="number"
                  fullWidth
                  value={stakeAmount}
                  onChange={handleStakeChange}
                  inputProps={{ min: '0', step: '0.01' }}
                  variant="outlined"
                />
              </FormControl>

              <Typography variant="body1" sx={{ mt: 2 }}>
                Current Odds: <strong>{odds}</strong>
              </Typography>
              <Typography variant="body2">
                Prime Number Used: <strong>{primeNumber}</strong>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="secondary">
                Cancel
              </Button>
              <Button
                onClick={handleSubmitStake}
                color="primary"
                disabled={loading}
                variant="contained"
              >
                {loading ? <CircularProgress size={24} /> : 'Place Bet'}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          />
        </>
      )}
    </Box>
  );
};

export default BettingStretching;
