import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as notificationService from "../services/notificatiom.services";

export const getMyNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { page = 1, limit = 10 } = req.query;

    const notifications =
      await notificationService.getUserNotifications(
        userId,
        Number(page),
        Number(limit)
      );

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyUnreadNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { page = 1, limit = 10 } = req.query;

    const notifications =
      await notificationService.getUnreadUserNotifications(
        userId,
        Number(page),
        Number(limit)
      );

    res.status(200).json({
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;
    const { id } = req.params;

    const notification =
      await notificationService.markNotificationRead(id, userId);

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.userId!;

    await notificationService.markAllNotificationsRead(userId);

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
