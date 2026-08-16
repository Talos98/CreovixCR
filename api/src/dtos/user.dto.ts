import passport from "passport";
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().min(1, "Role is required")
});

export const updateUserSchema = createUserSchema.partial();
export const loginUserSchema = z.object({
    email: z
    .email({error: "Debe ingresar un correo válido"}),
    password: z
    .string()
    .min(6, {error: "La contraseña debe tener al menos 6 caracteres"}),
})

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type LoginUserDto= z.infer<typeof loginUserSchema>;