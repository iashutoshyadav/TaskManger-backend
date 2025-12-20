import mongoose from "mongoose";
import * as repo from "../repositories/task.repository";
import { getIO } from "../config/socket";
import { TaskStatus, TaskPriority } from "../models/task.model";

/* Create Task */
export const createNewTask = async (input: any, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID");
  }

  const dueDate = new Date(input.dueDate);
  if (isNaN(dueDate.getTime())) {
    throw new Error("Invalid due date");
  }

  const task = await repo.createTask({
    title: input.title,
    description: input.description,
    priority: input.priority,
    status: TaskStatus.TODO,
    dueDate,
    creatorId: new mongoose.Types.ObjectId(userId),
    assignedToId: input.assignedToId
      ? new mongoose.Types.ObjectId(input.assignedToId)
      : null,
  });

  const io = getIO();
  io.to(userId).emit("task:created", task);

  if (input.assignedToId) {
    io.to(input.assignedToId).emit("task:assigned", task);
  }

  return task;
};

/* Update Task */

export const updateTask = async (
  taskId: string,
  input: any,
  userId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await repo.getTaskById(taskId);
  if (!task) throw new Error("Task not found");

  // 🔐 Authorization
  if (task.creatorId.toString() !== userId) {
  const err: any = new Error("Forbidden");
  err.status = 403;
  throw err;
}


  const updateData: any = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined)
    updateData.description = input.description;
  if (input.priority !== undefined)
    updateData.priority = input.priority;
  if (input.status !== undefined)
    updateData.status = input.status;
  if (input.dueDate !== undefined) {
    const date = new Date(input.dueDate);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid due date");
    }
    updateData.dueDate = date;
  }

  if ("assignedToId" in input) {
    updateData.assignedToId = input.assignedToId
      ? new mongoose.Types.ObjectId(input.assignedToId)
      : null;
  }

  const updated = await repo.updateTaskById(taskId, updateData);

  const io = getIO();
  io.to(task.creatorId.toString()).emit("task:updated", updated);
  if (task.assignedToId) {
    io.to(task.assignedToId.toString()).emit("task:updated", updated);
  }

  return updated;
};

/* Delete Task */

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await repo.getTaskById(taskId);
  if (!task) throw new Error("Task not found");

  if (task.creatorId.toString() !== userId) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }

  await repo.deleteTaskById(taskId);

  const io = getIO();
  io.to(task.creatorId.toString()).emit("task:deleted", taskId);
};

/* Fetch Task */
export const fetchTasks = async ({
  userId,
  status,
  priority,
  page,
  limit,
}: {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page: number;
  limit: number;
}) => {
  const { tasks, total } = await repo.findTasksForUser({
    userId,
    status,
    priority,
    page,
    limit,
  });

  return { tasks, total };
};
