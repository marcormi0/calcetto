// src/App.js
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import MatchHistory from "./components/MatchHistory";
import Profile from "./components/Profile";
import PlayerStats from "./components/PlayerStats";
import VoteMatch from "./components/VoteMatch";
import LoadMatch from "./components/LoadMatch"; // New Component
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthContext } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <header className="App-header">
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/match-history">Match History</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/player-stats">Player Stats</Link>
                </li>
                <li>
                  <Link to="/vote-match">Vote Match</Link>
                </li>
                {role === "admin" && (
                  <li>
                    <Link to="/load-match">Load Match</Link>
                  </li>
                )}
              </ul>
            </nav>
          </header>
        )}
        <Routes>
          <Route
            path="/match-history"
            element={<PrivateRoute component={MatchHistory} />}
          />
          <Route
            path="/profile"
            element={<PrivateRoute component={Profile} />}
          />
          <Route
            path="/player-stats"
            element={<PrivateRoute component={PlayerStats} />}
          />
          <Route
            path="/vote-match"
            element={<PrivateRoute component={VoteMatch} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/load-match"
            element={<PrivateRoute component={LoadMatch} role="admin" />}
          />
          <Route path="/" element={<PrivateRoute component={Home} />} />
          <Route path="*" element={<Login />} /> {/* Fallback route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
