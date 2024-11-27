// src/components/MarketPrediction.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Paper,
  Grid,
  Snackbar,
  Autocomplete,
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useTheme } from '@mui/material/styles';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import {
  Chart as ChartJS,
  TimeScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

// Register necessary Chart.js components
ChartJS.register(
  TimeScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  zoomPlugin
);

const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Replace with your Alpha Vantage API key

const MarketPrediction = () => {
  const [symbol, setSymbol] = useState({ symbol: 'AAPL', name: 'Apple Inc.' });
  const [marketData, setMarketData] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [filter, setFilter] = useState('daily');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);
  const [assetOptions, setAssetOptions] = useState([]);

  const theme = useTheme(); // Access the MUI theme

  useEffect(() => {
    fetchMarketData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, filter, dateRange]);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const interval =
        filter === 'daily' ? 'TIME_SERIES_DAILY_ADJUSTED' : 'TIME_SERIES_INTRADAY';
      const url =
        filter === 'daily'
          ? `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol.symbol}&apikey=${API_KEY}`
          : `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol.symbol}&interval=60min&apikey=${API_KEY}`;

      const response = await axios.get(url);
      const dataKey = filter === 'daily' ? 'Time Series (Daily)' : 'Time Series (60min)';
      const data = response.data[dataKey];

      if (!data) {
        throw new Error('No data found');
      }

      const timeSeries = Object.entries(data)
        .map(([date, values]) => ({
          date: new Date(date),
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['6. volume'] || values['5. volume'], 10),
        }))
        .filter((d) => {
          if (dateRange[0] && dateRange[1]) {
            return d.date >= dateRange[0] && d.date <= dateRange[1];
          }
          return true;
        });

      if (timeSeries.length === 0) {
        throw new Error('No data available for the selected date range.');
      }

      setMarketData(timeSeries.reverse()); // Reverse to have oldest data first

      // Prepare chart data with theme colors
      setChartData({
        labels: timeSeries.map((d) => d.date),
        datasets: [
          {
            label: `${symbol.symbol} Closing Prices`,
            data: timeSeries.map((d) => ({ x: d.date, y: d.close })),
            fill: false,
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.light,
            tension: 0.1,
            pointRadius: 2,
          },
        ],
      });

      // Perform prediction using simple moving average
      performPrediction(timeSeries);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setSnackbarMessage(error.message || 'Error fetching market data. Please try again.');
      setSnackbarOpen(true);
      setChartData(null);
      setPrediction('');
    } finally {
      setLoading(false);
    }
  };

  const performPrediction = (data) => {
    // Simple Moving Average (SMA) Prediction
    const closes = data.map((d) => d.close);
    const smaPeriod = 5;
    if (closes.length >= smaPeriod) {
      const recentCloses = closes.slice(-smaPeriod);
      const average = recentCloses.reduce((acc, val) => acc + val, 0) / smaPeriod;
      const lastClose = closes[closes.length - 1];

      if (lastClose > average) {
        setPrediction('Market will likely go up.');
      } else {
        setPrediction('Market will likely go down.');
      }
    } else {
      setPrediction('Insufficient data for prediction.');
    }
  };

  const handleSymbolChange = async (event, newValue) => {
    if (newValue) {
      setSymbol(newValue);
    }
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const fetchAssetOptions = async (inputValue) => {
    if (!inputValue) return;
    try {
      const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${inputValue}&apikey=${API_KEY}`;
      const response = await axios.get(url);
      const bestMatches = response.data.bestMatches || [];

      setAssetOptions(
        bestMatches.map((match) => ({
          symbol: match['1. symbol'],
          name: match['2. name'],
        }))
      );
    } catch (error) {
      console.error('Error fetching asset options:', error);
    }
  };

  // Chart options with theme settings and zoom plugin
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        titleFont: {
          family: theme.typography.fontFamily,
        },
        bodyFont: {
          family: theme.typography.fontFamily,
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
          modifierKey: 'ctrl',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: filter === 'daily' ? 'day' : 'hour',
          tooltipFormat: filter === 'daily' ? 'PPP' : 'PPP p',
        },
        ticks: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.primary,
          font: {
            family: theme.typography.fontFamily,
          },
        },
        grid: {
          color: theme.palette.divider,
        },
      },
    },
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Market Prediction
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={assetOptions}
            getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
            onInputChange={(event, value) => fetchAssetOptions(value)}
            onChange={handleSymbolChange}
            renderInput={(params) => <TextField {...params} label="Search Assets" />}
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel id="filter-label">Data Interval</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              label="Data Interval"
              onChange={handleFilterChange}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="intraday">Intraday</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateRangePicker
              startText="Start Date"
              endText="End Date"
              value={dateRange}
              onChange={(newValue) => {
                setDateRange(newValue);
              }}
              renderInput={(startProps, endProps) => (
                <React.Fragment>
                  <TextField {...startProps} fullWidth />
                  <Box sx={{ mx: 2 }}> to </Box>
                  <TextField {...endProps} fullWidth />
                </React.Fragment>
              )}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchMarketData}
            disabled={loading}
            fullWidth
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Data'}
          </Button>
        </Grid>
      </Grid>

      {prediction && (
        <Typography variant="h6" sx={{ mt: 3 }}>
          Prediction: {prediction}
        </Typography>
      )}

      {chartData && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Line data={chartData} options={chartOptions} />
        </Paper>
      )}

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

export default MarketPrediction;
