// backend/routes/player.js
const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const passport = require("passport");

// Link a player to a user
router.get(
  "/unlinked",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log("Unlinked route hit");
    try {
      const players = await Player.find({ isLinked: false });
      if (!players || players.length === 0) {
        return res.status(404).json({ message: "No unlinked players found" });
      }
      const playersData = players.map((player) => {
        const { _id, name, avatar } = player;
        return { _id, name, avatar };
      });
      res.json(playersData);
    } catch (error) {
      console.error("Error in /unlinked route:", error);
      res
        .status(500)
        .json({ message: "Server error", error: error.toString() });
    }
  }
);

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

// Get all players ids
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const players = await Player.find({});
      if (!players) {
        return res.status(404).json({ message: "No players found" });
      }
      const playersIds = players.map((player) => {
        const { _id, userId, name } = player;
        return { _id, userId, name };
      });

      res.json(playersIds);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Create or update a player
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { name, avatar } = req.body;
    const userId = req.user.id;

    try {
      let player = await Player.findOne({ userId });

      if (player) {
        // Player exists, update their information
        player.name = name;
        player.avatar = avatar;
        await player.save();
        return res.json(player);
      } else {
        // Player doesn't exist, create a new one
        const newPlayer = new Player({
          userId,
          isLinked: true,
          name,
          avatar,
        });

        await newPlayer.save();
        return res.status(201).json(newPlayer);
      }
    } catch (error) {
      console.error("Error creating/updating player:", error);
      res
        .status(500)
        .json({ message: "Server error", error: error.toString() });
    }
  }
);

router.put(
  "/:playerId/link",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.body;

      // Check if the player exists
      const player = await Player.findById(req.params.playerId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }

      // Check if the player is already linked
      if (player.isLinked) {
        return res
          .status(400)
          .json({ message: "Player is already linked to a user" });
      }

      // Update the player's userId and set isLinked to true
      player.userId = userId;
      player.isLinked = true;
      await player.save();

      res.json(player);
    } catch (error) {
      console.error("Error linking player:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
