import React, { useEffect, useState } from "react";
import { Container, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlayerStats.css";

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
    <Container>
      <h2 className="mt-4 mb-3">Players Stats</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Matches Played</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Goals</th>
            <th>Assists</th>
            <th>Performance</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>{player.name}</td>
              <td>{player.stats.matchesPlayed}</td>
              <td>{player.stats.wins}</td>
              <td>{player.stats.losses}</td>
              <td>{player.stats.draws}</td>
              <td>{player.stats.goals}</td>
              <td>{player.stats.assists}</td>
              <td>
                <PerformanceCell player={player} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

const PerformanceCell = ({ player }) => {
  if (!player.performance) {
    return <span>N/A</span>;
  }

  const performanceDisplay = <span>{player.performance.toFixed(2)}</span>;

  if (player.totalRatings < 30) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${player.name}`}>
            Il calcolo della performance di questo giocatore non è ancora
            affidabile in quanto si basa su troppe poche votazioni
          </Tooltip>
        }
      >
        <span>
          {performanceDisplay} <span className="text-warning">?</span>
        </span>
      </OverlayTrigger>
    );
  }

  return performanceDisplay;
};

export default PlayerStats;
