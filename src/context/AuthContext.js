import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [agentCode, setAgentCode] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated') === 'true';
    const storedAgentCode = localStorage.getItem('agentCode');
    setIsAuthenticated(loggedIn);
    setAgentCode(storedAgentCode);
    setLoading(false);
  }, []);

  const login = (agentCode,userType) => {
    sessionStorage.setItem("agentCode", agentCode);
    sessionStorage.setItem("userType", userType);
 
    setIsAuthenticated(true);
    setAgentCode(agentCode);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('agentCode', agentCode);
  };

  const logout = () => {
    sessionStorage.removeItem("agentCode");
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("dbCode");


    setIsAuthenticated(false);
    setAgentCode(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('agentCode');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading, agentCode }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
