// src/components/LoadMatch.js
import React, { useState, useEffect } from "react";

const LoadMatch = () => {
  const [date, setDate] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [players, setPlayers] = useState([]);

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

  const handlePlayerChange = (e) => {
    const value = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedPlayers(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/load-match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({ date, players: selectedPlayers, result }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setSuccess("Match information loaded successfully");
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
            <select
              multiple
              value={selectedPlayers}
              onChange={handlePlayerChange}
              className="form-control"
              required
            >
              {players.map((player) => (
                <option key={player.userId} value={player.userId}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Result</label>
            <input
              type="text"
              placeholder="Result"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">Submit</button>
        </form>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}
      </div>
    </div>
  );
};

export default LoadMatch;
