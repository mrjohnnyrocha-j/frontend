// src/components/PaymentDialog.js

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Snackbar,
  CircularProgress,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your_stripe_publishable_key');

const PaymentDialog = ({ open, onClose, tokenBalance }) => {
  const [actionType, setActionType] = useState('deposit'); // 'deposit' or 'withdraw'
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' or 'paypal'
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    if (paymentMethod === 'paypal' && window.paypal && amount) {
      window.paypal.Buttons({
        createOrder: function (data, actions) {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount,
                },
                description: actionType === 'deposit' ? 'Deposit JToken' : 'Withdraw JToken',
              },
            ],
          });
        },
        onApprove: function (data, actions) {
          return actions.order.capture().then(function (details) {
            // Call your server to finalize the transaction
            fetch('/capture-paypal-transaction', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                orderID: data.orderID,
                actionType,
                amount,
              }),
            })
              .then((res) => res.json())
              .then((result) => {
                if (result.success) {
                  setSnackbarMessage(`Successfully ${actionType}ed ${amount} JTK via PayPal!`);
                  setSnackbarOpen(true);
                  onClose();
                } else {
                  setSnackbarMessage('PayPal transaction failed.');
                  setSnackbarOpen(true);
                }
              });
          });
        },
        onError: function (err) {
          console.error('PayPal error:', err);
          setSnackbarMessage('Failed to process PayPal payment.');
          setSnackbarOpen(true);
        },
      }).render('#paypal-button-container');
    }
  }, [paymentMethod, amount, actionType]);

  const handlePayment = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setSnackbarMessage('Please enter a valid amount.');
      setSnackbarOpen(true);
      return;
    }

    if (paymentMethod === 'stripe') {
      await handleStripePayment();
    }
  };

  const handleStripePayment = async () => {
    setLoading(true);
    try {
      const response = await fetch('/create-stripe-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, actionType }),
      });
      const { id } = await response.json();

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: id });
    } catch (error) {
      console.error('Stripe payment error:', error);
      setSnackbarMessage('Failed to initiate Stripe Checkout.');
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {actionType === 'deposit' ? 'Deposit JToken' : 'Withdraw JToken'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom>
          Enter the amount to {actionType} and select a payment method.
        </Typography>
        {actionType === 'withdraw' && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Balance: {tokenBalance} JTK
          </Typography>
        )}
        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mt: 2 }}
          required
        />
        <ToggleButtonGroup
          value={paymentMethod}
          exclusive
          onChange={(e, value) => setPaymentMethod(value)}
          sx={{ mt: 2 }}
          fullWidth
        >
          <ToggleButton value="stripe">Credit Card (Stripe)</ToggleButton>
          <ToggleButton value="paypal">PayPal</ToggleButton>
        </ToggleButtonGroup>
        {paymentMethod === 'paypal' && (
          <Box sx={{ mt: 2 }}>
            <div id="paypal-button-container"></div>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setActionType(actionType === 'deposit' ? 'withdraw' : 'deposit')}
          color="primary"
          disabled={loading}
        >
          {actionType === 'deposit' ? 'Switch to Withdraw' : 'Switch to Deposit'}
        </Button>
        {paymentMethod === 'stripe' && (
          <Button onClick={handlePayment} color="primary" disabled={loading || !amount}>
            {loading ? <CircularProgress size={24} /> : 'Proceed to Payment'}
          </Button>
        )}
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancel
        </Button>
      </DialogActions>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default PaymentDialog;
