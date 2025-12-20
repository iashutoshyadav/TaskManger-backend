import mongoose from "mongoose";
import {
  TaskModel,
  ITask,
  TaskPriority,
  TaskStatus,
} from "../models/task.model";

/* ================================
   TYPES
================================ */

type CreateTaskData = {
  title: string;
  description?: string;
  dueDate: Date;
  priority: TaskPriority;
  creatorId: mongoose.Types.ObjectId;
  assignedToId?: mongoose.Types.ObjectId | null; // ✅ FIX
  status?: TaskStatus;
};

type UpdateTaskData = {
  title?: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: mongoose.Types.ObjectId | null; // ✅ FIX
};

type FindTasksForUserParams = {
  userId: string;
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
};

/* ================================
   CREATE
================================ */

export const createTask = async (
  data: CreateTaskData
): Promise<ITask> => {
  return TaskModel.create({
    ...data,
    status: data.status ?? TaskStatus.TODO,
  });
};

/* ================================
   READ SINGLE
================================ */

export const getTaskById = async (
  id: string
): Promise<ITask | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return TaskModel.findById(id)
    .populate("creatorId", "_id name email")
    .populate("assignedToId", "_id name email")
    .lean()
    .exec();
};

/* ================================
   UPDATE
================================ */

export const updateTaskById = async (
  id: string,
  data: Partial<UpdateTaskData>
): Promise<ITask | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return TaskModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("creatorId", "_id name email")
    .populate("assignedToId", "_id name email")
    .lean()
    .exec();
};

/* ================================
   DELETE
================================ */

export const deleteTaskById = async (
  id: string
): Promise<ITask | null> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null;
  }

  return TaskModel.findByIdAndDelete(id)
    .lean()
    .exec();
};

/* ================================
   READ (LIST FOR USER)
================================ */

export const findTasksForUser = async ({
  userId,
  page = 1,
  limit = 10,
  status,
  priority,
}: FindTasksForUserParams): Promise<ITask[]> => {
  const skip = (page - 1) * limit;

  const filters: any = {
    $or: [
      { creatorId: new mongoose.Types.ObjectId(userId) },
      { assignedToId: new mongoose.Types.ObjectId(userId) },
    ],
  };

  if (status) filters.status = status;
  if (priority) filters.priority = priority;

  return TaskModel.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("creatorId", "_id name email")
    .populate("assignedToId", "_id name email")
    .lean()
    .exec();
};

/* ================================
   COUNT (OPTIONAL)
================================ */

export const countTasksForUser = async (
  userId: string,
  status?: TaskStatus,
  priority?: TaskPriority
): Promise<number> => {
  const filters: any = {
    $or: [
      { creatorId: new mongoose.Types.ObjectId(userId) },
      { assignedToId: new mongoose.Types.ObjectId(userId) },
    ],
  };

  if (status) filters.status = status;
  if (priority) filters.priority = priority;

  return TaskModel.countDocuments(filters);
};
