import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Typography,
  Paper,
  Button,
} from '@mui/material';

import { isProbablyPrime } from '../utils/primeUtils';


const MarketData = () => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [predictions, setPredictions] = useState({});

  useEffect(() => {
    fetch('http://localhost:5001/market-data')  // Adjust URL to your backend API
      .then(response => response.json())
      .then(data => {
        setMarketData(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load market data');
        setLoading(false);
      });
  }, []);

  const handlePredict = (asset) => {
    // Use prime utilities to generate a prediction
    const latestPrice = asset.prices[asset.prices.length - 1];
    const factors = isProbablyPrime(Math.floor(latestPrice));
    const prediction = factors.length % 2 === 0 ? 'Up' : 'Down';

    setPredictions((prevPredictions) => ({
      ...prevPredictions,
      [asset.symbol]: prediction,
    }));
  };

  return (
    <Paper sx={{ padding: 2, marginTop: 3 }}>
      <Typography variant="h2" gutterBottom>Market Data and Predictions</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        marketData && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Asset</strong></TableCell>
                <TableCell><strong>Latest Price</strong></TableCell>
                <TableCell><strong>Prediction</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {marketData.assets.map((asset) => (
                <TableRow key={asset.symbol}>
                  <TableCell>{asset.symbol.toUpperCase()}</TableCell>
                  <TableCell>{`$${asset.prices[asset.prices.length - 1].toFixed(2)}`}</TableCell>
                  <TableCell>{predictions[asset.symbol] || 'No Prediction'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handlePredict(asset.prices)}
                    >
                      Predict Market
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
    </Paper>
  );
};

export default MarketData;
