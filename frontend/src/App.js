import React, { useContext, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Home from "./components/Home";
import MatchHistory from "./components/MatchHistory";
import Profile from "./components/profile/Profile";
import PlayerStats from "./components/PlayerStats";
import VoteMatch from "./components/VoteMatch";
import Register from "./components/Register";
import Login from "./components/Login";
import LoadMatch from "./components/LoadMatch";
import GenerateTeams from "./components/GenerateTeams";
import LanguageSelector from "./components/LanguageSelector";
import { AuthContext } from "./context/AuthContext";
import "./App.css";

function App() {
  const { isAuthenticated, role } = useContext(AuthContext);
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const NavLinks = () => (
    <>
      <li>
        <Link to="/" onClick={toggleMenu}>
          {t("Home")}
        </Link>
      </li>
      <li>
        <Link to="/match-history" onClick={toggleMenu}>
          {t("Match History")}
        </Link>
      </li>
      <li>
        <Link to="/profile" onClick={toggleMenu}>
          {t("Profile")}
        </Link>
      </li>
      <li>
        <Link to="/player-stats" onClick={toggleMenu}>
          {t("Player Stats")}
        </Link>
      </li>
      <li>
        <Link to="/vote-match" onClick={toggleMenu}>
          {t("Vote Match")}
        </Link>
      </li>
      <li>
        <Link to="/generate-teams" onClick={toggleMenu}>
          {t("Generate Teams")}
        </Link>
      </li>
      {role === "admin" && (
        <li>
          <Link to="/load-match" onClick={toggleMenu}>
            {t("Load Match")}
          </Link>
        </li>
      )}
    </>
  );

  return (
    <Router>
      <div className="App unselectable">
        {isAuthenticated && (
          <header className="App-header">
            <nav className="navbar">
              <div className="navbar-container">
                <div className="menu-icon" onClick={toggleMenu}>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
                <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                  <NavLinks />
                </ul>
                <div className="language-selector-container">
                  <LanguageSelector />
                </div>
              </div>
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
          <Route
            path="/generate-teams"
            element={
              isAuthenticated ? <GenerateTeams /> : <Navigate to="/login" />
            }
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
