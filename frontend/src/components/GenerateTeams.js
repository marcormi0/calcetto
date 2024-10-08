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
  const [selectedForSwap, setSelectedForSwap] = useState([]);

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

  const handlePlayerSwapSelection = (player, teamIndex) => {
    setSelectedForSwap((prev) => {
      const newSelection = [...prev];
      const existingIndex = newSelection.findIndex(
        (p) => p.player.name === player.name
      );

      if (existingIndex !== -1) {
        // If player is already selected, remove them
        newSelection.splice(existingIndex, 1);
      } else if (newSelection.length < 2) {
        // If less than 2 players are selected, add this player
        newSelection.push({ player, teamIndex });
      } else {
        // If 2 players are already selected, replace the player from the same team
        const sameTeamIndex = newSelection.findIndex(
          (p) => p.teamIndex === teamIndex
        );
        if (sameTeamIndex !== -1) {
          newSelection[sameTeamIndex] = { player, teamIndex };
        }
        // If no player from the same team is selected, do nothing
      }

      return newSelection;
    });
  };

  const swapPlayers = () => {
    if (selectedForSwap.length !== 2) {
      setError("Please select one player from each team to swap.");
      return;
    }

    setTeams((prevTeams) => {
      const newTeams = JSON.parse(JSON.stringify(prevTeams)); // Deep copy

      selectedForSwap.forEach(({ player, teamIndex }) => {
        const sourceTeam = teamIndex === 0 ? "team1" : "team2";
        const targetTeam = teamIndex === 0 ? "team2" : "team1";

        const sourceIndex = newTeams[sourceTeam].players.findIndex(
          (p) => p.name === player.name
        );
        const targetIndex = newTeams[targetTeam].players.findIndex(
          (p) =>
            p.name ===
            selectedForSwap.find((sp) => sp.teamIndex !== teamIndex).player.name
        );

        // Swap players
        [
          newTeams[sourceTeam].players[sourceIndex],
          newTeams[targetTeam].players[targetIndex],
        ] = [
          newTeams[targetTeam].players[targetIndex],
          newTeams[sourceTeam].players[sourceIndex],
        ];
      });

      // Recalculate total performance
      newTeams.team1.totalPerformance = newTeams.team1.players.reduce(
        (sum, player) => sum + player.performance,
        0
      );
      newTeams.team2.totalPerformance = newTeams.team2.players.reduce(
        (sum, player) => sum + player.performance,
        0
      );

      return newTeams;
    });

    setSelectedForSwap([]);
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
                <li
                  key={player.name}
                  className={`list-group-item ${
                    selectedForSwap.some(
                      (p) => p.player.name === player.name && p.teamIndex === 0
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handlePlayerSwapSelection(player, 0)}
                  style={{ cursor: "pointer" }}
                >
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
                <li
                  key={player.name}
                  className={`list-group-item ${
                    selectedForSwap.some(
                      (p) => p.player.name === player.name && p.teamIndex === 1
                    )
                      ? "active"
                      : ""
                  }`}
                  onClick={() => handlePlayerSwapSelection(player, 1)}
                  style={{ cursor: "pointer" }}
                >
                  {player.name} (Performance:{" "}
                  {player.performance?.toFixed(2) || "N/A"})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-primary me-3" onClick={resetTeams}>
            {t("Generate New Teams")}
          </button>
          <button className="btn btn-secondary me-3" onClick={reshuffleTeams}>
            {t("Reshuffle")}
          </button>
          <button
            className="btn btn-warning"
            onClick={swapPlayers}
            disabled={selectedForSwap.length !== 2}
          >
            {t("Swap Players")}
          </button>
        </div>
        {error && <div className="alert alert-danger mt-3">{t(error)}</div>}
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
