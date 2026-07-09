import { z } from "zod";

export const createProfessionalSchema = z.object({

    // User
    name: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "Los apellidos son obligatorios"),
    email: z.string().email("Correo inválido"),

    // Professional Profile
    title: z.string().min(1, "El título es obligatorio"),
    description: z.string().optional(),
    yearsExperience: z.number().int().nonnegative(),
    phone: z.string().min(1, "El teléfono es obligatorio"),
    location: z.string().min(1, "La ubicación es obligatoria"),
    baseRate: z.number().positive("Debe ser mayor a 0"),
    mode: z.enum(["ONLINE", "IN_PERSON"]),
    isAvailable: z.boolean(),
    profileImage: z.string().optional()
});


export type CreateProfessionalDto =
    z.infer<typeof createProfessionalSchema>;

export const updateProfessionalSchema =
    createProfessionalSchema.partial();


export type UpdateProfessionalDto =
    z.infer<typeof updateProfessionalSchema>;

