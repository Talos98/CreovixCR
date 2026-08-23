import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
}).strict();

export const updateProfileSchema = z.object({
    name: z.string().min(1, "El nombre es obligatorio"),
    lastName: z.string().min(1, "Los apellidos son obligatorios"),
    email: z.email("Ingrese un correo válido")
}).strict();

export const loginUserSchema = z.object({
    email: z.email({
        error: "Debe ingresar un correo válido"
    }),
    password: z.string().min(6, {
        error: "La contraseña debe tener al menos 6 caracteres"
    }),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;