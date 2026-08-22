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

        await this.validateClient(data.clientId);
        await this.validateProfessional(data.professionalId);
        await this.validateActiveService(data.serviceId);

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
                status: { notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.REJECTED] },
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
        const fromStatus = appointment.status as AppointmentStatus;

        // Matriz de transiciones válidas
        const transicionesValidas: Record<string, AppointmentStatus[]> = {
            PENDING: [AppointmentStatus.ACCEPTED, AppointmentStatus.REJECTED, AppointmentStatus.CANCELLED],
            ACCEPTED: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
            REJECTED: [],
            CANCELLED: [],
            COMPLETED: [],
        };

        const permitidas = transicionesValidas[fromStatus] ?? [];

        if (!permitidas.includes(status)) {
            throw AppError.badRequest(
                `No se puede cambiar de ${fromStatus} a ${status}`
            );
        }

        // Rechazar y Cancelar requieren motivo
        if ((status === AppointmentStatus.REJECTED || status === AppointmentStatus.CANCELLED) && !comment?.trim()) {
            throw AppError.badRequest("Debe indicar un motivo");
        }

        // No completar antes de la fecha/hora programada
        if (status === AppointmentStatus.COMPLETED) {
            const now = new Date();
            const endTime = new Date(appointment.endTime);
            if (now < endTime) {
                throw AppError.badRequest(
                    "No se puede completar la cita antes de la fecha y hora programadas"
                );
            }
        }

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
    async validateClient(userId: number) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw AppError.badRequest("El cliente no existe");
        if (user.status !== 'ACTIVE') throw AppError.badRequest("El cliente no está activo");
    },

    async validateProfessional(userId: number) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { professionalProfile: true }
        });
        if (!user) throw AppError.badRequest("El profesional no existe");
        if (user.status !== 'ACTIVE') throw AppError.badRequest("El profesional no está activo");
        if (!user.professionalProfile?.isAvailable) throw AppError.badRequest("El profesional no está disponible");
    },

    async validateActiveService(serviceId: number) {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) throw AppError.badRequest("El servicio no existe");
        if (service.status !== 'ACTIVE') throw AppError.badRequest("El servicio no está activo");
    }
};