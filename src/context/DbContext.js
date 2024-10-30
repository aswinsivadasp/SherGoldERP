import React, { createContext, useContext, useState, useEffect } from 'react';

const DbContext = createContext();

// Create a provider component
export const DbProvider = ({ children }) => {
  const [dbCode, setDbCode] = useState(() => {
    // Retrieve dbCode from session storage on initial load
    const storedDbCode = sessionStorage.getItem('dbCode');

    // Check if storedDbCode is valid JSON
    try {
      return storedDbCode ? JSON.parse(storedDbCode) : null;
    } catch (error) {
      console.error("Error parsing dbCode from session storage:", error);
      return null; // Return null or some default value
    }
  });

  useEffect(() => {
    sessionStorage.setItem('dbCode', JSON.stringify(dbCode));
  }, [dbCode]);

  return (
    <DbContext.Provider value={{ dbCode, setDbCode }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDbContext = () => {
  return useContext(DbContext);
};
