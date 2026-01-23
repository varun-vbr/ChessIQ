const express = require("express");
const trainingController = require("./../controllers/trainingController");

const router = express.Router();

router.get("/health", trainingController.healthCheck);
router.use(trainingController.protect);
router.post("/explain", trainingController.explainMove);
router.get("/train", trainingController.trainMove);
router.get("/plans", trainingController.listAllTrainingPlansForUser);
module.exports = router;
