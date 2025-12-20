import {z} from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/,"Invalid MongoDB ObjectId");
export const CreateNotificationDto = z.object({
    receiverId:objectId,
    taskId:objectId,
    message: z
    .string()
    .trim()
    .min(1,"Message cannot be empty")
    .max(255,"massage too long"),
});
export const MarkNotificationReadDto = z.object({
  notificationId:objectId,
});
export type CreateNotificationInput = z.infer<typeof CreateNotificationDto>;
export type MarkNotificationReadInput = z.infer<typeof MarkNotificationReadDto>;