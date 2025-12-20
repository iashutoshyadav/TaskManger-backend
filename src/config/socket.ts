import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "./env";
import { verifyToken } from "../utils/jwt";
import { logger } from "../utils/logger";

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
    },
  });

  io.use((socket: Socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        logger.warn("Socket auth failed: token missing");
        return next(new Error("Authentication token missing"));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;

      next();
    } catch (err) {
      logger.warn("Socket auth failed: invalid token");
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    // room MUST be string
    socket.join(userId.toString());

    logger.info(`Socket connected: ${socket.id} (User: ${userId})`);

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};
