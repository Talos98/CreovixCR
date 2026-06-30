import { z } from "zod";

export const createAppointmentSchema = z.object({
    clientId: z.number().int().positive(),
    professionalId: z.number().int().positive(),
    serviceId: z.number().int().positive(),
    date: z.string(), 
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;