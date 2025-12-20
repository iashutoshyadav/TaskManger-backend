import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import cookie from "cookie";
import { env } from "./env";
import { verifyToken } from "../utils/jwt";
import { logger } from "../utils/logger";

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        // "http://localhost:5173",
        env.clientUrl,
      ],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) {
        return next(new Error("No cookies sent"));
      }

      const parsed = cookie.parse(cookies);
      const token = parsed.token;

      if (!token) {
        return next(new Error("Auth token missing"));
      }

      const payload = verifyToken(token);
      socket.data.userId = payload.userId;

      next();
    } catch (err) {
      logger.warn("Socket auth failed", err);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    socket.join(userId);
    logger.info(`Socket connected: ${socket.id} (User ${userId})`);

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
