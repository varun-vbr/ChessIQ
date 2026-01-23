const Redis = require("ioredis");
const GameKPI = require("./../models/gameKpiModel");
const mongoose = require("mongoose");
const utils = require("./../utils/utils");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../config.env") });
class DashboardEventHandler {
  constructor() {
    debugger;
    console.log(process.env.REDIS_HOST);
    // Create dedicated subscriber client
    this.subscriber = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.setupSubscriptions();
  }

  setupSubscriptions() {
    console.log("🔌 Setting up Redis subscriptions...");

    // Subscribe to channel
    this.subscriber.subscribe("game.analysis.completed", (err, count) => {
      if (err) {
        console.error("❌ Failed to subscribe:", err);
      } else {
        console.log(`✅ Dashboard subscribed to ${count} channel(s)`);
      }
    });

    // Handle incoming messages
    this.subscriber.on("message", async (channel, message) => {
      console.log(`📨 Received message on channel: ${channel}`);

      if (channel === "game.analysis.completed") {
        await this.handleGameAnalysisCompleted(message);
      }
    });

    // Handle connection events
    this.subscriber.on("connect", () => {
      console.log("✅ Redis subscriber connected");
    });

    this.subscriber.on("error", (err) => {
      console.error("❌ Redis subscriber error:", err);
    });

    this.subscriber.on("ready", () => {
      console.log("✅ Redis subscriber ready");
    });
  }

  async handleGameAnalysisCompleted(message) {
    try {
      console.log(`📊 Raw message received:`, message);

      const event = JSON.parse(message);
      const gameKpi = event.data;

      console.log(`📊 Dashboard received event for user:`, gameKpi);
      gameKpi.kpi.userId = new mongoose.Types.ObjectId(gameKpi.kpi.userId);

      await GameKPI.create(gameKpi.kpi);
    } catch (error) {
      console.error("❌ Error handling event:", error);
    }
  }

  // Graceful shutdown
  async close() {
    console.log("🛑 Closing Redis subscriber connection...");
    await this.subscriber.quit();
  }
}

// Create and export instance
const dashboardEventHandler = new DashboardEventHandler();

// Handle shutdown
process.on("SIGTERM", () => dashboardEventHandler.close());
process.on("SIGINT", () => dashboardEventHandler.close());

module.exports = dashboardEventHandler;
