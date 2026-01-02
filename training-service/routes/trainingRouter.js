const express = require("express");
const trainingController = require("./../controllers/trainingController");

const router = express.Router();

router.use(trainingController.protect);
router.post("/explain", trainingController.explainMove);
router.post("/train", trainingController.trainMove);
module.exports = router;
