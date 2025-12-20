import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import * as notificationService from "../services/notificatiom.services";

/* ===========================
   GET ALL NOTIFICATIONS
=========================== */
export const getMyNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { notifications, total } =
      await notificationService.getUserNotifications(
        req.userId!,
        page,
        limit
      );

    res.status(200).json({
      total,
      count: notifications.length, // ✅ OK now
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   GET UNREAD NOTIFICATIONS
=========================== */
export const getMyUnreadNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { notifications, total } =
      await notificationService.getUnreadUserNotifications(
        req.userId!,
        page,
        limit
      );

    res.status(200).json({
      total,
      count: notifications.length, // ✅ OK now
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/* ===========================
   MARK ONE AS READ
=========================== */
export const markNotificationAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const notification =
      await notificationService.markNotificationRead(
        req.params.id,
        req.userId!
      );

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   MARK ALL AS READ
=========================== */
export const markAllNotificationsAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await notificationService.markAllNotificationsRead(
      req.userId!
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};
