import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Form, Button, Image, Alert } from "react-bootstrap";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlayerProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/players/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data) {
          setPlayer(data);
          setName(data.name);
          setAvatar(data.avatar);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player profile:", error);
        setError("Failed to load profile. Please try again.");
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [user.id]);

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id, name, avatar }),
      });

      if (!response.ok) {
        throw new Error("Failed to save player profile");
      }

      const data = await response.json();
      setPlayer(data);
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error saving player profile:", error);
      setError("Failed to save profile. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Loading...</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 unselectable">
      <Card>
        <Card.Header as="h2">
          {player ? "Player Profile" : "Create Player Profile"}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {!player || isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Avatar URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter avatar URL"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveProfile}>
                Save Profile
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
            </Form>
          ) : (
            <>
              <Card.Title>{player.name}</Card.Title>
              <Card.Text>
                <Image
                  src={player.avatar || "default-avatar.png"}
                  alt="Avatar"
                  roundedCircle
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </Card.Text>
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
