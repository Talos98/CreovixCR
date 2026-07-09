import { z } from "zod";

export const createProfessionalProfileSchema = z.object({

    userId: z.number().int().positive(),

    title: z.string().min(1,"El título es obligaotorio"),
    description: z.string().optional(),
    yearsExperience: z.number().int().nonnegative(),
    phone: z.string().min(1,"El teléfono es obligatorio"),
    location: z.string().min(1,"La ubicación es obligatoria"),
    baseRate: z.number().positive("Debe ser mayor a 0"),
    mode: z.enum(["ONLINE", "IN_PERSON"]),
    isAvailable: z.boolean(),
    profileImage: z.string().optional()
});

export const updateProfessionalProfileSchema = createProfessionalProfileSchema.partial();

export type CreateProfessionalProfileDto = z.infer<typeof createProfessionalProfileSchema>;
export type UpdateProfessionalProfileDto = z.infer<typeof updateProfessionalProfileSchema>;
