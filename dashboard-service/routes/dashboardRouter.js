const express = require("express");
const dashboardController = require("./../controllers/dashboardController");

const router = express.Router();

router.get("/health", dashboardController.healthCheck);
router.use(dashboardController.protect);
router.get("/weekly", dashboardController.getWeeklyDashboard);
router.get("/monthly", dashboardController.getMonthlyDashboard);
router.get("/gamekpi/:gameId", dashboardController.getGameKPI);
router.get("/gamekpis", dashboardController.getAllGameKPIs);
router.get("/populate", dashboardController.getDashboardData);
module.exports = router;
