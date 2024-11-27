// src/components/Profile.js

import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: '/images/default-avatar.png',
  });
  const [editMode, setEditMode] = useState(false);
  const [editProfile, setEditProfile] = useState(profile);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();

  /**
   * Handles profile input changes.
   * @param {Object} e - The event object.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfile({ ...editProfile, [name]: value });
  };

  /**
   * Saves the updated profile.
   */
  const handleSaveProfile = () => {
    setProfile(editProfile);
    setEditMode(false);
    setSnackbarMessage('Profile updated successfully.');
    setSnackbarOpen(true);
  };

  /**
   * Handles profile picture upload.
   * @param {Object} e - The event object.
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For demonstration, we use a local URL. In production, upload to server or cloud storage.
      const avatarUrl = URL.createObjectURL(file);
      setEditProfile({ ...editProfile, avatar: avatarUrl });
    }
  };

  /**
   * Opens the change password dialog.
   */
  const handleOpenPasswordDialog = () => {
    setPasswordDialogOpen(true);
  };

  /**
   * Closes the change password dialog.
   */
  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setNewPassword('');
  };

  /**
   * Saves the new password.
   */
  const handleSavePassword = () => {
    // Implement password change logic here
    handleClosePasswordDialog();
    setSnackbarMessage('Password changed successfully.');
    setSnackbarOpen(true);
  };

  /**
   * Closes the snackbar notification.
   */
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mt: 3,
          flexDirection: 'column',
        }}
      >
        <Avatar
          src={profile.avatar}
          alt={profile.name}
          sx={{ width: 120, height: 120 }}
        />
        {editMode && (
          <Button
            variant="text"
            component="label"
            sx={{ mt: 1 }}
          >
            Change Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Button>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        {editMode ? (
          <>
            <TextField
              label="Name"
              name="name"
              value={editProfile.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Email"
              name="email"
              value={editProfile.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
            />
          </>
        ) : (
          <>
            <Typography variant="subtitle1">
              <strong>Name:</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profile.name}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Email:</strong>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {profile.email}
            </Typography>
          </>
        )}

        <Box sx={{ mt: 2 }}>
          {editMode ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
                sx={{ mr: 2 }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setEditMode(true)}
                sx={{ mr: 2 }}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                onClick={handleOpenPasswordDialog}
              >
                Change Password
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handleClosePasswordDialog}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSavePassword} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Profile;
