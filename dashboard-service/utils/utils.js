const GameKPI = require("../models/gameKpiModel");
const DashboardSnapshot = require("../models/dashboardSnapshotModel");
const mongoose = require("mongoose");

/**
 * Generates week-over-week dashboard data for the past N weeks
 * @param {string} userId - The user's ID
 * @param {number} numWeeks - Number of weeks to retrieve (default: 4)
 * @param {Date} endDate - End date (default: now)
 * @returns {Promise<Array>} Array of weekly dashboard snapshots
 */
async function getWeekOverWeekData(userId, numWeeks = 4, endDate = new Date()) {
  const weeklyData = [];
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

  // Start from the most recent week and go backwards
  for (let i = 0; i < numWeeks; i++) {
    // Calculate the date range for this week
    const weekEnd = new Date(endDate.getTime() - i * MS_PER_WEEK);
    const weekStart = new Date(weekEnd.getTime() - MS_PER_WEEK);

    console.log(`Week ${numWeeks - i}:`, {
      start: weekStart.toISOString(),
      end: weekEnd.toISOString(),
    });

    try {
      const weekSnapshot = await generateDashboard(userId, weekStart, weekEnd);

      console.log(`Week ${numWeeks - i} snapshot:`, weekSnapshot);

      // Check if weekSnapshot is not null and has games
      if (
        weekSnapshot &&
        weekSnapshot.summary &&
        weekSnapshot.summary.gamesPlayed > 0
      ) {
        weeklyData.unshift({
          week: numWeeks - i,
          weekLabel: `Week ${numWeeks - i}`,
          dateRange: {
            from: weekStart,
            to: weekEnd,
          },
          ...weekSnapshot,
        });
      } else {
        console.log(`⚠️ No data for Week ${numWeeks - i}`);
      }
    } catch (error) {
      console.error(`Error generating data for week ${i + 1}:`, error);
      // Continue with other weeks even if one fails
    }
  }

  return weeklyData;
}
// async function getWeekOverWeekData(userId, numWeeks = 4, endDate = new Date()) {
//   const weeklyData = [];

//   // Start from the most recent week and go backwards
//   for (let i = 0; i < numWeeks; i++) {
//     // Calculate the date range for this week
//     const weekEnd = new Date(endDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
//     const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

//     console.log(`Week ${numWeeks - i}:`, {
//       start: weekStart.toISOString(),
//       end: weekEnd.toISOString(),
//     });

//     try {
//       const weekSnapshot = await generateDashboard(userId, weekStart, weekEnd);

//       console.log(`Week ${numWeeks - i} snapshot:`, weekSnapshot);

//       if (weekSnapshot && weekSnapshot.summary.gamesPlayed > 0) {
//         weeklyData.unshift({
//           // unshift to maintain chronological order
//           week: numWeeks - i,
//           weekLabel: `Week ${numWeeks - i}`,
//           dateRange: {
//             from: weekStart,
//             to: weekEnd,
//           },
//           ...weekSnapshot,
//         });
//       }
//     } catch (error) {
//       console.error(`Error generating data for week ${i + 1}:`, error);
//       // Continue with other weeks even if one fails
//     }
//   }

//   return weeklyData;
// }

// async function getWeekOverWeekData(
//   userId,
//   numWeeks = 4,
//   endDate = new Date(Date.now()),
// ) {
//   const weeklyData = [];

//   // Start from the most recent week and go backwards
//   for (let i = 0; i < numWeeks; i++) {
//     // Calculate the date range for this week
//     const weekEnd = new Date(endDate);
//     weekEnd.setDate(weekEnd.getDate() - i * 7 * 24 * 60 * 60 * 1000);

//     const weekStart = new Date(weekEnd);
//     weekStart.setDate(weekStart.getDate() - 7 * 24 * 60 * 60 * 1000);

//     try {
//       const weekSnapshot = await generateDashboard(userId, weekStart, weekEnd);

//       if (weekSnapshot && weekSnapshot.summary.gamesPlayed > 0) {
//         weeklyData.unshift({
//           // unshift to maintain chronological order
//           week: numWeeks - i,
//           weekLabel: `Week ${numWeeks - i}`,
//           dateRange: {
//             from: weekStart,
//             to: weekEnd,
//           },
//           ...weekSnapshot,
//         });
//       }
//     } catch (error) {
//       console.error(`Error generating data for week ${i + 1}:`, error);
//       // Continue with other weeks even if one fails
//     }
//   }

//   return weeklyData;
// }

/**
 * Transforms week-over-week data into chart-ready format
 * @param {Array} weeklyData - Array of weekly snapshots
 * @returns {Object} Formatted data for all charts
 */
