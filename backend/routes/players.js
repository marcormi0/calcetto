// backend/routes/player.js
const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const passport = require("passport");

// Get player by userId
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const player = await Player.findOne({ userId: req.params.userId });
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create a new player
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    try {
      const existingPlayer = await Player.findOne({ userId });
      if (existingPlayer) {
        return res.status(400).json({ message: "Player already exists" });
      }

      const newPlayer = new Player({
        userId,
        name,
        avatar,
      });

      await newPlayer.save();
      res.status(201).json(newPlayer);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
