import mongoose from "mongoose";
import { CreateTaskInput, UpdateTaskInput } from "../dtos/task.dto";
import * as taskRepo from "../repositories/task.repository";
import { getIO } from "../config/socket";
import { TaskStatus, TaskPriority } from "../models/task.model";

/* ===========================
   CREATE TASK
=========================== */
export const createNewTask = async (
  input: CreateTaskInput,
  creatorId: string
) => {
  // validations
  if (input.dueDate < new Date()) {
    throw new Error("Due date cannot be in the past");
  }

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    throw new Error("Invalid creator ID");
  }

  if (
    input.assignedToId &&
    !mongoose.Types.ObjectId.isValid(input.assignedToId)
  ) {
    throw new Error("Invalid assigned user ID");
  }

  // create task
  const task = await taskRepo.createTask({
    title: input.title,
    description: input.description,
    dueDate: input.dueDate,
    priority: input.priority,
    status: TaskStatus.TODO,
    creatorId: new mongoose.Types.ObjectId(creatorId),
    assignedToId: input.assignedToId
      ? new mongoose.Types.ObjectId(input.assignedToId)
      : null, // ✅ IMPORTANT FIX
  });

  const io = getIO();

  // notify creator
  io.to(creatorId).emit("task:updated", task);

  // notify assignee
  if (input.assignedToId) {
    io.to(input.assignedToId).emit("task:updated", task);
    io.to(input.assignedToId).emit("task:assigned", {
      message: "You have been assigned a new task",
      task,
    });
  }

  return task;
};

/* ===========================
   UPDATE TASK
=========================== */
export const updateTask = async (
  taskId: string,
  input: UpdateTaskInput
) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  if (
    input.assignedToId &&
    !mongoose.Types.ObjectId.isValid(input.assignedToId)
  ) {
    throw new Error("Invalid assigned user ID");
  }

  const existingTask = await taskRepo.getTaskById(taskId);
  if (!existingTask) {
    throw new Error("Task not found");
  }

  const updateData: {
    title?: string;
    description?: string;
    dueDate?: Date;
    priority?: TaskPriority;
    status?: TaskStatus;
    assignedToId?: mongoose.Types.ObjectId | null;
  } = {};

  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined)
    updateData.description = input.description;
  if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
  if (input.priority !== undefined) updateData.priority = input.priority;
  if (input.status !== undefined) updateData.status = input.status;

  // ✅ SUPPORT ASSIGN + UNASSIGN
  if ("assignedToId" in input) {
    updateData.assignedToId = input.assignedToId
      ? new mongoose.Types.ObjectId(input.assignedToId)
      : null;
  }

  const updatedTask = await taskRepo.updateTaskById(
    taskId,
    updateData
  );

  if (!updatedTask) {
    throw new Error("Task not found");
  }

  const io = getIO();

  // notify creator
  io.to(existingTask.creatorId.toString()).emit(
    "task:updated",
    updatedTask
  );

  // notify previous assignee
  if (existingTask.assignedToId) {
    io.to(existingTask.assignedToId.toString()).emit(
      "task:updated",
      updatedTask
    );
  }

  // notify new assignee
  if (
    input.assignedToId &&
    existingTask.assignedToId?.toString() !== input.assignedToId
  ) {
    io.to(input.assignedToId).emit("task:assigned", {
      message: "You have been assigned a task",
      task: updatedTask,
    });
  }

  return updatedTask;
};

/* ===========================
   DELETE TASK
=========================== */
export const deleteTask = async (taskId: string) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid task ID");
  }

  const task = await taskRepo.getTaskById(taskId);
  if (!task) {
    throw new Error("Task not found");
  }

  await taskRepo.deleteTaskById(taskId);

  const io = getIO();

  // notify creator
  io.to(task.creatorId.toString()).emit("task:deleted", taskId);

  // notify assignee
  if (task.assignedToId) {
    io.to(task.assignedToId.toString()).emit(
      "task:deleted",
      taskId
    );
  }

  return true;
};

/* ===========================
   FETCH TASKS
=========================== */
interface FetchTasksParams {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  page?: number;
  limit?: number;
}

export const fetchTasks = async ({
  userId,
  status,
  priority,
  page = 1,
  limit = 20,
}: FetchTasksParams) => {
  return taskRepo.findTasksForUser({
    userId,
    status,
    priority,
    page,
    limit,
  });
};
