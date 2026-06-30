import { z } from "zod";

export const createProfessionalProfileSchema = z.object({
    userId: z.number().int().positive(),
    bio: z.string().optional(),
    experience: z.number().int().nonnegative().optional(),
    specialtyId: z.number().int().positive()
});

export const updateProfessionalProfileSchema = createProfessionalProfileSchema.partial();

export type CreateProfessionalProfileDto = z.infer<typeof createProfessionalProfileSchema>;
export type UpdateProfessionalProfileDto = z.infer<typeof updateProfessionalProfileSchema>;
