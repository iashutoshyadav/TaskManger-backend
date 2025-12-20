import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

if (env.nodeEnv !== "production") {
  app.use(morgan("dev"));
}
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);

app.use(errorMiddleware);

export default app;
