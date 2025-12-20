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
      throw new Error("Unauthorized");
    }

    const payload = verifyToken(token);
    req.userId = payload.userId;

    next();
  } catch {
    next(new Error("Unauthorized"));
  }
};
