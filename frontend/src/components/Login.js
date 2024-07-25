// src/components/Login.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode"; // Correctly import jwt-decode
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser, setRole } = useContext(AuthContext); // Destructure setRole from context
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
      setRole(decoded.role); // Set the role in context
      setUser(decoded); // Set the user in context
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h2">
          {isRegistering ? "Register" : "Login"}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
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
              onClick={() => setIsRegistering(!isRegistering)}
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
