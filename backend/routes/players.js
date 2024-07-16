const express = require("express");
const router = express.Router();
const Player = require("../models/player");

router.get("/", async (req, res) => {
  const players = await Player.find();
  res.json(players);
});

router.get("/:id", async (req, res) => {
  const player = await Player.findById(req.params.id);
  res.json(player);
});

router.put("/:id", async (req, res) => {
  const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(player);
});

module.exports = router;
