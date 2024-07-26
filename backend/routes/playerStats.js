// backend/routes/playerStats.js

const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Match = require("../models/Match");
const passport = require("passport");
const calculatePerformance = require("../utils/calculatePerformance");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (_req, res) => {
    try {
      const players = await Player.find().lean();
      const matches = await Match.find().lean();

      const playersWithStats = await Promise.all(
        players.map(async (player) => {
          const { name, avatar, stats } = player;

          // Get all ratings for this player
          const allRatings = matches.flatMap((match) =>
            match.ratings.flatMap((ratingGroup) =>
              ratingGroup.ratings
                .filter((r) => r.player.toString() === player._id.toString())
                .map((r) => r.rating)
            )
          );

          const performance = calculatePerformance(allRatings, stats);
          const totalRatings = allRatings.length;

          return {
            name,
            avatar,
            stats,
            performance,
            totalRatings,
          };
        })
      );

      res.json(playersWithStats);
    } catch (error) {
      console.error("Error fetching player statistics:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
