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
            credentials: true,
        },
    });
    io.use((socket: Socket, next) => {
        try {
            const token =
                socket.handshake.auth?.token ||
                socket.handshake.headers.authorization?.split(" ")[1];
            if (!token) {
                return next(new Error("Authentication token missing"));
            }
            const payload = verifyToken(token);
            socket.data.userId = payload.userId;
            next();
        } catch {
            next(new Error("Invalid or expired token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        const userId = socket.data.userId;
        socket.join(userId);
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
