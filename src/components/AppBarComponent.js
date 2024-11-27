// src/components/AppBarComponent.js

import React, { useState, useContext, useEffect } from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  CircularProgress,
  Snackbar,
  Box,
  Tooltip,
  Tabs,
  Tab,
} from "@mui/material";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

// Import the new icons
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { useNavigate, useLocation } from "react-router-dom"; // Import hooks
import ThemeModeContext from "../context/ThemeModeContext";
import AppStore from "./AppStore";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "@mui/material/styles";

/**
 * AppBarComponent
 * @description Implements the application's top navigation bar with various functionalities.
 * @param {Function} handleDrawerToggle - Function to toggle the navigation drawer.
 * @param {Object[]} allTabs - Array of all open tabs in the application.
 * @param {Function} handleAddAppToTabs - Function to add an app to the tabs.
 * @param {Function} handleCloseTab - Function to close a specific tab.
 * @param {Function} toggleTheme - Function to toggle between light and dark themes.
 * @param {string} currentTheme - Current theme mode ('light' or 'dark').
 */
const AppBarComponent = ({
  handleDrawerToggle,
  allTabs,
  handleAddAppToTabs,
  handleCloseTab,
  toggleTheme, // Function to toggle theme
  currentTheme, // Current theme mode
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const { themeMode, toggleThemeMode } = useContext(ThemeModeContext);
  const [tokenAmount, setTokenAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [appStoreOpen, setAppStoreOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const { wallet, walletAddress, tokenBalance, buyTokens } = useWallet(); // Get wallet state from context

  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation(); // Initialize useLocation

  /**
   * Determines the active tab based on the current route.
   */
  const getActiveTab = () => {
    const path = location.pathname.substring(1); // Remove the leading '/'
    // Default to 'portfolio' if path is empty
    const validTabs = allTabs.map((tab) => tab.value);
    return validTabs.includes(path) ? path : "portfolio";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  /**
   * Updates the active tab when the route changes.
   */
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname, allTabs]);

  /**
   * Handles the click event for buying tokens.
   */
  const handleBuyTokensClick = () => {
    if (!wallet) {
      setSnackbarMessage("Please create or import a wallet first.");
      setSnackbarOpen(true);
      return;
    }
    setBuyDialogOpen(true);
  };

  /**
   * Handles the purchase of tokens.
   */
  const handleBuyTokens = async () => {
    if (!tokenAmount || isNaN(tokenAmount) || tokenAmount <= 0) {
      setSnackbarMessage("Please enter a valid token amount.");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    try {
      // Assuming buyTokens handles the token purchase logic
      await buyTokens(parseInt(tokenAmount, 10));
      setSnackbarMessage(`Successfully purchased ${tokenAmount} JTK!`);
      setSnackbarOpen(true);
      setBuyDialogOpen(false);
      setTokenAmount("");
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setSnackbarMessage("Failed to purchase tokens. Please try again.");
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  /**
   * Closes the snackbar notification.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  /**
   * Opens the App Store dialog.
   */
  const handleAppStoreOpen = () => {
    setAppStoreOpen(true);
  };

  /**
   * Closes the App Store dialog.
   */
  const handleAppStoreClose = () => {
    setAppStoreOpen(false);
  };

  /**
   * Opens the Wallet in a new tab.
   */
  const handleWalletOpenNewTab = () => {
    window.open(`${window.location.origin}/wallet`, "_blank", "noopener,noreferrer");
  };

  /**
   * Opens the user menu.
   * @param {Object} event - The click event.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Closes the user menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Navigates to the Profile page.
   */
  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  /**
   * Logs out the user and navigates to the Login page.
   */
  const handleLogoutClick = () => {
    // Implement your logout logic here (e.g., clearing auth tokens)
    // For example:
    // authContext.logout();
    navigate("/login");
    handleMenuClose();
  };

  /**
   * Handles tab change and navigates to the selected route.
   * @param {Object} event - The event object.
   * @param {string} newValue - The value of the selected tab.
   */
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`); // Navigate to the selected tab's route
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
        <Toolbar>
          {/* Menu Button */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/portfolio")} // Redirect to Portfolio on click
          >
            <Box
              component="img"
              sx={{
                height: 40,
                marginRight: 1, // MUI spacing, equivalent to 8px
              }}
              alt="j.holdings logo"
              src="/assets/j_logo.svg"
            />
            j.holdings
          </Typography>

          {/* Tabs */}
          <Box sx={{ flexGrow: 1, ml: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="application tabs"
            >
              {allTabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} aria-label={tab.label} />
              ))}
            </Tabs>
          </Box>

          {/* Token Balance */}
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            Balance: {tokenBalance} JTK
          </Typography>

          {/* Theme Toggle */}
          {/* Uncomment if you want the theme toggle button */}
          {/* <Tooltip title="Toggle light/dark theme">
            <IconButton
              sx={{ ml: 1 }}
              onClick={toggleThemeMode}
              color="inherit"
              aria-label="toggle theme"
            >
              {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip> */}

          {/* Wallet Icon */}
          <Tooltip title="Wallet (opens in new tab)">
            <IconButton color="inherit" onClick={handleWalletOpenNewTab} aria-label="wallet">
              <WalletIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications Icon */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" onClick={() => navigate("/notifications")} aria-label="notifications">
              <NotificationsIcon />
            </IconButton>
          </Tooltip>

          {/* Buy Tokens IconButton with Tooltip */}
          <Tooltip title="Buy Tokens">
            <IconButton color="inherit" onClick={handleBuyTokensClick} aria-label="buy tokens">
              <MonetizationOnIcon />
            </IconButton>
          </Tooltip>

          {/* Complete Task IconButton with Tooltip */}
          <Tooltip title="Tasks">
            <IconButton color="inherit" onClick={() => navigate("/tasks")} aria-label="tasks">
              <AssignmentIcon />
            </IconButton>
          </Tooltip>

          {/* App Store IconButton with Tooltip */}
          <Tooltip title="App Store">
            <IconButton color="inherit" onClick={handleAppStoreOpen} aria-label="app store">
              <StorefrontIcon />
            </IconButton>
          </Tooltip>

          {/* User Avatar and Menu */}
          <IconButton edge="end" color="inherit" onClick={handleMenuOpen} aria-label="account">
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={toggleThemeMode}>
              {themeMode === "light" ? (
                <>
                  <Brightness4Icon fontSize="small" /> &nbsp; Dark Mode
                </>
              ) : (
                <>
                  <Brightness7Icon fontSize="small" /> &nbsp; Light Mode
                </>
              )}
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Buy Tokens Dialog */}
      <Dialog open={buyDialogOpen} onClose={() => setBuyDialogOpen(false)}>
        <DialogTitle>Buy Tokens</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter the amount of tokens you want to purchase.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (JTK)"
            type="number"
            fullWidth
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            inputProps={{ min: "1", step: "1" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBuyDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBuyTokens} color="primary" disabled={loading || !tokenAmount}>
            {loading ? <CircularProgress size={24} /> : "Buy Tokens"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" size="small" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
      />

      {/* App Store Dialog */}
      <Dialog open={appStoreOpen} onClose={handleAppStoreClose} fullWidth maxWidth="md">
        <DialogTitle>
          App Store
          <IconButton
            aria-label="close"
            onClick={handleAppStoreClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <AppStore onAddApp={handleAddAppToTabs} addAppToTabs={handleAddAppToTabs} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAppStoreClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AppBarComponent;
