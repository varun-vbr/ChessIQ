const express = require("express");
const chessAnalysisController = require("./../controllers/chessAnalysisController");

const router = express.Router();

router.use(chessAnalysisController.protect);
router.post("/", chessAnalysisController.analyse);
module.exports = router;
