import mongoose from "mongoose";
import * as repo from "../repositories/notification.repository";
import { getIO } from "../config/socket";
import { INotification } from "../models/notification.model";

/* ===========================
   CREATE (TASK ASSIGNMENT)
=========================== */
export const notifyTaskAssignment = async (
  receiverId: string,
  taskId: string,
  taskTitle: string
): Promise<INotification> => {
  if (
    !mongoose.Types.ObjectId.isValid(receiverId) ||
    !mongoose.Types.ObjectId.isValid(taskId)
  ) {
    const err: any = new Error("Invalid ID");
    err.status = 400;
    throw err;
  }

  const notification = await repo.createNotification({
    receiverId: new mongoose.Types.ObjectId(receiverId),
    taskId: new mongoose.Types.ObjectId(taskId),
    message: `You have been assigned a new task: "${taskTitle}"`,
  });

  getIO().to(receiverId).emit("notification:new", {
    id: notification._id,
    taskId,
    message: notification.message,
    createdAt: notification.createdAt,
  });

  return notification;
};

/* ===========================
   GET NOTIFICATIONS
=========================== */
export const getUserNotifications = async (
  userId: string,
  page: number,
  limit: number
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err: any = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  return repo.getNotificationsByUser(userId, page, limit);
};

export const getUnreadUserNotifications = async (
  userId: string,
  page: number,
  limit: number
) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err: any = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  return repo.getUnreadNotificationsByUser(userId, page, limit);
};

/* ===========================
   MARK READ
=========================== */
export const markNotificationRead = async (
  notificationId: string,
  userId: string
): Promise<INotification> => {
  const notification = await repo.findNotificationById(notificationId);

  if (!notification) {
    const err: any = new Error("Notification not found");
    err.status = 404;
    throw err;
  }

  if (notification.receiverId.toString() !== userId) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  return (await repo.markNotificationAsRead(
    notificationId
  ))!;
};

export const markAllNotificationsRead = async (
  userId: string
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err: any = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  await repo.markAllNotificationsAsRead(userId);
};
