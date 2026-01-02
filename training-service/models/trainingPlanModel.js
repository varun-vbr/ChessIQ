const mongoose = require("mongoose");

const trainingPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  plan: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TrainingPlan", trainingPlanSchema);
