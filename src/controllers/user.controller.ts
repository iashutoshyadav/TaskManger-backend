import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { UpdateUserProfileDto } from "../dtos/user.dto";
import * as userService from "../services/user.service";

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await userService.getProfile(
      req.userId!
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = UpdateUserProfileDto.parse(req.body);
    const user = await userService.updateProfile(
      req.userId!,
      data
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
