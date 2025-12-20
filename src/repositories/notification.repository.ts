import mongoose from "mongoose";
import { NotificationModel, INotification } from "../models/notification.model";

type CreateNotificationData = {
  receiverId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  message: string;
  isRead?:boolean;
};

export const createNotification = async (
  data: CreateNotificationData
): Promise<INotification> => {
  return NotificationModel.create(data);
};

export const getNotificationsByUser = async (
  receiverId: string,
  page = 1,
  limit = 10
): Promise<INotification[]> => {
  const skip = (page - 1) * limit;

  return NotificationModel.find({ receiverId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("taskId", "title status priority")
    .lean()
    .exec();
};

export const getUnreadNotificationsByUser = async (
  receiverId: string,
  page = 1,
  limit = 10
): Promise<INotification[]> => {
  const skip = (page - 1) * limit;

  return NotificationModel.find({
    receiverId,
    isRead: false,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("taskId", "title status priority")
    .lean()
    .exec();
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<INotification | null> => {
  return NotificationModel.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  )
    .lean()
    .exec();
};

export const markAllNotificationsAsRead = async (
  receiverId: string
): Promise<void> => {
  await NotificationModel.updateMany(
    { receiverId, isRead: false },
    { isRead: true }
  ).exec();
};
