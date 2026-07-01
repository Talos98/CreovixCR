import { z } from "zod";

export const createProfessionalProfileSchema = z.object({
    userId: z.number().int().positive(),
    title: z.string(),
    description: z.string().optional(),
    yearsExperience: z.number().int().nonnegative(),
    phone: z.string(),
    location: z.string(),
    baseRate: z.number(),
    mode: z.enum(["ONLINE", "OFFLINE"]),
    isAvailable: z.boolean(),
    profileImage: z.string().optional()
});

export const updateProfessionalProfileSchema = createProfessionalProfileSchema.partial();

export type CreateProfessionalProfileDto = z.infer<typeof createProfessionalProfileSchema>;
export type UpdateProfessionalProfileDto = z.infer<typeof updateProfessionalProfileSchema>;
