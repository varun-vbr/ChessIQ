const express = require("express");
const dashboardController = require("./../controllers/dashboardController");

const router = express.Router();

router.use(dashboardController.protect);
router.get("/weekly", dashboardController.getWeeklyDashboard);
router.get("/monthly", dashboardController.getMonthlyDashboard);
router.get("/gamekpi/:gameId", dashboardController.getGameKPI);
module.exports = router;
