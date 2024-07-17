// backend/routes/playerStats.js

const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const passport = require("passport");

// GET all players with their statistics
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const players = await Player.find().lean(); // Fetch all players

      // Example: Calculate statistics (you can adjust this logic as per your requirement)
      const playersWithStats = players.map((player) => {
        const { name, avatar, stats /* other player fields */ } = player;
        const statistics = {
          // Implement your statistics calculation logic here
          // Example: Total matches played, win rate, etc.
        };
        return { name, avatar, stats };
      });

      res.json(playersWithStats);
    } catch (error) {
      console.error("Error fetching player statistics:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
