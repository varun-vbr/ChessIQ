// chess-analysis-service/controllers/ChessAnalysisController.js
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const utils = require("./../utils/utils");
const AnalysisModel = require("./../models/analysisModel");
const chessAnalysisPublisher = require("./../services/chessAnalysisPublisher");
const axios = require("axios");
const mongoose = require("mongoose");

exports.protect = catchAsync(async (req, res, next) => {
  const cookie = req.cookies.jwt;
  if (cookie) {
    try {
      const response = await axios.get(
        "http://host.docker.internal:3002/api/v1/user/protect",
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

  next();
});

exports.analyse = catchAsync(async (req, res, next) => {
  try {
    let { pgn, userColor = "WHITE" } = req.body;

    if (!pgn) {
      return next(new AppError("PGN is required", 400));
    }

    // Step 1: Extract and clean
    const movesToParse = pgn.moves.replace(/\[%[^\]]*\]/g, "");

    // Step 2: Combine with headers for a full valid PGN string
    let fullPgnString = "";
    Object.entries(pgn.headers).forEach(([key, value]) => {
      fullPgnString += `[${key} "${value}"]\n`;
    });
    fullPgnString += `\n${movesToParse}`;

    console.log("📋 Processing PGN:", fullPgnString);

    const positions = utils.generatePositions(fullPgnString);
    const results = await utils.analyzeGame(positions);
    const enrichedResult = utils.enrich(results);
    const finalResult = utils.annotateMoves(enrichedResult, userColor);

    const analysis_results = await AnalysisModel.create({
      userId: new mongoose.Types.ObjectId(res.locals.userId),
      engine: {
        name: "Stockfish",
        version: "dev-20251221",
      },
      data: {
        headers: pgn.headers,
        finalResult,
      },
    });

    const kpi = await utils.computeAndStoreGameKPI(
      analysis_results._id,
      userColor
    );
    kpi.userId = new mongoose.Types.ObjectId(res.locals.userId);
    kpi.userColor = userColor;
    console.log("📊 KPI computed:", kpi);

    // Publish event
    const numSubscribers =
      await chessAnalysisPublisher.publishGameAnalysisCompleted(kpi);

    if (numSubscribers === 0) {
      console.warn("⚠️  No dashboard service is listening!");
    }

    if (finalResult != null) {
      res.status(201).json({
        status: "success",
        data: {
          //headers: pgn.headers,
          analysis_results,
          kpi,
        },
      });
    } else {
      return next(new AppError("Error analyzing the game", 500));
    }
  } catch (e) {
    console.error("❌ Error in analysis:", e);
    return next(new AppError(e.message || "Error analyzing the game", 500));
  }
});

// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
// const utils = require("./../utils/utils");
// const { clean } = require("xss-clean/lib/xss");
// const AnalysisModel = require("./../models/analysisModel");
// const chessAnalysisPublisher = require("./../services/chessAnalysisPublisher");

// exports.analyse = catchAsync(async (req, res, next) => {
//   try {
//     let { pgn, userColor = "WHITE" } = req.body;
//     if (!pgn) {
//       return next(new AppError("PGN is required", 400));
//     }
//     // Step 1: Extract and clean
//     const movesToParse = pgn.moves.replace(/\[%[^\]]*\]/g, "");

//     // Step 2: Combine with headers for a full valid PGN string
//     let fullPgnString = "";
//     Object.entries(pgn.headers).forEach(([key, value]) => {
//       fullPgnString += `[${key} "${value}"]\n`;
//     });
//     fullPgnString += `\n${movesToParse}`;
//     console.log(fullPgnString);
//     const positions = utils.generatePositions(fullPgnString);
//     const results = await utils.analyzeGame(positions);
//     const enrichedResult = utils.enrich(results);
//     const finalResult = utils.annotateMoves(enrichedResult, userColor);
//     const analysis_results = await AnalysisModel.create({
//       engine: {
//         name: "Stockfish",
//         version: "dev-20251221",
//       },
//       data: {
//         finalResult,
//       },
//     });

//     const kpi = await utils.computeAndStoreGameKPI(
//       analysis_results._id,
//       userColor
//     );
//     await chessAnalysisPublisher.publishGameAnalysisCompleted(kpi);
//     console.log("KPI computed:", kpi);
//     if (finalResult != null) {
//       res.status(201).json({
//         status: "success",
//         data: {
//           analysis_results,
//         },
//       });
//     } else {
//       return next(new AppError("Error analyzing the game", 500));
//     }
//   } catch (e) {
//     console.log(e);
//     return next(new AppError(e.response.message, e.response.status));
//   }
// });
