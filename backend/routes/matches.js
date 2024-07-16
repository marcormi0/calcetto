const express = require("express");
const router = express.Router();
const Match = require("../models/match");
const verifyToken = require("../middleware/auth");

router.post("/:id/vote", verifyToken, async (req, res) => {
  const matchId = req.params.id;
  const userId = req.userId;
  const { ratings } = req.body;

  const match = await Match.findById(matchId).populate("players");
  if (!match.players.some((player) => player._id.toString() === userId)) {
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
});

module.exports = router;
