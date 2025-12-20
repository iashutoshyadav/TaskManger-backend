import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "production" ? "info" : "debug";
};

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ level, message, timestamp, stack }) =>
    stack
      ? `[${timestamp}] ${level}: ${stack}`
      : `[${timestamp}] ${level}: ${message}`
  )
);

export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? format
          : consoleFormat,
    }),
  ],
  exitOnError: false,
});
