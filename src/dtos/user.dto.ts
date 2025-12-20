import { z } from "zod";

export const UpdateUserProfileDto = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .max(50, "Name must not exceed 50 characters")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one profile field must be updated",
  });

export type UpdateUserProfileInput = z.infer<
  typeof UpdateUserProfileDto
>;
