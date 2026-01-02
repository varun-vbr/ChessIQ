// models/gameKpiModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameKpiSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, index: true },
  gameId: { type: Schema.Types.ObjectId, unique: false },
  color: { type: String, enum: ["WHITE", "BLACK"] },
  playedAt: Date,
  eco: {
    code: String,
    name: String,
  },

  stats: {
    avgCpl: Number,
    blunders: Number,
    mistakes: Number,
    inaccuracies: Number,
    accuracyPct: Number,
  },

  phaseStats: {
    opening: { accuracy: Number },
    middlegame: { accuracy: Number },
    endgame: { accuracy: Number },
  },

  weaknessCounts: Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameKPI", gameKpiSchema);
