// src/components/MatchHistory.js
import React, { useState, useEffect } from "react";

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

  return (
    <div className="match-history">
      <h2>Match History</h2>
      <ul>
        {matches.map((match) => (
          <li key={match._id}>
            <p>Date: {new Date(match.date).toLocaleDateString()}</p>
            <p>
              Players:{" "}
              {match.players
                .map((playerObj) => playerObj.player.name)
                .join(", ")}
            </p>
            <p>Result: {match.result}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;
