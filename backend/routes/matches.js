const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const passport = require("passport");
const Player = require("../models/Player");
const adminAuth = require("../middleware/auth");
const mongoose = require("mongoose");

router.post("/:id/vote/:userId", async (req, res) => {
  const matchId = req.params.id;
  const userId = req.params.userId;
  const { ratings, mvp } = req.body;

  try {
    const match = await Match.findById(matchId).populate("players.player");

    if (
      !match.players.some(
        (playerObj) =>
          playerObj.player.userId &&
          playerObj.player.userId.toString() === userId
      )
    ) {
      return res.status(403).send("You did not participate in this match");
    }

    if (match.ratings.some((rating) => rating.voter.toString() === userId)) {
      return res.status(403).send("You have already voted for this match");
    }

    // Validate MVP
    if (
      !mvp ||
      !match.players.some((player) => player.player._id.toString() === mvp)
    ) {
      return res.status(400).send("Invalid MVP selection");
    }

    match.ratings.push({
      voter: userId,
      ratings: ratings.map((rating) => ({
        player: rating.player,
        rating: rating.rating,
      })),
      mvp: mvp,
    });

    // Update MVP count for the selected player
    const mvpPlayer = await Player.findById(mvp);
    if (mvpPlayer) {
      mvpPlayer.stats.mvpCount = (mvpPlayer.stats.mvpCount || 0) + 1;
      await mvpPlayer.save();
    }

    await match.save();
    res.send("Ratings and MVP submitted successfully");
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all matches
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (_req, res) => {
    try {
      const matches = await Match.find().populate("players.player");
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get the last match played
router.get(
  "/last",
  passport.authenticate("jwt", { session: false }),
  async (_req, res) => {
    try {
      const lastMatch = await Match.findOne()
        .sort({ date: -1 })
        .populate("players.player")
        .exec();
      res.json(lastMatch);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.post("/load-match", adminAuth, async (req, res) => {
  const { date, players, result } = req.body;

  try {
    // Parse the result
    const [whiteGoals, blackGoals] = result.split("-").map(Number);

    // Create and save the new match
    const newMatch = new Match({
      date,
      players,
      result,
    });
    await newMatch.save();

    // Update player stats
    for (const playerData of players) {
      const player = await Player.findById(playerData.player);
      if (!player) {
        console.warn(`Player with id ${playerData.player} not found`);
        continue;
      }

      player.stats.matchesPlayed += 1;
      player.stats.goals += playerData.goals;

      // Determine win/loss/draw
      if (playerData.team === "White") {
        if (whiteGoals > blackGoals) {
          player.stats.wins += 1;
        } else if (whiteGoals < blackGoals) {
          player.stats.losses += 1;
        }
      } else if (playerData.team === "Black") {
        if (blackGoals > whiteGoals) {
          player.stats.wins += 1;
        } else if (blackGoals < whiteGoals) {
          player.stats.losses += 1;
        }
      }

      await player.save();
    }

    res.status(201).json({
      message: "Match information loaded and player stats updated successfully",
    });
  } catch (error) {
    console.error("Error loading match:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
