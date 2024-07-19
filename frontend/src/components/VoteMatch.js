import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const VoteMatch = () => {
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
          throw new Error("Failed to fetch the last match");
        }

        const data = await response.json();
        setMatch(data);
      } catch (err) {
        setError("Error fetching the last match");
      }
    };

    fetchLastMatch();
  }, []);

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
            rating,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccess("Ratings submitted successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!match) {
    return <div className="container mt-4">Loading...</div>;
  }

  if (!match.players.some((playerObj) => playerObj.player.userId === user.id)) {
    return (
      <div className="container mt-4">You didn't participate in this match</div>
    );
  }

  if (match.playersWhoVoted.includes(user.id)) {
    return (
      <div className="container mt-4">
        You already voted for this match
        <p>Date: {new Date(match.date).toLocaleDateString()}</p>
        <p>
          Players:{" "}
          {match.players.map((playerObj) => playerObj.player.name).join(", ")}
        </p>
        <p>Result: {match.result}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Vote for your teammates</h2>
      <form onSubmit={handleSubmit}>
        {match.players.map(
          (playerObj) =>
            playerObj.player.userId !== user.id && (
              <div key={playerObj.player._id} className="form-group">
                <label>{playerObj.player.name}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings[playerObj.player._id] || 1}
                  onChange={(e) =>
                    handleRatingChange(playerObj.player._id, e.target.value)
                  }
                  className="form-control-range"
                />
              </div>
            )
        )}
        <button type="submit" className="btn btn-primary mt-3">
          Submit Votes
        </button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">{success}</div>}
    </div>
  );
};

export default VoteMatch;
