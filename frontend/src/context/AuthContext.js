// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("user");
  const [user, setUser] = useState(null); // Add user state

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setRole(decoded.role);
        setUser(decoded); // Set the user state with the decoded token
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, role, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
