import mongoose from "mongoose";
import {
  TaskModel,
  TaskStatus,
  TaskPriority,
} from "../models/task.model";

export const createTask = (data: any) =>
  TaskModel.create(data);

export const getTaskById = (id: string) =>
  TaskModel.findById(id)
    .populate("creatorId", "_id name email")
    .populate("assignedToId", "_id name email")
    .exec();

export const updateTaskById = (id: string, data: any) =>
  TaskModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("creatorId", "_id name email")
    .populate("assignedToId", "_id name email")
    .exec();

export const deleteTaskById = (id: string) =>
  TaskModel.findByIdAndDelete(id).exec();

/* ✅ PAGINATED + COUNT */
export const findTasksForUser = async ({
  userId,
  status,
  priority,
  page = 1,
  limit = 20,
}: {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
}) => {
  const filters: any = {
    $or: [
      { creatorId: new mongoose.Types.ObjectId(userId) },
      { assignedToId: new mongoose.Types.ObjectId(userId) },
    ],
  };

  if (status) filters.status = status;
  if (priority) filters.priority = priority;

  const [tasks, total] = await Promise.all([
    TaskModel.find(filters)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("creatorId", "_id name email")
      .populate("assignedToId", "_id name email")
      .lean()
      .exec(),
    TaskModel.countDocuments(filters),
  ]);

  return { tasks, total };
};
