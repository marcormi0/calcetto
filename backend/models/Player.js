// backend/models/Player.js
const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  isLinked: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "default-avatar.png",
  },
});

// Compound index to ensure uniqueness only for linked players
PlayerSchema.index(
  { userId: 1, isLinked: 1 },
  {
    unique: true,
    partialFilterExpression: { isLinked: true },
  }
);

module.exports = mongoose.model("Player", PlayerSchema);
