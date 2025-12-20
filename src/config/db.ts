import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

export const connectDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", true);
        await mongoose.connect(env.mongoUri, {
            serverSelectionTimeoutMS: 5000,
            autoIndex: env.nodeEnv !== "production",
        });
        logger.info("MongoDB connected successfully");
        mongoose.connection.on("error", (err) => {
            logger.error("MongoDB runtime error", err);
        });
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
    }
};
