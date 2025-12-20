import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = "Invalid ID format";
  }

  if (err?.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.message === "Unauthorized") {
    statusCode = 401;
    message = "Unauthorized access";
  }

  if (
    ["Task not found", "User not found", "Notification not found"].includes(
      err.message
    )
  ) {
    statusCode = 404;
    message = err.message;
  }

  if (
    [
      "Due date cannot be in the past",
      "Email already in use",
      "Invalid email or password",
      "Invalid task ID",
      "Invalid creator ID",
      "Invalid assigned user ID",
    ].includes(err.message)
  ) {
    statusCode = 400;
    message = err.message;
  }

  logger.error(err.message, {
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: err.stack,
    }),
  });
};
