import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlayerStats.css"; // Import the custom CSS file

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
    <div className="container mt-4 unselectable">
      <h2 className="mb-4">Players Stats</h2>
      <div className="row">
        {players.map((player, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <div className="text-center">
                  <img
                    src={player.avatar || "default-avatar.png"}
                    alt="Avatar"
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: "100px", height: "100px" }}
                  />
                  <h5 className="card-title">{player.name}</h5>
                </div>
                <p className="card-text">
                  <strong>Matches Played:</strong> {player.stats.matchesPlayed}
                </p>
                <p className="card-text">
                  <strong>Wins:</strong> {player.stats.wins}
                </p>
                <p className="card-text">
                  <strong>Losses:</strong> {player.stats.losses}
                </p>
                <p className="card-text">
                  <strong>Draws:</strong> {player.stats.draws}
                </p>
                <p className="card-text">
                  <strong>Goals:</strong> {player.stats.goals}
                </p>
                <p className="card-text">
                  <strong>Assists:</strong> {player.stats.assists}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerStats;
