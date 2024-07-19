// src/components/MatchHistory.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MatchHistory.css"; // Import the custom CSS file

const MatchHistory = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch("/matches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();
        setMatches(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mt-4 unselectable">
      <h2 className="mb-4">Match History</h2>
      {matches.map((match) => (
        <div key={match._id} className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">
              Date: {new Date(match.date).toLocaleDateString()}
            </h5>
            <div className="row">
              <div className="col-md-6">
                <h6>White Team</h6>
                <ul className="list-group">
                  {match.players
                    .filter((playerObj) => playerObj.team === "White")
                    .map((playerObj) => (
                      <li
                        key={playerObj.player._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {playerObj.player.name}
                        <span className="badge badge-pill goals-badge">
                          {playerObj.goals} goals
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h6>Black Team</h6>
                <ul className="list-group">
                  {match.players
                    .filter((playerObj) => playerObj.team === "Black")
                    .map((playerObj) => (
                      <li
                        key={playerObj.player._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {playerObj.player.name}
                        <span className="badge badge-pill goals-badge">
                          {playerObj.goals} goals
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <p className="mt-3">
              <strong>Result:</strong> {match.result}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
