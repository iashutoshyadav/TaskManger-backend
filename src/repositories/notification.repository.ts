import mongoose from "mongoose";
import { NotificationModel, INotification } from "../models/notification.model";

export const createNotification = async (
  data: {
    receiverId: mongoose.Types.ObjectId;
    taskId: mongoose.Types.ObjectId;
    message: string;
  }
): Promise<INotification> => {
  return NotificationModel.create(data);
};

export const getNotificationsByUser = async (
  receiverId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    NotificationModel.find({ receiverId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("taskId", "title status priority")
      .exec(),
    NotificationModel.countDocuments({ receiverId }),
  ]);

  return { notifications, total };
};

export const getUnreadNotificationsByUser = async (
  receiverId: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    NotificationModel.find({ receiverId, isRead: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("taskId", "title status priority")
      .exec(),
    NotificationModel.countDocuments({
      receiverId,
      isRead: false,
    }),
  ]);

  return { notifications, total };
};

export const findNotificationById = async (
  id: string
): Promise<INotification | null> => {
  return NotificationModel.findById(id).exec();
};

export const markNotificationAsRead = async (
  id: string
): Promise<INotification | null> => {
  return NotificationModel.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  ).exec();
};

export const markAllNotificationsAsRead = async (
  receiverId: string
): Promise<void> => {
  await NotificationModel.updateMany(
    { receiverId, isRead: false },
    { isRead: true }
  );
};
