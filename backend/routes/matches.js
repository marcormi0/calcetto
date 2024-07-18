const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const passport = require("passport");

router.post("/:id/vote/:userId", async (req, res) => {
  const matchId = req.params.id;
  const userId = req.params.userId;
  const { ratings } = req.body;

  try {
    const match = await Match.findById(matchId).populate("players");
    if (!match.players.some((player) => player.userId.toString() === userId)) {
      return res.status(403).send("You did not participate in this match");
    }

    if (match.ratings.some((rating) => rating.player.toString() === userId)) {
      return res.status(403).send("You have already voted for this match");
    }

    ratings.forEach(async (rating) => {
      const player = await Player.findById(rating.player);
      player.ratings.push(rating.rating);
      await player.save();
      match.ratings.push({ player: rating.player, rating: rating.rating });
    });

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
      const matches = await Match.find().populate("players");
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
        .populate("players")
        .exec();
      res.json(lastMatch);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
