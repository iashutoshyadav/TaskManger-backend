import http from "http";
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { initSocket } from "./config/socket";
import { registerSocketHandlers } from "./socket";
import { logger } from "./utils/logger";

const startServer = async () => {

  console.log("NODE_ENV:", env.nodeEnv);

  try {
    await connectDB();

    const server = http.createServer(app);

    const io = initSocket(server);
    registerSocketHandlers(io);

    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });

    /**
     * Graceful shutdown
     */
    const shutdown = async (signal: string) => {
      logger.warn(`Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    logger.error("Server startup failed", error);
    process.exit(1);
  }
};

startServer();
