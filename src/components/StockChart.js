import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';  // Use Plotly for chart visualization

const StockChart = () => {
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // Error state to handle failed API calls

  useEffect(() => {
    // Fetch market data (replace with actual backend endpoint)
    fetch('http://localhost:5001/market-data')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        return response.json();
      })
      .then((data) => {
        setStockData(data);
        setLoading(false);  // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching stock data');
        setLoading(false);  // Stop loading even if there is an error
      });
  }, []);

  return (
    <div>
      <h2>Stock Data</h2>
      {loading ? (
        <p>Loading stock data...</p>
      ) : error ? (
        <p>{error}</p>  // Display error message if there's an issue
      ) : stockData && stockData.prices && stockData.dates ? (
        <Plot
          data={[
            {
              x: stockData.dates,  // Dates on the x-axis
              y: stockData.prices['AAPL'],  // Prices of AAPL stock (replace with desired stock key)
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: 'green' },
            },
          ]}
          layout={{ width: 600, height: 400, title: 'AAPL Stock Prices' }}
        />
      ) : (
        <p>No stock data available.</p>  // Handle the case where data is not structured as expected
      )}
    </div>
  );
};

export default StockChart;
