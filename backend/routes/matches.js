const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const passport = require("passport");
const Player = require("../models/Player");
const adminAuth = require("../middleware/auth");

router.post("/:id/vote/:userId", async (req, res) => {
  const matchId = req.params.id;
  const userId = req.params.userId;
  const { ratings } = req.body;

  try {
    const match = await Match.findById(matchId).populate("players.player");
    if (
      !match.players.some(
        (playerObj) => playerObj.player.userId.toString() === userId
      )
    ) {
      return res.status(403).send("You did not participate in this match");
    }

    if (match.playersWhoVoted.includes(userId)) {
      return res.status(403).send("You have already voted for this match");
    }

    ratings.forEach(async (rating) => {
      match.ratings.push({ player: rating.player, rating: rating.rating });
    });
    match.playersWhoVoted.push(userId);

    await match.save();
    res.send("Ratings submitted successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const newMatch = new Match({
        date,
        players,
        result,
      });

      await newMatch.save({ session });

      // Update player stats
      for (const playerData of players) {
        const player = await Player.findById(playerData.player).session(
          session
        );
        if (!player) {
          throw new Error(`Player with id ${playerData.player} not found`);
        }

        player.stats.matchesPlayed += 1;
        player.stats.goals += playerData.goals;

        if (result.toLowerCase().includes(playerData.team.toLowerCase())) {
          player.stats.wins += 1;
        } else if (result.toLowerCase() !== "draw") {
          player.stats.losses += 1;
        }

        await player.save({ session });
      }

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        message:
          "Match information loaded and player stats updated successfully",
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("Error loading match:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
