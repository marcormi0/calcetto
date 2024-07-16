import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./CombinedAuth.css";

const CombinedAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(isLogin ? "/login" : "/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      const token = data.token;

      if (token) {
        localStorage.setItem("authToken", token);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
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
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        {error && <p className="error">{error}</p>}
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Go to Register" : "Go to Login"}
        </button>
      </div>
    </div>
  );
};

export default CombinedAuth;
