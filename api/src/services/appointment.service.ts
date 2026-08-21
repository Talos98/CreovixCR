import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { AppointmentStatus, ServiceMode } from "../../generated/prisma/enums";

export const appointmentService = {

    // =====================
    // LIST APPOINTMENTS
    // =====================
    async list(page: number = 1, limit: number = 0) {

        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const [totalItems, data] = await Promise.all([
            prisma.appointment.count(),
            prisma.appointment.findMany({
                skip,
                take,
                include: {
                    client: true,
                    professional: true,
                    service: true
                },
                orderBy: { createdAt: "desc" }
            })
        ]);

        const totalPages = paginar ? Math.ceil(totalItems / limit) : 1;

        return {
            meta: {
                totalItems,
                totalPages,
                currentPage: paginar ? page : 1,
                limit: paginar ? limit : totalItems
            },
            data
        };
    },

    // =====================
    // GET BY ID
    // =====================
    async getById(id: number) {

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
                client: true,
                professional: true,
                service: true,
                review: true,
                statusLogs: { orderBy: { changedAt: "desc" } }
            }
        });

        if (!appointment) {
            throw AppError.badRequest("Appointment not found");
        }

        return appointment;
    },

    // =====================
    // CREATE APPOINTMENT
    // =====================
    async create(data: {
        date: string;
        startTime: string;
        endTime: string;
        mode: ServiceMode;
        clientId: number;
        professionalId: number;
        serviceId: number;
        description?: string;
    }) {

        await this.validateUser(data.clientId);
        await this.validateUser(data.professionalId);
        await this.validateService(data.serviceId);

        const COSTA_RICA_OFFSET = '-06:00';

        
        const date = new Date(
            `${data.date}T12:00:00${COSTA_RICA_OFFSET}`
        );

       
        const startDateTime = new Date(
            `${data.date}T${data.startTime}:00${COSTA_RICA_OFFSET}`
        );

        const endDateTime = new Date(
            `${data.date}T${data.endTime}:00${COSTA_RICA_OFFSET}`
        );

        if (
            isNaN(date.getTime()) ||
            isNaN(startDateTime.getTime()) ||
            isNaN(endDateTime.getTime())
        ) {
            throw AppError.badRequest("Fecha u hora inválida");
        }

        if (endDateTime <= startDateTime) {
            throw AppError.badRequest(
                "La hora de finalización debe ser mayor a la de inicio"
            );
        }


        const todayString = new Date().toLocaleDateString('en-CA', {
            timeZone: 'America/Costa_Rica'
        });

        if (data.date < todayString) {
            throw AppError.badRequest(
                "La fecha no puede ser pasada"
            );
        }

        const dayStart = new Date(`${data.date}T00:00:00${COSTA_RICA_OFFSET}`);
        const dayEnd = new Date(`${data.date}T23:59:59${COSTA_RICA_OFFSET}`);

        const overlapping = await prisma.appointment.findFirst({
            where: {
                professionalId: data.professionalId,
                date: { gte: dayStart, lte: dayEnd },
                AND: [
                    { startTime: { lt: endDateTime } },
                    { endTime: { gt: startDateTime } }
                ]
            }
        });

        if (overlapping) {
            throw AppError.badRequest(
                "El profesional ya tiene una cita en ese horario"
            );
        }

        return prisma.appointment.create({
            data: {
                date,
                startTime: startDateTime,
                endTime: endDateTime,
                mode: data.mode,
                description: data.description,
                status: AppointmentStatus.PENDING,
                clientId: data.clientId,
                professionalId: data.professionalId,
                serviceId: data.serviceId
            },
            include: {
                client: true,
                professional: true,
                service: true
            }
        });
    },
    // =====================
    // UPDATE STATUS
    // =====================
    async updateStatus(id: number, status: AppointmentStatus, comment?: string) {

        const appointment = await this.getById(id);
        const fromStatus = appointment.status;

        const [updated] = await prisma.$transaction([
            prisma.appointment.update({
                where: { id },
                data: { status },
                include: {
                    client: true,
                    professional: true,
                    service: true,
                    statusLogs: { orderBy: { changedAt: "desc" } }
                }
            }),
            prisma.appointmentStatusLog.create({
                data: {
                    appointmentId: id,
                    fromStatus,
                    toStatus: status,
                    comment: comment ?? null
                }
            })
        ]);

        return updated;
    },

    // =====================
    // VALIDATIONS
    // =====================
    async validateUser(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw AppError.badRequest("User does not exist");
        }
    },

    async validateService(serviceId: number) {
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            throw AppError.badRequest("Service does not exist");
        }
    }
};