import { z } from "zod";
import { TaskPriority, TaskStatus } from "../models/task.model";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const CreateTaskDto = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  description: z.string().trim().optional(),
  dueDate: z.coerce.date(),
  priority: z.nativeEnum(TaskPriority),
  assignedToId: objectId.nullable().optional(),
});

export const UpdateTaskDto = z
  .object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().trim().optional(),
    dueDate: z.coerce.date().optional(),
    priority: z.nativeEnum(TaskPriority).optional(),
    status: z.nativeEnum(TaskStatus).optional(),
    assignedToId: objectId.nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be updated",
  });

export type CreateTaskInput = z.infer<typeof CreateTaskDto>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskDto>;
