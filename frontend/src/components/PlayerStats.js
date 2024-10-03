import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  OverlayTrigger,
  Tooltip,
  Popover,
  Form,
  Button,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PlayerStats.css";

const PlayerStats = () => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason());
  const [highestMvpCount, setHighestMvpCount] = useState(0);
  const [mvpTie, setMvpTie] = useState(false);

  const seasons = [
    { value: "all", label: t("All Seasons") },
    { value: "2023-2024", label: "2023-2024" },
    { value: "2024-2025", label: "2024-2025" },
  ];

  function getCurrentSeason() {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    return currentMonth >= 9
      ? `${currentYear}-${currentYear + 1}`
      : `${currentYear - 1}-${currentYear}`;
  }

  useEffect(() => {
    if (players.length > 0) {
      const mvpCounts = players.map((player) => player.stats.mvpCount || 0);
      const maxMvp = Math.max(...mvpCounts);
      setHighestMvpCount(maxMvp);
      setMvpTie(mvpCounts.filter((count) => count === maxMvp).length > 1);
    }
  }, [players]);

  useEffect(() => {
    const fetchPlayerStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
        const response = await fetch(`/playerStats?season=${selectedSeason}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(t("Failed to fetch player statistics"));
        }
        const data = await response.json();

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
          if (a.stats.mvpCount !== b.stats.mvpCount) {
            return b.stats.mvpCount - a.stats.mvpCount;
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
  }, [t, selectedSeason]);

  const handleSeasonChange = (event) => {
    setSelectedSeason(event.target.value);
  };

  if (loading) {
    return <div>{t("Loading player statistics...")}</div>;
  }

  return (
    <Container className="unselectable">
      <h2 className="mt-4 mb-3">{t("Player Stats")}</h2>
      <Form.Group className="mb-3">
        <Form.Label>{t("Select Season")}</Form.Label>
        <Form.Select value={selectedSeason} onChange={handleSeasonChange}>
          {seasons.map((season) => (
            <option key={season.value} value={season.value}>
              {season.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
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
            <th>{t("MVP")}</th>
            <th>{t("Performance")}</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr key={index}>
              <td>
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="top"
                  overlay={
                    <Popover id={`popover-${player.name}`}>
                      <Popover.Body>
                        <AvatarTooltip
                          player={player}
                          isMvp={
                            player.stats.mvpCount === highestMvpCount &&
                            highestMvpCount > 0
                          }
                          mvpTie={mvpTie}
                        />{" "}
                      </Popover.Body>
                    </Popover>
                  }
                >
                  <span>{player.name}</span>
                </OverlayTrigger>
              </td>
              <td>{player.stats.matchesPlayed}</td>
              <td>{player.stats.wins}</td>
              <td>{player.stats.losses}</td>
              <td>{player.stats.draws}</td>
              <td>{player.stats.goals}</td>
              <td>{player.stats.assists}</td>
              <td>{player.stats.mvpCount || 0}</td>
              <td className="text-center">
                <PerformanceCell player={player} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

// Popover Component for Avatar Preview
const AvatarTooltip = ({ player, isMvp, mvpTie }) => {
  const { t } = useTranslation();

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
        }}
      >
        {player.flag && (
          <img
            src={player.flag}
            alt="Flag"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
            }}
          />
        )}
        <img
          src={player.avatar || "avatars/default-avatar.png"}
          alt="Avatar"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 2,
          }}
        />
        {player.accessories &&
          player.accessories.map((accSrc, index) => (
            <img
              key={index}
              src={accSrc}
              alt="Accessory"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                zIndex: 3,
              }}
            />
          ))}
      </div>
      {isMvp && !mvpTie && (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id={`tooltip-mvp-${player.name}`}>{t("MVP")}</Tooltip>
          }
        >
          <img
            src={"accessories/mvp.png"}
            alt="MVP"
            style={{
              width: "40%",
              height: "40%",
              position: "absolute",
              right: "-15px",
              top: "-15px",
              zIndex: 4,
            }}
          />
        </OverlayTrigger>
      )}
    </div>
  );
};

const PerformanceCell = ({ player }) => {
  const { t } = useTranslation();

  if (!player.performance) {
    return <span>{t("N/A")}</span>;
  }

  const performanceDisplay = <span>{player.performance.toFixed(2)}</span>;
  const voteAverage = (player.voteSum / player.totalRatings).toFixed(2);

  const infoTooltip = (
    <Tooltip id={`tooltip-${player.name}-info`}>
      {t("Average vote: {{voteAverage}}", { voteAverage })}
    </Tooltip>
  );

  return (
    <div className="d-flex justify-content-center align-items-center">
      {performanceDisplay}
      {player.totalRatings < 30 && (
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
          <span className="ms-1 text-warning">?</span>
        </OverlayTrigger>
      )}
      <OverlayTrigger placement="top" overlay={infoTooltip}>
        <Button variant="link" className="p-0 ms-2" style={{ lineHeight: 1 }}>
          <Info size={16} />
        </Button>
      </OverlayTrigger>
    </div>
  );
};

export default PlayerStats;
