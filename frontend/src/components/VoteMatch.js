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
    return <div>Loading...</div>;
  }

  if (!match.players.some((player) => player.userId === user.id)) {
    return <div>You didn't participate in this match</div>;
  }

  return (
    <div className="vote-container">
      <h2>Vote for your teammates</h2>
      <form onSubmit={handleSubmit}>
        {match.players.map(
          (player) =>
            player.userId !== user.id && (
              <div key={player._id}>
                <label>{player.name}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={ratings[player._id] || 1}
                  onChange={(e) =>
                    handleRatingChange(player._id, e.target.value)
                  }
                />
              </div>
            )
        )}
        <button type="submit">Submit Votes</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
};

export default VoteMatch;
