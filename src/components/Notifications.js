// src/components/Notifications.js

import React from 'react';
import { Typography, Box } from '@mui/material';

const Notifications = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4">Notifications</Typography>
    <Typography>You have no new notifications.</Typography>
  </Box>
);

export default Notifications;
