// src/components/LoadMatch.js
import React, { useState } from "react";

const LoadMatch = () => {
  const [date, setDate] = useState("");
  const [players, setPlayers] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        body: JSON.stringify({ date, players, result }),
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
    <div className="load-match-container">
      <div className="load-match-form">
        <h2>Load Match</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="date"
            placeholder="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Players"
            value={players}
            onChange={(e) => setPlayers(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </div>
    </div>
  );
};

export default LoadMatch;
