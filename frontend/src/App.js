import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import MatchHistory from "./components/MatchHistory";
import Profile from "./components/Profile";
import PlayerStats from "./components/PlayerStats";
import VoteMatch from "./components/VoteMatch";
import Login from "./components/Login";
import LoadMatch from "./components/LoadMatch";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

const App = () => {
  const { isAuthenticated, role } = useContext(AuthContext);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              {isAuthenticated ? (
                <>
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
                </>
              ) : (
                <>
                  <li>
                    <Link to="/auth">Login / Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <Routes>
          <Route
            path="/match-history"
            element={
              isAuthenticated ? <MatchHistory /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />}
          />
          <Route
            path="/player-stats"
            element={
              isAuthenticated ? <PlayerStats /> : <Navigate to="/auth" />
            }
          />
          <Route
            path="/vote-match"
            element={isAuthenticated ? <VoteMatch /> : <Navigate to="/auth" />}
          />
          <Route
            path="/load-match"
            element={
              isAuthenticated && role === "admin" ? (
                <LoadMatch />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/auth" element={<Login />} />
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/auth" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
