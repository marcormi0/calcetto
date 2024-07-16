import React, { useState } from "react";

const LoadMatch = () => {
  const [date, setDate] = useState("");
  const [players, setPlayers] = useState("");
  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/load-match", {
        // Make sure the URL points to your backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("authToken"),
        },
        body: JSON.stringify({ date, players, result }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMessage("Match information loaded successfully");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Load Match</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <textarea
          placeholder="Players (comma-separated)"
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoadMatch;
