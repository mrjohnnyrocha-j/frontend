// src/components/Portfolio.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Snackbar,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useForm } from 'react-hook-form';
import 'chartjs-adapter-date-fns';
import { useWallet } from '../context/WalletContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState(() => {
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    return savedPortfolio ? JSON.parse(savedPortfolio) : [];
  });
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [selectedStock, setSelectedStock] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalValue: 0,
    diversification: [],
    volatility: 0,
    returns: 0,
    sharpeRatio: 0,
  });
  const theme = useTheme();

  const { walletAddress, tokenBalance } = useWallet();

  // Fetch market data for stocks in the portfolio
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);
      if (portfolio.length === 0) {
        setMarketData({});
        return;
      }
      const symbols = portfolio.map((stock) => stock.name).join(',');
      const response = await axios.get(
        `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`
      );
      const quotes = response.data.quoteResponse.result;
      if (!quotes || quotes.length === 0) {
        setSnackbar({ open: true, message: 'No market data available.' });
        return;
      }
      const data = {};
      let totalValue = 0;
      quotes.forEach((quote) => {
        const stock = portfolio.find((s) => s.name === quote.symbol);
        if (stock) {
          const value = quote.regularMarketPrice * stock.shares;
          totalValue += value;
          data[quote.symbol] = {
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
            value: value,
          };
        }
      });
      setMarketData(data);
      calculateAnalytics(totalValue, data);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setSnackbar({ open: true, message: 'Error fetching market data.' });
    } finally {
      setLoading(false);
    }
  }, [portfolio, calculateAnalytics]);

  // Fetch market data whenever the portfolio changes
  useEffect(() => {
    console.log('Current portfolio:', portfolio);
    if (portfolio.length > 0) {
      fetchMarketData();
    } else {
      setMarketData({});
      setAnalytics({
        totalValue: 0,
        diversification: [],
        volatility: 0,
        returns: 0,
        sharpeRatio: 0,
      });
    }
    // Save portfolio to localStorage
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
  }, [portfolio, fetchMarketData]);

  // Calculate portfolio analytics
  const calculateAnalytics = useCallback(
    async (totalValue, data) => {
      const diversification = portfolio.map((stock) => {
        const stockValue = data[stock.name]?.value || 0;
        const percentage = ((stockValue / totalValue) * 100).toFixed(2);
        return {
          name: stock.name,
          percentage: parseFloat(percentage),
        };
      });

      // Calculate portfolio returns and volatility
      let returns = 0;
      let volatility = 0;
      let sharpeRatio = 0;
      try {
        const historicalPrices = await fetchPortfolioHistoricalData();
        const dailyReturns = calculateDailyReturns(historicalPrices);
        returns = (dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length) * 100;
        volatility = calculateStandardDeviation(dailyReturns) * Math.sqrt(252) * 100;
        const riskFreeRate = 0.5; // Assume a risk-free rate of 0.5%
        sharpeRatio = (returns - riskFreeRate) / volatility;
      } catch (error) {
        console.error('Error calculating analytics:', error);
        setSnackbar({ open: true, message: 'Error calculating analytics.' });
      }

      setAnalytics({
        totalValue: totalValue.toFixed(2),
        diversification,
        returns: returns.toFixed(2),
        volatility: volatility.toFixed(2),
        sharpeRatio: sharpeRatio.toFixed(2),
      });
    },
    [portfolio]
  );

  // ... [Rest of your code remains the same, including corrections made earlier]

  // Columns for DataGrid
  const columns = [
    { field: 'name', headerName: 'Stock', flex: 1 },
    { field: 'shares', headerName: 'Shares', type: 'number', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      flex: 1,
      valueGetter: (params) => {
        console.log('Price valueGetter Params:', params);
        if (!params || !params.row || !params.row.name) return 'Loading...';
        return marketData?.[params.row.name]?.price || 'Loading...';
      },
    },
    {
      field: 'value',
      headerName: 'Total Value',
      type: 'number',
      flex: 1,
      valueGetter: (params) => {
        console.log('Value valueGetter Params:', params);
        if (!params || !params.row || !params.row.name) return 'Loading...';
        const value = marketData?.[params.row.name]?.value;
        return value ? value.toFixed(2) : 'Loading...';
      },
    },
  ];

  // ... [Rest of your component code]
};

export default Portfolio;
