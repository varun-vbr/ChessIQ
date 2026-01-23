const express = require("express");
const chessAnalysisController = require("./../controllers/chessAnalysisController");

const router = express.Router();

router.get("/health", chessAnalysisController.healthCheck);
router.use(chessAnalysisController.protect);
router.post("/", chessAnalysisController.analyse);
router.get("/", chessAnalysisController.getUserAnalyses);
module.exports = router;
