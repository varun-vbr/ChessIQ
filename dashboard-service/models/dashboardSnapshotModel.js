// models/dashboardSnapshotModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dashboardSnapshotSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, index: true },
  period: { type: String, enum: ["WEEKLY", "MONTHLY"] },

  from: Date,
  to: Date,

  summary: {
    gamesPlayed: Number,
    avgAccuracy: Number,
    avgCpl: Number,
    blundersPerGame: Number,
    weaknesses: { type: Map, of: Number, default: {} },
    openings: [{ eco: String, games: Number, avgCpl: Number }],
  },

  //phaseAccuracy: Schema.Types.Mixed,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DashboardSnapshot", dashboardSnapshotSchema);
