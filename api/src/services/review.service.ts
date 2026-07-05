import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { AppointmentStatus } from "../../generated/prisma/enums";

export const reviewService = {

    // =====================
    // LIST REVIEWS
    // =====================
    async list(page: number = 1, limit: number = 0) {

        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const [totalItems, data] = await Promise.all([
            prisma.review.count(),
            prisma.review.findMany({
                skip,
                take,
                include: {
                    client: true,
                    professional: true,
                    appointment: true
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

        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                client: true,
                professional: true,
                appointment: true
            }
        });

        if (!review) {
            throw AppError.badRequest("Review not found");
        }

        return review;
    },

    // =====================
    // CREATE REVIEW
    // =====================
    async create(data: {
        clientId: number;
        professionalId: number;
        appointmentId: number;
        rating: number;
        comment?: string;
    }) {

        // 1. Validate appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id: data.appointmentId }
        });

        if (!appointment) {
            throw AppError.badRequest("Appointment does not exist");
        }

        // 2. Only reviews if status is COMPLETED
        if (appointment.status !== AppointmentStatus.COMPLETED) {
            throw AppError.badRequest("You can only review completed appointments");
        }

        // 3. Avoid duplicates (1 review per appointment)
        const existingReview = await prisma.review.findUnique({
            where: { appointmentId: data.appointmentId }
        });

        if (existingReview) {
            throw AppError.badRequest("Review already exists for this appointment");
        }

        // 4. Validate rating
        if (data.rating < 1 || data.rating > 5) {
            throw AppError.badRequest("Rating must be between 1 and 5");
        }

        return prisma.review.create({
            data: {
                clientId: data.clientId,
                professionalId: data.professionalId,
                appointmentId: data.appointmentId,
                rating: data.rating,
                comment: data.comment
            },
            include: {
                client: true,
                professional: true,
                appointment: true
            }
        });
    }
};