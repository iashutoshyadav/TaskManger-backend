import { z } from "zod";

export const UpdateUserProfileDto = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .optional(),
});

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileDto>;
