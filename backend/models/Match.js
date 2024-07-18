// backend/models/Match.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  result: {
    type: String,
    required: true,
  },
  ratings: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
      },
      rating: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Match", MatchSchema);