function transformWeeklyDataForCharts(weeklyData) {
  return {
    // Accuracy trend data
    accuracyTrend: weeklyData.map((week) => ({
      period: week.weekLabel,
      accuracy: week.summary.avgAccuracy,
    })),

    // CPL trend data
    cplTrend: weeklyData.map((week) => ({
      period: week.weekLabel,
      cpl: week.summary.avgCpl,
    })),

    // Blunders trend data
    blundersTrend: weeklyData.map((week) => ({
      period: week.weekLabel,
      blunders: week.summary.blundersPerGame,
    })),

    // Weakness evolution data
    weaknessTrend: weeklyData.map((week) => ({
      period: week.weekLabel,
      positional: week.summary.weaknesses?.POSITIONAL_MISJUDGMENT || 0,
      kingSafety: week.summary.weaknesses?.KING_SAFETY || 0,
      tactical: week.summary.weaknesses?.TACTICAL_BLINDNESS || 0,
      middlegame: week.summary.weaknesses?.MIDDLEGAME_PLANNING || 0,
      endgame: week.summary.weaknesses?.ENDGAME_CONVERSION || 0,
      pawn: week.summary.weaknesses?.PAWN_STRUCTURE || 0,
      piece: week.summary.weaknesses?.PIECE_COORDINATION || 0,
    })),

    // Games vs Quality data
    gamesQuality: weeklyData.map((week, index) => ({
      games: weeklyData
        .slice(0, index + 1)
        .reduce((sum, w) => sum + w.summary.gamesPlayed, 0),
      accuracy: week.summary.avgAccuracy,
    })),

    // Latest week data (for current stats)
    latestWeek: weeklyData[weeklyData.length - 1] || null,

    // Calculate trends (percentage change from previous week)
    trends: calculateTrends(weeklyData),
  };
}

/**
 * Calculates percentage changes between the last two weeks
 * @param {Array} weeklyData - Array of weekly snapshots
 * @returns {Object} Trend percentages
 */
function calculateTrends(weeklyData) {
  if (weeklyData.length < 2) {
    return { accuracy: 0, cpl: 0, blunders: 0, gamesPlayed: 0 };
  }

  const current = weeklyData[weeklyData.length - 1].summary;
  const previous = weeklyData[weeklyData.length - 2].summary;

  const calcChange = (curr, prev) => {
    if (prev === 0) return 0;
    return Number((((curr - prev) / prev) * 100).toFixed(1));
  };

  return {
    accuracy: calcChange(current.avgAccuracy, previous.avgAccuracy),
    cpl: calcChange(current.avgCpl, previous.avgCpl),
    blunders: calcChange(current.blundersPerGame, previous.blundersPerGame),
    gamesPlayed: calcChange(current.gamesPlayed, previous.gamesPlayed),
  };
}

// async function generateDashboard(userId, from, to) {
//   debugger;
//   const [snapshot] = await GameKPI.aggregate([
//     {
//       $match: {
//         userId: new mongoose.Types.ObjectId(userId),
//         createdAt: { $gte: from, $lte: to },
//       },
//     },

//     {
//       $facet: {
//         // -------------------------------
//         // 1️⃣ CORE STATS (per game)
//         // -------------------------------
//         coreStats: [
//           {
//             $group: {
//               _id: null,
//               gamesPlayed: { $sum: 1 },
//               avgAccuracy: { $avg: "$stats.accuracyPct" },
//               avgCpl: { $avg: "$stats.avgCpl" },
//               blunders: { $sum: "$stats.blunders" },

//               openings: {
//                 $push: {
//                   eco: "$eco.code",
//                   name: "$eco.name",
//                   avgCpl: "$stats.avgCpl",
//                 },
//               },
//             },
//           },
//         ],

//         // -------------------------------
//         // 2️⃣ WEAKNESS AGGREGATION
//         // -------------------------------
//         weaknesses: [
//           {
//             $project: {
//               weaknessPairs: { $objectToArray: "$weaknessCounts" },
//             },
//           },
//           { $unwind: "$weaknessPairs" },
//           {
//             $group: {
//               _id: "$weaknessPairs.k",
//               count: { $sum: "$weaknessPairs.v" },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               weaknesses: {
//                 $push: { k: "$_id", v: "$count" },
//               },
//             },
//           },
//           {
//             $project: {
//               weaknesses: { $arrayToObject: "$weaknesses" },
//             },
//           },
//         ],
//       },
//     },

//     // -------------------------------
//     // 3️⃣ MERGE RESULTS
//     // -------------------------------
//     {
//       $project: {
//         gamesPlayed: { $arrayElemAt: ["$coreStats.gamesPlayed", 0] },
//         avgAccuracy: { $arrayElemAt: ["$coreStats.avgAccuracy", 0] },
//         avgCpl: { $arrayElemAt: ["$coreStats.avgCpl", 0] },
//         blunders: { $arrayElemAt: ["$coreStats.blunders", 0] },
//         openings: { $arrayElemAt: ["$coreStats.openings", 0] },
//         weaknesses: { $arrayElemAt: ["$weaknesses.weaknesses", 0] },
//       },
//     },
//   ]);

