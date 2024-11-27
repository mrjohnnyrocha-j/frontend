// src/components/WebsiteGenerator.js

import React, { useState } from "react";
import { Box, TextField, Button, Typography, Snackbar } from "@mui/material";
import { generatePrimeChainRandomWebsite } from "../utils/primeChainUtils"; // Assuming you have prime chain logic here

const WebsiteGenerator = ({ onGenerate }) => {
  const [websiteName, setWebsiteName] = useState("");
  const [websiteId, setWebsiteId] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  /**
   * Handles the generation of a new website using prime chain-based randomness.
   */
  const handleGenerate = () => {
    if (websiteName.trim() === "" && websiteId.trim() === "") {
      setSnackbarMessage("Please enter at least a Website Name or ID.");
      setSnackbarOpen(true);
      return;
    }

    // Use Prime Chain-based randomness to generate a new website
    const randomWebsite = generatePrimeChainRandomWebsite();

    // If user provided a name or ID, use them; otherwise, use the randomly generated ones
    const generatedWebsite = {
      id: websiteId || randomWebsite.id, // Use user input or generated prime chain ID
      name: websiteName || randomWebsite.name, // Use user input or prime chain name
      content: randomWebsite.content, // Prime chain-based generated content
    };

    // Call the onGenerate callback with the newly generated website
    onGenerate(generatedWebsite);

    // Clear input fields after generation
    setWebsiteName("");
    setWebsiteId("");
    setSnackbarMessage("Website generated successfully!");
    setSnackbarOpen(true);
  };

  /**
   * Closes the snackbar notification.
   */
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Website Generator (Prime Chain Randomness)
      </Typography>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { mb: 2, width: "100%" },
          display: "flex",
          flexDirection: "column",
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          label="Website Name"
          variant="outlined"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          placeholder="Enter website name"
        />
        <TextField
          label="Website ID"
          variant="outlined"
          value={websiteId}
          onChange={(e) => setWebsiteId(e.target.value)}
          placeholder="Enter website ID"
        />
        <Button variant="contained" color="primary" onClick={handleGenerate}>
          Generate Website
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default WebsiteGenerator;
