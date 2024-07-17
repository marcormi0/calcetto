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
      <h2>Player Statistics</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            <div>Name: {player.name}</div>
            <div>
              Avatar: <img src={player.avatar} alt="Avatar" />
            </div>
            <div>Statistics: {JSON.stringify(player.statistics)}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayerStats;
