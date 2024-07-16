// src/components/Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser } = useContext(AuthContext); // Destructure setUser from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering ? "/register" : "/login";
    const body = isRegistering
      ? { email, password, name }
      : { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      const data = await response.json();
      const token = data.token;

      localStorage.setItem("authToken", token);
      const decoded = jwtDecode(token);
      setIsAuthenticated(true);
      setUser(decoded); // Set the user in context
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isRegistering ? "Register" : "Login"}</h2>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">{isRegistering ? "Register" : "Login"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
};

export default Login;
