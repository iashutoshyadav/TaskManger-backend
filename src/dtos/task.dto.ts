import { z } from "zod";
import { TaskPriority, TaskStatus } from "../models/task.model";
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const CreateTaskDto = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z.string(),
  priority: z.nativeEnum(TaskPriority),
  assignedToId: objectId.nullable().optional(),
});


export const UpdateTaskDto = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: objectId.nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
