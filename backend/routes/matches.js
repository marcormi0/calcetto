const express = require("express");
const router = express.Router();
const Match = require("../models/Match");
const passport = require("passport");
const Player = require("../models/Player");
const adminAuth = require("../middleware/auth");

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

    await match.save();

    console.log(`Player with userId: ${userId} submitted their ratings`);
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
    // Create and save the new match
    const newMatch = new Match({
      date,
      players,
      result,
    });
    await newMatch.save();

    res.status(201).json({
      message: "Match information loaded successfully",
    });
  } catch (error) {
    console.error("Error loading match:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
