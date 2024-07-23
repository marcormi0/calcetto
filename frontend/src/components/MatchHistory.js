import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MatchHistory.css";

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/matches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();
        data.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort matches by date, latest first
        setMatches(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderGoals = (goals) => {
    return Array(goals)
      .fill()
      .map((_, i) => <i key={i} className="fas fa-futbol goal-icon"></i>);
  };

  const renderTeam = (players, team) => {
    const sortedPlayers = [...players].sort((a, b) => b.goals - a.goals);
    return (
      <div className="team">
        <h5>{team} Team</h5>
        {sortedPlayers.map((playerObj) => (
          <div key={playerObj.player._id} className="player-info">
            <span className="player-name" title={playerObj.player.name}>
              {playerObj.player.name}
            </span>
            <span className="goal-icons">{renderGoals(playerObj.goals)}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mt-4 unselectable">
      <h2 className="mb-4">Match History</h2>
      <ul className="list-group">
        {matches.map((match) => (
          <li key={match._id} className="list-group-item">
            <p>Date: {new Date(match.date).toLocaleDateString()}</p>
            <div className="teams">
              {renderTeam(
                match.players.filter((p) => p.team === "White"),
                "White"
              )}
              {renderTeam(
                match.players.filter((p) => p.team === "Black"),
                "Black"
              )}
            </div>
            <p>Result: {match.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;
