const GameKPI = require("../models/gameKpiModel");
const DashboardSnapshot = require("../models/dashboardSnapshotModel");
const mongoose = require("mongoose");

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

  if (!snapshot) return;
  console.log("🗂️ Weekly Dashboard Snapshot:", snapshot);
  debugger;

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((to - from) / MS_PER_DAY);
  // await DashboardSnapshot.create(
  return {
    userId,
    period: diffDays >= 6 && diffDays <= 8 ? "WEEKLY" : "MONTHLY",
    from,
    to,
    summary: {
      gamesPlayed: snapshot.gamesPlayed,
      avgAccuracy: Number(snapshot.avgAccuracy.toFixed(1)),
      avgCpl: Number(snapshot.avgCpl.toFixed(1)),
      blundersPerGame: Number(
        (snapshot.blunders / snapshot.gamesPlayed).toFixed(2)
      ),
      weaknesses: snapshot.weaknesses,
      openings: snapshot.openings,
    },

    createdAt: new Date(),
  }; //);
}

module.exports = { generateDashboard };
