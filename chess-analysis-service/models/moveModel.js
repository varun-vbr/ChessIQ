const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OpeningModel = require("./openingModel");

const MoveModel = new Schema(
  {
    ply: { type: Number, required: true },
    move: { type: String, required: true },

    fenBefore: { type: String, required: true },
    fenAfter: { type: String, required: true },

    evalCp: { type: Number },
    mate: { type: Number, default: null },

    bestMove: { type: String },
    cpl: { type: Number },

    classification: {
      type: String,
      enum: ["GOOD", "INACCURACY", "MISTAKE", "BLUNDER"],
      default: "GOOD",
    },

    weaknessTags: {
      type: [String],
      default: [],
    },

    tacticalMotifs: {
      type: [String],
      default: [],
    },

    opening: OpeningModel,
  },
  { _id: false }
);
module.exports = MoveModel;
