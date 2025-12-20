import { Request, Response, NextFunction } from "express";
import { CookieOptions } from "express";
import { RegisterDto, LoginDto } from "../dtos/auth.dto";
import { registerUser, loginUser } from "../services/auth.services";
import { env } from "../config/env";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UserModel } from "../models/user.model";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = RegisterDto.parse(req.body);
    const { user, token } = await registerUser(data);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = LoginDto.parse(req.body);
    const { user, token } = await loginUser(data);

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};
export const getMe = async (req: AuthRequest, res: Response) => {
  const user = await UserModel.findById(req.userId).select(
    "_id name email"
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
};

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logged out successfully" });
};
