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
        "http://localhost:3002/api/v1/user/protect",
        {
          headers: {
            Cookie: "jwt=" + cookie + ";",
          },
        }
      );
      if (response.status != 200) {
        return next(
          new AppError(
            "You are not logged in! Please log in to get access.",
            401
          )
        );
      }
      res.locals.userId = response.data.currentUser._id;
      return next();
    } catch (e) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
  } else {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
});

exports.getWeeklyDashboard = catchAsync(async (req, res, next) => {
  try {
    // Placeholder response for dashboard data
    const snapshot = await utils.generateDashboard(
      res.locals.userId,
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      new Date(Date.now())
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
      new Date(Date.now())
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
