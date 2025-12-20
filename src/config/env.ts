import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
    "CLIENT_URL",
] as const;

requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

const port = Number(process.env.PORT);
if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a valid positive number");
}
export const env = {
    port,
    mongoUri: process.env.MONGO_URI!,
    jwtSecret: process.env.JWT_SECRET!,
    clientUrl: process.env.CLIENT_URL!,
    nodeEnv: process.env.NODE_ENV ?? "development",
};
