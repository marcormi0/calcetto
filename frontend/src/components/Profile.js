import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Card,
  Form,
  Button,
  Image,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";

const avatarOptions = [
  "/avatars/default-avatar.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
];

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0]);
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
        if (response.status !== 404 && data) {
          setPlayer(data);
          setName(data.name);
          setAvatar(data.avatar || avatarOptions[0]);
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

  const AvatarSelector = () => (
    <Form.Group className="mb-3">
      <Form.Label>{t("Select Avatar")}</Form.Label>
      <Row className="g-2">
        {avatarOptions.map((avatarSrc, index) => (
          <Col key={index} xs={4} sm={3} md={2}>
            <Image
              src={avatarSrc}
              alt={`Avatar ${index + 1}`}
              rounded
              className={`avatar-option ${
                avatar === avatarSrc ? "selected" : ""
              }`}
              style={{
                width: "100%",
                height: "auto",
                cursor: "pointer",
                border: avatar === avatarSrc ? "3px solid #007bff" : "none",
              }}
              onClick={() => setAvatar(avatarSrc)}
            />
          </Col>
        ))}
      </Row>
    </Form.Group>
  );

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
              <AvatarSelector />
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
                  src={player.avatar || avatarOptions[0]}
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
