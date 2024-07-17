// src/components/PlayerStats.js

import React, { useEffect, useState } from "react";

const PlayerStats = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        const token = localStorage.getItem("authToken");

        const response = await fetch("/playerStats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch player statistics");
        }
        const data = await response.json();
        setPlayers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching player statistics:", error);
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, []);

  if (loading) {
    return <div>Loading player statistics...</div>;
  }

  return (
    <div>
      <h2>Players Stats</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            <p>
              {player.name}{" "}
              <img src={player.avatar || "default-avatar.png"} alt="Avatar" />
            </p>
            <p>
              Number of matches: {JSON.stringify(player.stats.matchesPlayed)}
              <b> </b>
              Wins: {JSON.stringify(player.stats.wins)}
              <b> </b>
              Losses: {JSON.stringify(player.stats.losses)}
              <b> </b>
              Goals: {JSON.stringify(player.stats.goals)}
              <b> </b>
              Assists: {JSON.stringify(player.stats.assists)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerStats;
