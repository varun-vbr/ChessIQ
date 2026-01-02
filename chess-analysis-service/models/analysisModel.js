const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MoveModel = require("./moveModel");

const AnalysisModel = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    gameId: {
      type: Schema.Types.ObjectId,
      //required: true,
      index: true,
    },

    engine: {
      name: { type: String, default: "Stockfish" },
      version: { type: String },
    },

    data: {
      headers: { type: Map, of: String, default: {} },
      finalResult: {
        type: [MoveModel],
        required: true,
      },
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "analysis_results",
  }
);

module.exports = mongoose.model("AnalysisModel", AnalysisModel);
