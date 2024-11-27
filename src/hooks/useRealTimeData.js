// src/utils/useRealTimeData.js

import { useState, useEffect } from "react";

/**
 * Custom hook to fetch real-time data from an API endpoint at specified intervals.
 * @param {string} apiEndpoint - The API endpoint to fetch data from.
 * @param {number} interval - The interval in milliseconds for fetching data.
 * @returns {Object|null} - The fetched data or null if not yet fetched.
 */
const useRealTimeData = (apiEndpoint, interval = 5000) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await fetch(apiEndpoint);
        if (res.ok) {
          const result = await res.json();
          if (isMounted) setData(result);
        } else {
          console.error("Failed to fetch data:", res.status);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Initial fetch
    const timer = setInterval(fetchData, interval); // Subsequent fetches

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [apiEndpoint, interval]);

  return data;
};

export default useRealTimeData;
