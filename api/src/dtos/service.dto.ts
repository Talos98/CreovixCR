import { z } from "zod";

export const createServiceSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    price: z.number().positive(),
    duration: z.number().int().positive(),
    categoryId: z.number().int().positive(),
    professionalId: z.number().int().positive(),
    mode: z.enum(["ONLINE", "IN_PERSON"]),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    specialtyIds: z.array(z.number().int().positive()).optional()
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;
