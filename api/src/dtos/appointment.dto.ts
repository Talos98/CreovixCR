import { z } from "zod";

export const createAppointmentSchema = z.object({
    clientId: z.number().int().positive(),
    professionalId: z.number().int().positive(),
    serviceId: z.number().int().positive(),

    date: z.string(),

    startTime: z.string(),
    endTime: z.string().optional(),

    mode: z.enum(["ONLINE", "IN_PERSON"]),

    description: z.string().optional(),
});

export type CreateAppointmentDto = z.infer<typeof createAppointmentSchema>;