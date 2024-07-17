// src/App.js
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Home from "./components/Home";
import MatchHistory from "./components/MatchHistory";
import Profile from "./components/Profile";
import PlayerStats from "./components/PlayerStats";
import VoteMatch from "./components/VoteMatch";
import Register from "./components/Register";
import Login from "./components/Login";
import LoadMatch from "./components/LoadMatch"; // Import LoadMatch component
import { AuthContext } from "./context/AuthContext";
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
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/match-history"
            element={
              isAuthenticated ? <MatchHistory /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route
            path="/player-stats"
            element={
              isAuthenticated ? <PlayerStats /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/vote-match"
            element={isAuthenticated ? <VoteMatch /> : <Navigate to="/login" />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {role === "admin" && (
            <Route
              path="/load-match"
              element={
                isAuthenticated ? <LoadMatch /> : <Navigate to="/login" />
              }
            />
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
