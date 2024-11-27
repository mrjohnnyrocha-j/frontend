// src/components/Alerts.js

import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
} from "@mui/material";
// src/components/Alerts.js

// import { useAxios } from '../utils/axiosConfig';

// // Usage example
// const { data, error, loading } = useAxios('/api/alerts');


const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Fetch alerts from the backend
  //   const fetchAlerts = async () => {
  //     try {
  //       const response = await axios.get("/alerts"); // Replace with your API endpoint
  //       setAlerts(response.data);
  //     } catch (error) {
  //       console.error("Error fetching alerts:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAlerts();
  // }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (alerts.length === 0) {
    return <Typography>No alerts at the moment.</Typography>;
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Alerts
      </Typography>
      <List>
        {alerts.map((alert, index) => (
          <Paper key={index} sx={{ mb: 2, p: 2 }}>
            <ListItem>
              <ListItemText
                primary={alert.title}
                secondary={alert.message}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </div>
  );
};

export default Alerts;
