import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const VoteMatch = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [match, setMatch] = useState(null);
  const [ratings, setRatings] = useState({});
  const [mvp, setMvp] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLastMatch = useCallback(async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const response = await fetch("/matches/last", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(t("Error fetching the last match"));
      }

      const data = await response.json();
      setMatch(data);

      const initialRatings = {};
      data.players.forEach((playerObj) => {
        if (playerObj.player.userId !== user.id) {
          initialRatings[playerObj.player._id] = 6;
        }
      });
      setRatings(initialRatings);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [t, user.id]);

  useEffect(() => {
    fetchLastMatch();
  }, [fetchLastMatch]);

  const handleRatingChange = (playerId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [playerId]: parseFloat(rating),
    }));
  };

  const handleMvpSelection = (playerId) => {
    setMvp(playerId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!mvp) {
      setError(t("Please select an MVP before submitting"));
      return;
    }

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
          mvp,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccess(t("Ratings and MVP submitted successfully"));
      // Reload the match data to reflect the new state
      await fetchLastMatch();
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="container mt-4">{t("Loading...")}</div>;
  }

  if (!match) {
    return <div className="container mt-4">{t("No match data available")}</div>;
  }

  if (!match.players.some((playerObj) => playerObj.player.userId === user.id)) {
    return (
      <Card className="container mt-4">
        <Card.Body>
          <Card.Title>{t("You didn't participate in this match")}</Card.Title>
          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
          <Card.Text>
            {t("Date")}: {new Date(match.date).toLocaleDateString()}
            <br />
            {t("Players")}:{" "}
            {match.players.map((playerObj) => (
              <span
                key={playerObj.player._id}
                className={
                  match.ratings.some(
                    (rating) => rating.voter === playerObj.player.userId
                  )
                    ? "text-success"
                    : ""
                }
              >
                {playerObj.player.name}
                {playerObj !== match.players[match.players.length - 1] && ", "}
              </span>
            ))}
            <br />
            {t("Result")}: {match.result}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  const hasUserVoted = match.ratings.some((rating) => rating.voter === user.id);

  if (hasUserVoted || success) {
    return (
      <Card className="container mt-4">
        <Card.Body>
          <Card.Title>
            {success
              ? t("Vote Submitted Successfully")
              : t("You already voted for this match")}
          </Card.Title>
          {success && (
            <Alert variant="success" className="mt-3">
              {success}
            </Alert>
          )}
          <Card.Text>
            {t("Date")}: {new Date(match.date).toLocaleDateString()}
            <br />
            {t("Players")}:{" "}
            {match.players.map((playerObj) => (
              <span
                key={playerObj.player._id}
                className={
                  match.ratings.some(
                    (rating) => rating.voter === playerObj.player.userId
                  )
                    ? "text-success"
                    : ""
                }
              >
                {playerObj.player.name}
                {playerObj !== match.players[match.players.length - 1] && ", "}
              </span>
            ))}
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
              <Form.Group key={playerObj.player._id} className="mb-3">
                <Form.Label>{playerObj.player.name}</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Range
                    min="1"
                    max="10"
                    step="0.5"
                    value={ratings[playerObj.player._id] || 6}
                    onChange={(e) =>
                      handleRatingChange(playerObj.player._id, e.target.value)
                    }
                  />
                  <span className="ms-2">
                    {ratings[playerObj.player._id] || 6}
                  </span>
                  <Button
                    variant={
                      mvp === playerObj.player._id
                        ? "primary"
                        : "outline-primary"
                    }
                    size="sm"
                    className="ms-3"
                    onClick={() => handleMvpSelection(playerObj.player._id)}
                  >
                    {t("MVP")}
                  </Button>
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
    </div>
  );
};

export default VoteMatch;
