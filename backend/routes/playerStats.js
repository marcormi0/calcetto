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
          const playerMatches = matches.filter((match) =>
            match.players.some(
              (p) => p.player.toString() === player._id.toString()
            )
          );

          // Calculate wins, losses, draws, goals, assists
          const stats = {
            matchesPlayed: playerMatches.length,
            wins: 0,
            losses: 0,
            draws: 0,
            goals: 0,
            assists: 0,
            mvpCount: 0,
          };

          playerMatches.forEach((match) => {
            const playerData = match.players.find(
              (p) => p.player.toString() === player._id.toString()
            );

            // Update goals
            stats.goals += playerData.goals || 0;
            // Update assists
            stats.assists += playerData.assists || 0;

            const [whiteScore, blackScore] = match.result
              .split("-")
              .map(Number);

            // Determine win/loss/draw based on the player's team and the result
            if (playerData.team === "White") {
              if (whiteScore > blackScore) {
                stats.wins++;
              } else if (whiteScore < blackScore) {
                stats.losses++;
              } else {
                stats.draws++;
              }
            } else if (playerData.team === "Black") {
              if (blackScore > whiteScore) {
                stats.wins++;
              } else if (blackScore < whiteScore) {
                stats.losses++;
              } else {
                stats.draws++;
              }
            }

            // Count MVP selections for this player
            if (
              match.ratings.some(
                (ratingGroup) => ratingGroup.mvp === player._id
              )
            ) {
              stats.mvpCount++;
            }
          });

          // Get all ratings for this player
          const allRatings = playerMatches.flatMap((match) =>
            match.ratings.flatMap((ratingGroup) =>
              ratingGroup.ratings
                .filter((r) => r.player.toString() === player._id.toString())
                .map((r) => r.rating)
            )
          );

          const totalRatings = allRatings.length;
          const performance = calculatePerformance(allRatings, stats); // Updated to remove direct reliance on stored stats

          return {
            name: player.name,
            avatar: player.avatar,
            stats, // Newly calculated stats
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
