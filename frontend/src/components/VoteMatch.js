import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const VoteMatch = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [match, setMatch] = useState(null);
  const [ratings, setRatings] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchLastMatch = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/matches/last", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError(t("Error fetching the last match"));
        }

        const data = await response.json();
        setMatch(data);

        // Initialize ratings with 1 for all players except the current user
        const initialRatings = {};
        data.players.forEach((playerObj) => {
          if (playerObj.player.userId !== user.id) {
            initialRatings[playerObj.player._id] = "6";
          }
        });
        setRatings(initialRatings);
      } catch (err) {
        setError("Error fetching the last match");
      }
    };

    fetchLastMatch();
  }, [t, user.id]);

  const handleRatingChange = (playerId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [playerId]: rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/matches/${match._id}/vote/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ratings: Object.entries(ratings).map(([player, rating]) => ({
            player,
            rating: Number(rating),
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccess(t("Ratings submitted successfully"));
    } catch (err) {
      setError(err.message);
    }
  };

  if (!match) {
    return <div className="container mt-4">{t("Loading...")}</div>;
  }

  if (!match.players.some((playerObj) => playerObj.player.userId === user.id)) {
    return (
      <div className="container mt-4">
        {t("You didn't participate in this match")}
      </div>
    );
  }

  if (match.ratings.some((rating) => rating.voter === user.id)) {
    return (
      <Card className="container mt-4">
        <Card.Body>
          <Card.Title>{t("You already voted for this match")}</Card.Title>
          <Card.Text>
            {t("Date")}: {new Date(match.date).toLocaleDateString()}
            <br />
            {t("Players")}:{" "}
            {match.players.map((playerObj) => playerObj.player.name).join(", ")}
            <br />
            {t("Result")}: {match.result}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className="container mt-4 unselectable">
      <h2>{t("Vote the players performances")}</h2>
      <Form onSubmit={handleSubmit}>
        {match.players.map(
          (playerObj) =>
            playerObj.player.userId !== user.id && (
              <Form.Group key={playerObj.player._id}>
                <Form.Label>{playerObj.player.name}</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Range
                    min="1"
                    max="10"
                    value={ratings[playerObj.player._id] || 6}
                    onChange={(e) =>
                      handleRatingChange(playerObj.player._id, e.target.value)
                    }
                  />
                  <span className="ms-2">
                    {ratings[playerObj.player._id] || 6}
                  </span>
                </div>
              </Form.Group>
            )
        )}
        <Button type="submit" className="mt-3">
          {t("Submit Votes")}
        </Button>
      </Form>
      {error && (
        <Alert variant="danger" className="mt-3">
          {t(error)}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {t(success)}
        </Alert>
      )}
    </div>
  );
};

export default VoteMatch;
