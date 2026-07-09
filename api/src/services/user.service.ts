import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { Role, Status } from "../../generated/prisma/enums";

export const userService = {

    // =====================
    // LIST USERS
    // =====================
    async list(page: number = 1, limit: number = 0) {

        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const [totalItems, data] = await Promise.all([
            prisma.user.count(),
            prisma.user.findMany({
                skip,
                take,
                include: {
                    professionalProfile: true,
                    services: true
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

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                professionalProfile: true,
                services: true,
                clientAppointments: true,
                professionalAppointments: true,
                Clientreviews: true,
                professionalReviews: true
            }
        });

        if (!user) {
            throw AppError.badRequest("User not found");
        }

        return user;
    },

    // =====================
    // CREATE USER
    // =====================
    async create(data: {
        name: string;
        lastName:string;
        email: string;
        password: string;
        role?: Role;
    }) {

        // 1. Validar email único
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            throw AppError.badRequest("Email already exists");
        }

        return prisma.user.create({
            data: {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role ?? Role.CLIENT,
                status: Status.ACTIVE
            },
            include: {
                professionalProfile: true
            }
        });
    },

    // =====================
    // UPDATE USER
    // =====================
    async update(id: number, data: any) {

        await this.getById(id);

        if (data.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email }
            });

            if (existingUser && existingUser.id !== id) {
                throw AppError.badRequest("El correo ya existe");
            }
        }

        return prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
                role: data.role,
                status: data.status
            },
            include: {
                professionalProfile: true
            }
        });
    },

    // =====================
    // TOGGLE STATUS
    // =====================
    async toggleStatus(id: number) {
        const user = await this.getById(id);
        const newStatus = user.status === 'ACTIVE' ? Status.INACTIVE : Status.ACTIVE;
        return prisma.user.update({
            where: { id },
            data: { status: newStatus },
            include: { professionalProfile: true }
        });
    },

    // =====================
    // DELETE USER
    // =====================
    async delete(id: number) {

        await this.getById(id);

        return prisma.user.delete({
            where: { id }
        });
    }
};