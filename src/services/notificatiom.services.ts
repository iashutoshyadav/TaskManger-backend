import mongoose from "mongoose";
import * as notificationRepo from "../repositories/notification.repository";
import { getIO } from "../config/socket";
import { INotification } from "../models/notification.model";

/**
 * Create notification when a task is assigned
 */
export const notifyTaskAssignment = async (
  receiverId: string,
  taskId: string,
  taskTitle: string
): Promise<INotification> => {
  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    throw new Error("Invalid receiver ID");
  }

  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const message = `You have been assigned a new task: "${taskTitle}"`;

  const notification = await notificationRepo.createNotification({
    receiverId: new mongoose.Types.ObjectId(receiverId),
    taskId: new mongoose.Types.ObjectId(taskId),
    message,
  });

  const io = getIO();

  // Consistent real-time event
  io.to(receiverId).emit("notification:new", {
    id: notification._id,
    taskId,
    message,
    createdAt: notification.createdAt,
  });

  return notification;
};

/**
 * Get all notifications for a user (paginated)
 */
export const getUserNotifications = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<INotification[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return notificationRepo.getNotificationsByUser(
    userId,
    page,
    limit
  );
};

/**
 * Get unread notifications for a user (paginated)
 */
export const getUnreadUserNotifications = async (
  userId: string,
  page = 1,
  limit = 10
): Promise<INotification[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  return notificationRepo.getUnreadNotificationsByUser(
    userId,
    page,
    limit
  );
};

/**
 * Mark a single notification as read
 */
export const markNotificationRead = async (
  notificationId: string,
  userId: string
): Promise<INotification> => {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    throw new Error("Invalid notification ID");
  }

  const notification =
    await notificationRepo.markNotificationAsRead(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  if (notification.receiverId.toString() !== userId) {
    throw new Error("Unauthorized to update this notification");
  }

  return notification;
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsRead = async (
  userId: string
): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  await notificationRepo.markAllNotificationsAsRead(userId);
};
