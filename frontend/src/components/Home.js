import React, { useState, useEffect, useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Card, Button, Alert, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [unlinkedPlayers, setUnlinkedPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUnlinkedPlayers = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/players/unlinked", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUnlinkedPlayers(data);
      }
    } catch (error) {
      console.error("Error fetching unlinked players:", error);
      setError(t("Failed to load unlinked players. Please try again."));
    }
  }, [t]);

  const checkPlayerStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/players/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        // Player not found, fetch unlinked players
        fetchUnlinkedPlayers();
      } else if (response.ok) {
        const data = await response.json();
        setCurrentPlayer(data);
      } else {
        throw new Error("Failed to fetch player data");
      }
    } catch (error) {
      console.error("Error checking player status:", error);
      setError(t("Failed to load player status. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [user, t, fetchUnlinkedPlayers]);

  useEffect(() => {
    if (user) {
      checkPlayerStatus();
    } else {
      setLoading(false);
    }
  }, [user, checkPlayerStatus]);

  const linkPlayer = async (playerId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/players/${playerId}/link`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!response.ok) {
        throw new Error(t("Failed to link player"));
      }
      checkPlayerStatus();
    } catch (error) {
      console.error("Error linking player:", error);
      setError(t("Failed to link player. Please try again."));
    }
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Alert variant="info">{t("Loading...")}</Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-4 unselectable">
        <h2>{t("Home")}</h2>
        <p>{t("Welcome to the Calcetto App!")}</p>
        <p>{t("Please log in to view your player status.")}</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (currentPlayer) {
    return (
      <Container className="mt-4 unselectable">
        <h2>{t("Home")}</h2>
        <p>{t("Welcome to the Calcetto App!")}</p>
        <Card>
          <Card.Body>
            <Card.Title>{currentPlayer.name}</Card.Title>
            <Card.Text>
              <div
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  margin: "0 auto", // Centers the component horizontally
                }}
              >
                {currentPlayer.flag && (
                  <img
                    src={currentPlayer.flag}
                    alt="Flag"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      zIndex: 1, // Lower z-index for background flag
                    }}
                  />
                )}
                <img
                  src={currentPlayer.avatar || "avatars/default-avatar.png"}
                  alt="Avatar"
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    zIndex: 2,
                  }}
                />
                {currentPlayer.accessories.map((accSrc, index) => (
                  <img
                    key={index}
                    src={accSrc}
                    alt="Accessory"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      zIndex: 3,
                    }}
                  />
                ))}
              </div>
            </Card.Text>
            <Button onClick={() => navigate("/profile")}>
              {t("Go To Profile")}
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (unlinkedPlayers.length > 0) {
    return (
      <Container className="mt-4 unselectable">
        <h2>{t("Home")}</h2>
        <p>{t("Welcome to the Calcetto App!")}</p>
        <p>
          {t("Are you one of these players? If not create your own! ")}
          <Button onClick={() => navigate("/profile")}>
            {t("Create Profile")}
          </Button>
        </p>
        <div className="row">
          {unlinkedPlayers.map((player) => (
            <div key={player._id} className="col-md-4 mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>{player.name}</Card.Title>
                  <Card.Text>
                    <img
                      src={player.avatar || "default-avatar.png"}
                      alt="Avatar"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </Card.Text>
                  <Button onClick={() => linkPlayer(player._id)}>
                    {t("This is me")}
                  </Button>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 unselectable">
      <h2>{t("Home")}</h2>
      <p>{t("Welcome to the Calcetto App!")}</p>
      <p>
        {t(
          "You don't have a player profile yet, and there are no existing profiles to link."
        )}
      </p>
      <Button onClick={() => navigate("/profile")}>
        {t("Create Profile")}
      </Button>
    </Container>
  );
}

export default Home;
