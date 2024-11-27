// src/context/ThemeModeContext.js

import React, { createContext, useContext } from 'react';

/**
 * @title ThemeModeContext
 * @description Provides theme mode state and toggle function.
 */
const ThemeModeContext = createContext();

/**
 * @title useThemeMode
 * @description Custom hook to access ThemeModeContext.
 */
export const useThemeMode = () => useContext(ThemeModeContext);

/**
 * @title ThemeModeProvider
 * @description Wraps the application and provides theme mode context.
 * @param {Object} props - React props.
 * @returns {JSX.Element} - Provider component.
 */
export const ThemeModeProvider = ({ children, themeMode, toggleThemeMode }) => {
  return (
    <ThemeModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </ThemeModeContext.Provider>
  );
};

export default ThemeModeContext;
