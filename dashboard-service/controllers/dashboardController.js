const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const utils = require("./../utils/utils");
const { clean } = require("xss-clean/lib/xss");
const axios = require("axios");
const GameKPI = require("./../models/gameKpiModel");
const mongoose = require("mongoose");

exports.protect = catchAsync(async (req, res, next) => {
  debugger;
  const cookie = req.cookies.jwt;
  if (cookie) {
    try {
      const response = await axios.get(
        "http://host.docker.internal:3002/api/v1/user/protect",
        {
          headers: {
            Cookie: "jwt=" + cookie + ";",
          },
        },
      );
      if (response.status != 200) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401,
          ),
        );
      }
      res.locals.userId = response.data.currentUser._id;
      return next();
    } catch (e) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401),
    );
  }
});

// /**
//  * API endpoint example
//  */
// async function getDashboardData(req, res) {
//   try {
//     const { userId } = req.params;
//     const { weeks = 4 } = req.query;

//     // Get week-over-week data
//     const weeklyData = await getWeekOverWeekData(userId, parseInt(weeks));

//     if (weeklyData.length === 0) {
//       return res.status(404).json({
//         status: "error",
//         message: "No game data found for this user"
//       });
//     }

//     // Transform data for charts
//     const chartData = transformWeeklyDataForCharts(weeklyData);

//     // Get current month data for comprehensive view
//     const monthStart = new Date();
//     monthStart.setDate(1);
//     monthStart.setHours(0, 0, 0, 0);

//     const monthEnd = new Date();
//     monthEnd.setMonth(monthEnd.getMonth() + 1);
//     monthEnd.setDate(0);
//     monthEnd.setHours(23, 59, 59, 999);

//     const monthlyData = await generateDashboard(userId, monthStart, monthEnd);

//     res.json({
//       status: "success",
//       data: {
//         weekly: chartData,
//         monthly: monthlyData,
//         rawWeeklyData: weeklyData
//       }
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard data:", error);
//     res.status(500).json({
//       status: "error",
//       message: "Failed to fetch dashboard data",
//       error: error.message
//     });
//   }
// }

exports.getDashboardData = catchAsync(async (req, res, next) => {
  debugger;
  const userId = res.locals.userId;
  const { weeks = 4 } = req.query;

  // Get week-over-week data
  const weeklyData = await utils.getWeekOverWeekData(userId, parseInt(weeks));

  if (weeklyData.length === 0) {
    //return next(new AppError("No game data found for this user", 404));
    res.status(200).json({
      status: "success",
      data: null,
    });
  }

  // Transform data for charts
  const chartData = utils.transformWeeklyDataForCharts(weeklyData);

  // Get current month data for comprehensive view
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthEnd = new Date();
  monthEnd.setMonth(monthEnd.getMonth() + 1);
  monthEnd.setDate(0);
  monthEnd.setHours(23, 59, 59, 999);

  const monthlyData = await utils.generateDashboard(
    userId,
    monthStart,
    monthEnd,
  );

  res.status(200).json({
    status: "success",
    data: {
      weekly: chartData,
      monthly: monthlyData,
      rawWeeklyData: weeklyData,
    },
  });
});

exports.getWeeklyDashboard = catchAsync(async (req, res, next) => {
  try {
    // Placeholder response for dashboard data
    const snapshot = await utils.generateDashboard(
      res.locals.userId,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date(Date.now()),
    );

    res.status(200).json({
      status: "success",
      data: {
        dashboard: snapshot,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500));
  }
});

exports.getMonthlyDashboard = catchAsync(async (req, res, next) => {
  try {
    // Placeholder response for dashboard data
    const snapshot = await utils.generateDashboard(
      res.locals.userId,
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(Date.now()),
    );

    res.status(200).json({
      status: "success",
      data: {
        dashboard: snapshot,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.response.message, e.response.status));
  }
});

exports.getGameKPI = catchAsync(async (req, res, next) => {
  try {
    const gameId = req.params.gameId;
    console.log("Fetching Game KPI for gameId:", gameId);
    const gameKPI = await GameKPI.findOne({
      userId: new mongoose.Types.ObjectId(res.locals.userId),
      _id: new mongoose.Types.ObjectId(gameId),
    });

    if (!gameKPI) {
      return next(new AppError("Game KPI not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        gameKPI,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.response.message, e.response.status));
  }
});

exports.getAllGameKPIs = catchAsync(async (req, res, next) => {
  try {
    const userId = res.locals.userId;
    if (!userId) {
      return next(new AppError("User not authenticated", 401));
    }
    const gameKPIs = await GameKPI.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 }) // most recent first
      .lean();

    if (!gameKPIs) {
      return next(new AppError("Game KPIs not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        gameKPIs,
      },
    });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.response.message, e.response.status));
  }
});

exports.healthCheck = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: "success",
  });
});
