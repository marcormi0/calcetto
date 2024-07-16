import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("user");

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // decode the token to get the user role
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setIsAuthenticated(true);
      setRole(decoded.role);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role }}>
      {children}
    </AuthContext.Provider>
  );
};
