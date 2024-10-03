// src/components/GenerateTeams.js
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "bootstrap/dist/css/bootstrap.min.css";
import "./GenerateTeams.css";

const GenerateTeams = () => {
  const { t } = useTranslation();
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState("");
  const [teams, setTeams] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/playerStats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }
        const data = await response.json();
        setPlayers(data);
      } catch (err) {
        console.error("Error fetching players:", err);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerClick = (playerName) => {
    let updatedPlayers = [...selectedPlayers];
    if (updatedPlayers.includes(playerName)) {
      updatedPlayers = updatedPlayers.filter((name) => name !== playerName);
    } else {
      if (updatedPlayers.length < 10) {
        updatedPlayers.push(playerName);
      } else {
        setError("You can select up to 10 players only.");
        setTimeout(() => setError(""), 3000);
      }
    }
    setSelectedPlayers(updatedPlayers);
  };

  const generateTeams = (playersToUse = selectedPlayers) => {
    if (playersToUse.length !== 10) {
      setError("You must select exactly 10 players.");
      return;
    }

    const selectedPlayerObjects = playersToUse.map((name) =>
      players.find((player) => player.name === name)
    );

    // Shuffle the players first
    const shuffledPlayers = [...selectedPlayerObjects].sort(
      () => Math.random() - 0.5
    );

    const team1 = [];
    const team2 = [];
    let team1Performance = 0;
    let team2Performance = 0;

    // Distribute players to teams, ensuring 5 players per team
    shuffledPlayers.forEach((player, index) => {
      if (index % 2 === 0) {
        team1.push(player);
        team1Performance += player.performance;
      } else {
        team2.push(player);
        team2Performance += player.performance;
      }
    });

    // Try to balance teams by swapping players
    const balanceTeams = () => {
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          const team1PlayerPerformance = team1[i].performance;
          const team2PlayerPerformance = team2[j].performance;
          const currentDifference = Math.abs(
            team1Performance - team2Performance
          );
          const newDifference = Math.abs(
            team1Performance -
              team1PlayerPerformance +
              team2PlayerPerformance -
              (team2Performance -
                team2PlayerPerformance +
                team1PlayerPerformance)
          );
          if (newDifference < currentDifference) {
            // Swap players
            const temp = team1[i];
            team1[i] = team2[j];
            team2[j] = temp;
            team1Performance =
              team1Performance -
              team1PlayerPerformance +
              team2PlayerPerformance;
            team2Performance =
              team2Performance -
              team2PlayerPerformance +
              team1PlayerPerformance;
            return true; // Made a swap
          }
        }
      }
      return false; // No swap made
    };

    // Try to balance a few times
    for (let i = 0; i < 1; i++) {
      if (!balanceTeams()) break;
    }

    // Shuffle the order within each team
    const shuffleTeam = (team) => {
      for (let i = team.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [team[i], team[j]] = [team[j], team[i]];
      }
    };

    shuffleTeam(team1);
    shuffleTeam(team2);

    setTeams({
      team1: { players: team1, totalPerformance: team1Performance },
      team2: { players: team2, totalPerformance: team2Performance },
    });
  };

  const resetTeams = () => {
    setTeams(null);
    setSelectedPlayers([]);
  };

  const reshuffleTeams = () => {
    generateTeams(
      teams.team1.players
        .concat(teams.team2.players)
        .map((player) => player.name)
    );
  };

  if (teams) {
    return (
      <div className="container mt-4">
        <h2>{t("Generated Teams")}</h2>
        <div className="row">
          <div className="col-md-6">
            <h3>
              {t("Team 1")} ({t("Total Performance:")}{" "}
              {teams.team1.totalPerformance.toFixed(2)})
            </h3>
            <ul className="list-group">
              {teams.team1.players.map((player) => (
                <li key={player.name} className="list-group-item">
                  {player.name} (Performance:{" "}
                  {player.performance?.toFixed(2) || "N/A"})
                </li>
              ))}
            </ul>
          </div>
          <div className="col-md-6">
            <h3>
              {t("Team 2")} ({t("Total Performance:")}{" "}
              {teams.team2.totalPerformance.toFixed(2)})
            </h3>
            <ul className="list-group">
              {teams.team2.players.map((player) => (
                <li key={player.name} className="list-group-item">
                  {player.name} (Performance:{" "}
                  {player.performance?.toFixed(2) || "N/A"})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <div className="mt-3">
            <button className="btn btn-primary me-3" onClick={resetTeams}>
              {t("Generate New Teams")}
            </button>
            <button className="btn btn-secondary" onClick={reshuffleTeams}>
              {t("Reshuffle")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 unselectable">
      <h2>{t("Generate Teams")}</h2>
      <div className="form-group">
        <label>{t("Players")}</label>
        <div className="list-group">
          {players.map((player) => (
            <div
              key={player.name}
              className={`list-group-item d-flex ${
                selectedPlayers.includes(player.name) ? "active" : ""
              }`}
              onClick={() => handlePlayerClick(player.name)}
              style={{ cursor: "pointer" }}
            >
              {player.name} (Performance:{" "}
              {player.performance?.toFixed(2) || "N/A"})
            </div>
          ))}
        </div>
      </div>
      <button
        className="btn btn-primary mt-3"
        onClick={() => generateTeams()}
        disabled={selectedPlayers.length !== 10}
      >
        {t("Generate Teams")}
      </button>
      {error && <div className="alert alert-danger mt-3">{t(error)}</div>}
    </div>
  );
};

export default GenerateTeams;
