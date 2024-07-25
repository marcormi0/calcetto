import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoadMatch.css";

const LoadMatch = () => {
  const [date, setDate] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState({});
  const [goals, setGoals] = useState({});

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/players", {
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

  const handlePlayerClick = (playerId, team) => {
    let updatedPlayers = [...selectedPlayers];
    if (updatedPlayers.includes(playerId)) {
      updatedPlayers = updatedPlayers.filter((id) => id !== playerId);
      const updatedTeams = { ...teams };
      delete updatedTeams[playerId];
      setTeams(updatedTeams);
    } else {
      if (updatedPlayers.length < 10) {
        updatedPlayers.push(playerId);
        setTeams({
          ...teams,
          [playerId]: team,
        });
      } else {
        setError("You can select up to 10 players only.");
        setTimeout(() => setError(""), 3000);
      }
    }
    setSelectedPlayers(updatedPlayers);
  };

  const handleGoalsChange = (playerId, increment) => {
    setGoals((prevGoals) => ({
      ...prevGoals,
      [playerId]: (prevGoals[playerId] || 0) + increment,
    }));
  };

  const calculateResult = () => {
    let whiteTeamGoals = 0;
    let blackTeamGoals = 0;

    selectedPlayers.forEach((playerId) => {
      const playerGoals = goals[playerId] || 0;
      if (teams[playerId] === "White") {
        whiteTeamGoals += playerGoals;
      } else if (teams[playerId] === "Black") {
        blackTeamGoals += playerGoals;
      }
    });

    return `${whiteTeamGoals}-${blackTeamGoals}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (selectedPlayers.length !== 10) {
      setError("You must select exactly 10 players.");
      return;
    }

    const players = selectedPlayers.map((player) => ({
      player,
      team: teams[player],
      goals: goals[player] || 0,
    }));

    const result = calculateResult();

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/matches/load-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          date,
          players,
          result,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccess("Match information loaded successfully");
      setDate("");
      setSelectedPlayers([]);
      setTeams({});
      setGoals({});
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="load-match-form">
        <h2>Load Match</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              placeholder="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Players</label>
            <div className="list-group">
              {players.map((player) => (
                <div
                  key={player._id}
                  className={`list-group-item d-flex ${
                    selectedPlayers.includes(player._id) ? "active" : ""
                  }`}
                >
                  <div
                    className={`flex-fill text-center p-2 team-white ${
                      teams[player._id] === "White" ? "selected-white" : ""
                    }`}
                    onClick={() => handlePlayerClick(player._id, "White")}
                    style={{ cursor: "pointer" }}
                  >
                    {player.name} (White)
                  </div>
                  <div
                    className={`flex-fill text-center p-2 team-black ${
                      teams[player._id] === "Black" ? "selected-black" : ""
                    }`}
                    onClick={() => handlePlayerClick(player._id, "Black")}
                    style={{ cursor: "pointer" }}
                  >
                    {player.name} (Black)
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleGoalsChange(player._id, -1)}
                      disabled={
                        !selectedPlayers.includes(player._id) ||
                        (goals[player._id] || 0) <= 0
                      }
                    >
                      -
                    </button>
                    <span className="mx-2">{goals[player._id] || 0}</span>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleGoalsChange(player._id, 1)}
                      disabled={!selectedPlayers.includes(player._id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Result: {calculateResult()}</label>
          </div>
          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={selectedPlayers.length !== 10}
          >
            Submit
          </button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </div>
    </div>
  );
};

export default LoadMatch;
