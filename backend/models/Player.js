const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  ratings: [Number],
  playedMatches: Number,
  // altre informazioni del giocatore
});

module.exports = mongoose.model("Player", playerSchema);
