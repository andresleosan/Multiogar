import { z } from "zod";

export const chatSessionInputSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .max(24)
    .regex(/^\+?[0-9()\-\s]{7,24}$/, "El teléfono no tiene un formato válido.")
    .optional()
    .or(z.literal("")),
});

export const chatMessageInputSchema = z.object({
  text: z.string().trim().min(1).max(1200),
});

export type ChatSessionInput = z.infer<typeof chatSessionInputSchema>;
export type ChatMessageInput = z.infer<typeof chatMessageInputSchema>;
