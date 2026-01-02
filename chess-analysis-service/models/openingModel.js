const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OpeningModel = new Schema(
  {
    eco: { type: String },
    name: { type: String },
    depth: { type: Number },
  },
  { _id: false }
);
module.exports = OpeningModel;
