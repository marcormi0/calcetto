const mongoose = require("mongoose");

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  players: {
    type: [String], // Array of player names or IDs
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Match", MatchSchema);
