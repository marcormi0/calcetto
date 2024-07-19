const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  players: [
    {
      player: {
        type: Schema.Types.ObjectId,
        ref: "Player",
        required: true,
      },
      team: {
        type: String,
        enum: ["White", "Black"],
        required: true,
      },
      goals: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  playersWhoVoted: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
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