//   if (!snapshot) return;
//   console.log("🗂️ Weekly Dashboard Snapshot:", snapshot);
//   debugger;

//   const MS_PER_DAY = 1000 * 60 * 60 * 24;
//   const diffDays = Math.round((to - from) / MS_PER_DAY);
//   // await DashboardSnapshot.create(
//   return {
//     userId,
//     period: diffDays >= 6 && diffDays <= 8 ? "WEEKLY" : "MONTHLY",
//     from,
//     to,
//     summary: {
//       gamesPlayed: snapshot.gamesPlayed,
//       avgAccuracy: Number(snapshot.avgAccuracy.toFixed(1)),
//       avgCpl: Number(snapshot.avgCpl.toFixed(1)),
//       blundersPerGame: Number(
//         (snapshot.blunders / snapshot.gamesPlayed).toFixed(2),
//       ),
//       weaknesses: snapshot.weaknesses,
//       openings: snapshot.openings,
//     },

//     createdAt: new Date(),
//   }; //);
// }

async function generateDashboard(userId, from, to) {
  debugger;
  const [snapshot] = await GameKPI.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: from, $lte: to },
      },
    },

    {
      $facet: {
        // -------------------------------
        // 1️⃣ CORE STATS (per game)
        // -------------------------------
        coreStats: [
          {
            $group: {
              _id: null,
              gamesPlayed: { $sum: 1 },
              avgAccuracy: { $avg: "$stats.accuracyPct" },
              avgCpl: { $avg: "$stats.avgCpl" },
              blunders: { $sum: "$stats.blunders" },

              openings: {
                $push: {
                  eco: "$eco.code",
                  name: "$eco.name",
                  avgCpl: "$stats.avgCpl",
                },
              },
            },
          },
        ],

        // -------------------------------
        // 2️⃣ WEAKNESS AGGREGATION
        // -------------------------------
        weaknesses: [
          {
            $project: {
              weaknessPairs: { $objectToArray: "$weaknessCounts" },
            },
          },
          { $unwind: "$weaknessPairs" },
          {
            $group: {
              _id: "$weaknessPairs.k",
              count: { $sum: "$weaknessPairs.v" },
            },
          },
          {
            $group: {
              _id: null,
              weaknesses: {
                $push: { k: "$_id", v: "$count" },
              },
            },
          },
          {
            $project: {
              weaknesses: { $arrayToObject: "$weaknesses" },
            },
          },
        ],
      },
    },

    // -------------------------------
    // 3️⃣ MERGE RESULTS
    // -------------------------------
    {
      $project: {
        gamesPlayed: { $arrayElemAt: ["$coreStats.gamesPlayed", 0] },
        avgAccuracy: { $arrayElemAt: ["$coreStats.avgAccuracy", 0] },
        avgCpl: { $arrayElemAt: ["$coreStats.avgCpl", 0] },
        blunders: { $arrayElemAt: ["$coreStats.blunders", 0] },
        openings: { $arrayElemAt: ["$coreStats.openings", 0] },
        weaknesses: { $arrayElemAt: ["$weaknesses.weaknesses", 0] },
      },
    },
  ]);

  // Check if snapshot exists and has data
  if (!snapshot || !snapshot.gamesPlayed || snapshot.gamesPlayed === 0) {
    console.log("⚠️ No games found for the specified date range");
    return null;
  }

  console.log("🗂️ Weekly Dashboard Snapshot:", snapshot);
  debugger;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((to - from) / MS_PER_DAY);

  return {
    userId,
    period: diffDays >= 6 && diffDays <= 8 ? "WEEKLY" : "MONTHLY",
    from,
    to,
    summary: {
      gamesPlayed: snapshot.gamesPlayed || 0,
      avgAccuracy: snapshot.avgAccuracy
        ? Number(snapshot.avgAccuracy.toFixed(1))
        : 0,
      avgCpl: snapshot.avgCpl ? Number(snapshot.avgCpl.toFixed(1)) : 0,
      blundersPerGame:
        snapshot.gamesPlayed > 0
          ? Number((snapshot.blunders / snapshot.gamesPlayed).toFixed(2))
          : 0,
      weaknesses: snapshot.weaknesses || {},
      openings: snapshot.openings || [],
    },
    createdAt: new Date(),
  };
}

module.exports = {
  generateDashboard,
  getWeekOverWeekData,
  transformWeeklyDataForCharts,
  calculateTrends,
};
