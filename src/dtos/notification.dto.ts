import { z } from "zod";
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/);

export const CreateNotificationDto = z.object({receiverId: objectId,taskId: objectId,
  message: z.string().trim().min(1).max(255),
});

export const MarkNotificationReadDto = z.object({notificationId: objectId,});
export type CreateNotificationInput = z.infer<typeof CreateNotificationDto>;
export type MarkNotificationReadInput = z.infer<typeof MarkNotificationReadDto>;
