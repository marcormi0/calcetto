// src/components/Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setIsAuthenticated, setUser, setRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      if (isRegistering) {
        setSuccess(data.message);
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setName("");
      } else {
        // Only attempt to decode and store token for login
        const token = data.token;
        if (!token) {
          throw new Error("No token received from server");
        }
        localStorage.setItem("authToken", token);
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setRole(decoded.role);
        setUser(decoded);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4 unselectable">
      <Card>
        <Card.Header as="h2">
          {isRegistering ? "Register" : "Login"}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            {isRegistering && (
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isRegistering ? "Register" : "Login"}
            </Button>
          </Form>
          <Card.Text className="mt-3">
            <Button
              variant="link"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
                setSuccess("");
                setEmail("");
                setPassword("");
                setName("");
              }}
            >
              {isRegistering
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Button>
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
