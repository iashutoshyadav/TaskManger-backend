import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      const err: any = new Error("Unauthorized");
      err.status = 401;
      throw err;
    }

    const payload = verifyToken(token);

    if (!payload?.userId) {
      const err: any = new Error("Invalid token");
      err.status = 401;
      throw err;
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    next(error); // 🔥 VERY IMPORTANT
  }
};
