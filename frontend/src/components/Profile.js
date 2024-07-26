import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Container, Card, Form, Button, Image, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
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
        setError(t("Failed to load profile. Please try again."));
        setLoading(false);
      }
    };

    fetchPlayerProfile();
  }, [user.id, t]);

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
        throw new Error(t("Failed to save player profile"));
      }

      const data = await response.json();
      setPlayer(data);
      setIsEditing(false);
      setError("");
    } catch (error) {
      console.error("Error saving player profile:", error);
      setError(t("Failed to save profile. Please try again."));
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Alert variant="info">{t("Loading...")}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 unselectable">
      <Card>
        <Card.Header as="h2">
          {player ? t("Player Profile") : t("Create Player Profile")}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {!player || isEditing ? (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>{t("Name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter your name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("Avatar URL")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter avatar URL")}
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveProfile}>
                {t("Save Profile")}
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => setIsEditing(false)}
                >
                  {t("Cancel")}
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
                {t("Edit Profile")}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
