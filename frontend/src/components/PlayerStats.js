import React, { useEffect, useState } from "react";
import { Container, Table, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlayerStats.css";

const PlayerStats = () => {
  const { t } = useTranslation();
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
          throw new Error(t("Failed to fetch player statistics"));
        }
        const data = await response.json();

        // Sort players by the criteria: matchesPlayed -> wins -> performance -> goals
        data.sort((a, b) => {
          if (a.stats.matchesPlayed !== b.stats.matchesPlayed) {
            return b.stats.matchesPlayed - a.stats.matchesPlayed;
          }
          if (a.stats.wins !== b.stats.wins) {
            return b.stats.wins - a.stats.wins;
          }
          if (a.performance !== b.performance) {
            return b.performance - a.performance;
          }
          return b.stats.goals - a.stats.goals;
        });

        setPlayers(data);
        setLoading(false);
      } catch (error) {
        console.error(t("Error fetching player statistics"), error);
        setLoading(false);
      }
    };

    fetchPlayerStats();
  }, [t]);

  if (loading) {
    return <div>{t("Loading player statistics...")}</div>;
  }

  return (
    <Container className="unselectable">
      <h2 className="mt-4 mb-3">{t("Player Stats")}</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>{t("Name")}</th>
            <th>{t("Matches Played")}</th>
            <th>{t("Wins")}</th>
            <th>{t("Losses")}</th>
            <th>{t("Draws")}</th>
            <th>{t("Goals")}</th>
            <th>{t("Assists")}</th>
            <th>{t("Performance")}</th>
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
  const { t } = useTranslation();

  if (!player.performance) {
    return <span>{t("N/A")}</span>;
  }

  const performanceDisplay = <span>{player.performance.toFixed(2)}</span>;

  if (player.totalRatings < 30) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id={`tooltip-${player.name}`}>
            {t(
              "The performance calculation for this player is not yet reliable as it is based on too few ratings."
            )}
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
