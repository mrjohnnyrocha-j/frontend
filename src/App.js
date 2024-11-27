// src/App.js

import React, { useState, useMemo } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Divider,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { Routes, Route, useNavigate } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import Chatbot from "./components/Chatbot";
import MarketData from "./components/MarketData";
import Staking from "./components/Staking";
import MarketPrediction from "./components/MarketPrediction";
import BettingStretching from "./components/BettingStretching";
import VoiceChat from "./components/VoiceChat";
import Wallet from "./components/Wallet";
import Alerts from "./components/Alerts";
import Notifications from "./components/Notifications"; // Ensure this component exists
import Tasks from "./components/Tasks"; // Ensure this component exists
import Profile from "./components/Profile"; // Ensure this component exists
import Auth from "./components/Auth";
import AppBarComponent from "./components/AppBarComponent";
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme, darkTheme } from "./theme"; // Import both themes
import { useThemeMode } from "./context/ThemeModeContext";

/**
 * App Component
 * @description The main component that sets up routing and integrates various components.
 */
const App = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [appsInTabs, setAppsInTabs] = useState([]); // Apps added to tabs
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { themeMode, toggleThemeMode } = useThemeMode(); // Access theme mode context

  const theme = useMemo(
    () => (themeMode === "light" ? lightTheme : darkTheme),
    [themeMode]
  );

  const defaultTabs = [
    { label: "Portfolio", value: "portfolio" },
    { label: "Chatbot", value: "chatbot" },
    { label: "Staking", value: "staking" },
    { label: "Betting & Stretching", value: "bettingstretching" },
    { label: "Market Predictions", value: "marketprediction" },
    // ...other default tabs
  ];

  const TABS = {
    PORTFOLIO: "portfolio",
    CHATBOT: "chatbot",
    MARKETDATA: "marketdata",
    STAKING: "staking",
    BETTINGSTRETCHING: "bettingstretching",
    MARKETPREDICTION: "marketprediction",
    VOICECHAT: "voicechat",
    ALERTS: "alerts",
    AUTH: "auth",
  };

  /**
   * Toggles the navigation drawer.
   */
  const handleDrawerToggle = () => {
    setOpenDrawer(!openDrawer);
  };

  /**
   * Adds an app to the active tabs.
   * @param {Object} app - The app object to add.
   */
  const handleAddAppToTabs = (app) => {
    if (!appsInTabs.some((a) => a.id === app.id)) {
      setAppsInTabs([...appsInTabs, app]);
    }
    navigate(`/${app.id}`); // Corrected navigation
  };

  /**
   * Changes the active tab and closes the drawer.
   * @param {string} tab - The tab value to activate.
   */
  const handleTabChange = (tab) => {
    navigate(`/${tab}`); // Corrected navigation
    setOpenDrawer(false); // Close drawer after selecting a tab
  };

  /**
   * Closes a specific tab.
   * @param {string} tabId - The ID of the tab to close.
   */
  const handleCloseTab = (tabId) => {
    setAppsInTabs(appsInTabs.filter((app) => app.id !== tabId));
    navigate("/portfolio"); // Redirect to a default tab after closing
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarComponent
        handleDrawerToggle={handleDrawerToggle}
        allTabs={[
          ...defaultTabs,
          ...appsInTabs.map((app) => ({ label: app.name, value: app.id })),
        ]}
        appsInTabs={appsInTabs}
        handleAddAppToTabs={handleAddAppToTabs}
        handleCloseTab={handleCloseTab}
        toggleTheme={toggleThemeMode}
        currentTheme={themeMode}
      />

      {/* Drawer for navigation */}
      <Drawer open={openDrawer} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250 }}>
          <List>
            {defaultTabs.map((tab) => (
              <ListItem
                button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
              >
                <ListItemText primary={tab.label} />
              </ListItem>
            ))}
            {/* Additional tabs can be added here */}
            {appsInTabs.map((app) => (
              <ListItem
                button
                key={app.id}
                onClick={() => handleTabChange(app.id)}
              >
                <ListItemText primary={app.name} />
              </ListItem>
            ))}
            <ListItem button onClick={() => handleTabChange(TABS.AUTH)}>
              <ListItemText primary="Login/Sign Up" />
            </ListItem>
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Main content rendering based on route */}
      <Grid container spacing={3} sx={{ padding: "20px" }}>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ padding: "20px" }}>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/marketdata" element={<MarketData />} />
              <Route path="/staking" element={<Staking />} />
              <Route
                path="/bettingstretching"
                element={<BettingStretching />}
              />
              <Route
                path="/marketprediction"
                element={<MarketPrediction />}
              />
              <Route path="/voicechat" element={<VoiceChat />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/profile" element={<Profile />} />
              {/* Dynamic routes for added apps */}
              {appsInTabs.map((app) => (
                <Route
                  key={app.id}
                  path={`/${app.id}`} // Corrected path
                  element={
                    <iframe
                      title={app.name}
                      srcDoc={app.jtmlContent}
                      style={{
                        width: "100%",
                        height: "600px",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    ></iframe>
                  }
                />
              ))}
              {/* Fallback route for undefined paths */}
              <Route
                path="*"
                element={<Typography>Page Not Found</Typography>}
              />
            </Routes>
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
