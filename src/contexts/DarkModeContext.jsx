// src/contexts/DarkModeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    // Default to light mode instead of system preference for better control
    return false;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply to document root
    const root = window.document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const enableDarkMode = () => {
    setIsDarkMode(true);
  };

  const enableLightMode = () => {
    setIsDarkMode(false);
  };

  return (
    <DarkModeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      enableDarkMode, 
      enableLightMode 
    }}>
      {children}
    </DarkModeContext.Provider>
  );
};