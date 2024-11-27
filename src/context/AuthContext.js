// src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

/**
 * @title AuthContext
 * @dev Provides authentication state and functions to the application.
 */
export const AuthContext = createContext();

/**
 * @title AuthProvider
 * @dev Wraps the application and provides authentication context.
 */
export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    token: null,
    user: null,
  });

  // Load auth data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = JSON.parse(localStorage.getItem('authUser'));

    if (storedToken && storedUser) {
      setAuthData({ token: storedToken, user: storedUser });
    }
  }, []);

  // Update localStorage when authData changes
  useEffect(() => {
    if (authData.token && authData.user) {
      localStorage.setItem('authToken', authData.token);
      localStorage.setItem('authUser', JSON.stringify(authData.user));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, [authData]);

  /**
   * Logs out the user by clearing auth data.
   */
  const logout = () => {
    setAuthData({ token: null, user: null });
  };

  /**
   * Sets authentication data.
   * @param {Object} data - Contains token and user information.
   */
  const login = (data) => {
    setAuthData(data);
  };

  return (
    <AuthContext.Provider value={{ authData, setAuthData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
