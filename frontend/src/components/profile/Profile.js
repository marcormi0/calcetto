import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AvatarPreview from "./AvatarPreview";
import { fetchPlayerProfile, savePlayerProfile } from "./ProfileUtils";
import { avatarOptions } from "./Costants";
import CollapsibleSelectors from "./CollapsibleSelectord";

const Profile = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [accessories, setAccessories] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [playerStats, setPlayerStats] = useState(null);

  useEffect(() => {
    fetchPlayerProfile(
      user.id,
      setPlayer,
      setName,
      setAvatar,
      setAccessories,
      setSelectedFlag,
      setPlayerStats,
      setLoading,
      setError,
      t
    );
  }, [user.id, t]);

  const handleSaveProfile = async () => {
    await savePlayerProfile(
      name,
      avatar,
      accessories,
      selectedFlag,
      playerStats,
      setPlayer,
      setIsEditing,
      setError,
      t
    );
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
              <Form.Group className="mb-4">
                <Form.Label>{t("Name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter your name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <AvatarPreview
                avatar={avatar}
                accessories={accessories}
                selectedFlag={selectedFlag}
              />
              <CollapsibleSelectors
                avatar={avatar}
                setAvatar={setAvatar}
                accessories={accessories}
                setAccessories={setAccessories}
                selectedFlag={selectedFlag}
                setSelectedFlag={setSelectedFlag}
                playerStats={playerStats}
              />
              <div className="d-flex justify-content-center mt-4">
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  className="me-2"
                >
                  {t("Save Profile")}
                </Button>
                {isEditing && (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    {t("Cancel")}
                  </Button>
                )}
              </div>
            </Form>
          ) : (
            <>
              <Card.Title className="text-center mb-4">
                {player.name}
              </Card.Title>
              <AvatarPreview
                avatar={avatar}
                accessories={accessories}
                selectedFlag={selectedFlag}
              />
              {playerStats && (
                <div className="mt-4">
                  <h4>{t("Player Statistics")}</h4>
                  <p>
                    {t("Matches Played")}: {playerStats.matchesPlayed}
                  </p>
                  <p>
                    {t("Goals Scored")}: {playerStats.goals}
                  </p>
                  <p>
                    {t("Assists")}: {playerStats.assists}
                  </p>
                  <p>
                    {t("MVP Count")}: {playerStats.mvpCount}
                  </p>
                </div>
              )}
              <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  {t("Edit Profile")}
                </Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
