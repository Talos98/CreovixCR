import { z } from "zod";

export const createReviewSchema = z.object({
    clientId: z.number().int().positive(),
    professionalId: z.number().int().positive(),
    appointmentId: z.number().int().positive(),
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
});

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
