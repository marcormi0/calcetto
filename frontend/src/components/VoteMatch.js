import React, { useState, useEffect } from "react";
import axios from "axios";

const VoteMatch = ({ matchId }) => {
  const [players, setPlayers] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    axios
      .get(`/api/matches/${matchId}/players`)
      .then((response) => setPlayers(response.data))
      .catch((error) => console.error("Error fetching players:", error));
  }, [matchId]);

  const handleRatingChange = (playerId, rating) => {
    setRatings({ ...ratings, [playerId]: rating });
  };

  const handleSubmit = () => {
    axios
      .post(
        `/api/matches/${matchId}/vote`,
        { ratings },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then((response) => alert("Ratings submitted successfully"))
      .catch((error) => alert("Error submitting ratings:", error));
  };

  return (
    <div className="container">
      <h2>Vote for Players</h2>
      {players.map((player) => (
        <div key={player._id}>
          <span>{player.name}</span>
          <input
            type="number"
            min="1"
            max="10"
            value={ratings[player._id] || ""}
            onChange={(e) => handleRatingChange(player._id, e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Ratings</button>
    </div>
  );
};

export default VoteMatch;
