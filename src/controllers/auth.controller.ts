import { Request, Response, NextFunction } from "express";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { registerUser, loginUser } from "../services/auth.services";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";
import { env } from "../config/env";
import { CookieOptions } from "express";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  path: "/",
  domain: ".onrender.com",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RegisterDto.parse(req.body);
    const { user, token } = await registerUser(data);

    res.cookie("token", token, cookieOptions);
    res.status(201).json({ user });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = LoginDto.parse(req.body);
    const { user, token } = await loginUser(data);

    res.cookie("token", token, cookieOptions);
    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.userId).select("_id name email");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ user });
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: env.nodeEnv === "production" ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
};
