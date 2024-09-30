// backend/routes/playerStats.js
const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Match = require("../models/Match");
const User = require("../models/User");
const passport = require("passport");
const calculatePerformance = require("../utils/calculatePerformance");

function getCurrentSeason() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed

  // Assuming the season starts in September
  if (currentMonth >= 9) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
}

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { userId } = req.params;
      const { season = getCurrentSeason() } = req.query;

      // Find the player associated with the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const player = await Player.findOne({ userId: userId }).lean();
      if (!player) {
        return res
          .status(404)
          .json({ message: "Player not found for this user" });
      }

      let matchQuery = { "players.player": player._id };
      if (season && season !== "all") {
        const [startYear, endYear] = season.split("-");
        const startDate = new Date(`${startYear}-09-01`);
        const endDate = new Date(`${endYear}-08-31`);
        matchQuery.date = { $gte: startDate, $lte: endDate };
      }

      const matches = await Match.find(matchQuery).lean();

      const stats = {
        matchesPlayed: matches.length,
        wins: 0,
        losses: 0,
        draws: 0,
        goals: 0,
        assists: 0,
        mvpCount: 0,
      };

      matches.forEach((match) => {
        const playerData = match.players.find(
          (p) => p.player.toString() === player._id.toString()
        );

        stats.goals += playerData.goals || 0;
        stats.assists += playerData.assists || 0;

        const [whiteScore, blackScore] = match.result.split("-").map(Number);

        if (playerData.team === "White") {
          if (whiteScore > blackScore) stats.wins++;
          else if (whiteScore < blackScore) stats.losses++;
          else stats.draws++;
        } else if (playerData.team === "Black") {
          if (blackScore > whiteScore) stats.wins++;
          else if (blackScore < whiteScore) stats.losses++;
          else stats.draws++;
        }

        stats.mvpCount += match.ratings.filter(
          (ratingGroup) => ratingGroup.mvp?.toString() === player._id.toString()
        ).length;
      });

      const allRatings = matches.flatMap((match) =>
        match.ratings.flatMap((ratingGroup) =>
          ratingGroup.ratings
            .filter((r) => r.player.toString() === player._id.toString())
            .map((r) => r.rating)
        )
      );

      const totalRatings = allRatings.length;
      const performance = calculatePerformance(allRatings, stats);
      const voteSum = allRatings.reduce((sum, rating) => sum + rating, 0);

      const playerStats = {
        name: player.name,
        avatar: player.avatar,
        accessories: player.accessories,
        flag: player.flag,
        stats,
        performance,
        totalRatings,
        voteSum,
      };

      res.json(playerStats);
    } catch (error) {
      console.error("Error fetching player statistics:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { season = getCurrentSeason() } = req.query;
      const players = await Player.find().lean();

      // Filter matches based on the selected season
      let matchQuery = {};
      if (season && season !== "all") {
        const [startYear, endYear] = season.split("-");
        const startDate = new Date(`${startYear}-09-01`); // season starts in September
        const endDate = new Date(`${endYear}-08-31`); // season ends in August
        matchQuery.date = { $gte: startDate, $lte: endDate };
      }
      const matches = await Match.find(matchQuery).lean();

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
            stats.mvpCount += match.ratings.filter(
              (ratingGroup) =>
                ratingGroup.mvp?.toString() === player._id.toString()
            ).length;
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
          const performance = calculatePerformance(allRatings, stats);
          const voteSum = allRatings.reduce((sum, rating) => sum + rating, 0);

          return {
            name: player.name,
            avatar: player.avatar,
            accessories: player.accessories,
            flag: player.flag,
            stats,
            performance,
            totalRatings,
            voteSum,
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
