const Redis = require("ioredis");

class ChessAnalysisPublisher {
  constructor() {
    // Create dedicated publisher client
    this.publisher = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: process.env.REDIS_PORT || 6379,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    this.publisher.on("connect", () => {
      console.log("✅ Redis publisher connected");
    });

    this.publisher.on("error", (err) => {
      console.error("❌ Redis publisher error:", err);
    });

    this.publisher.on("ready", () => {
      console.log("✅ Redis publisher ready");
    });
  }

  async publishGameAnalysisCompleted(kpi) {
    const event = {
      eventType: "game.analysis.completed",
      timestamp: new Date().toISOString(),
      data: {
        kpi,
      },
    };

    try {
      const channel = "game.analysis.completed";
      const message = JSON.stringify(event);

      // Publish to Redis channel
      const numSubscribers = await this.publisher.publish(channel, message);

      console.log(`📢 Event published: ${channel}`);
      console.log(
        `👂 Number of subscribers that received it: ${numSubscribers}`
      );

      if (numSubscribers === 0) {
        console.warn(`⚠️  WARNING: No subscribers listening to ${channel}`);
      }

      return numSubscribers;
    } catch (error) {
      console.error("❌ Error publishing event:", error);
      throw error;
    }
  }

  // Graceful shutdown
  async close() {
    console.log("🛑 Closing Redis publisher connection...");
    await this.publisher.quit();
  }
}

// Create singleton instance
const chessAnalysisPublisher = new ChessAnalysisPublisher();

// Handle shutdown
process.on("SIGTERM", () => chessAnalysisPublisher.close());
process.on("SIGINT", () => chessAnalysisPublisher.close());

module.exports = chessAnalysisPublisher;

// const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_HOST);

// exports.publishGameAnalysisCompleted = async function (kpi) {
//   const event = {
//     eventType: "game.analysis.completed",
//     timestamp: new Date().toISOString(),
//     data: {
//       kpi,
//     },
//   };

//   // Publish to Redis channel
//   await redis.publish("game.analysis.completed", JSON.stringify(event));

//   console.log(`📢 Event published: game.analysis.completed for game`);
// };
