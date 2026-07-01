import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { Role, ServiceMode } from "../../generated/prisma/enums";

export const professionalProfileService = {

    // =====================
    // LIST PROFILES
    // =====================
    async list(page: number = 1, limit: number = 0) {

        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const [totalItems, data] = await Promise.all([
            prisma.professionalProfile.count(),
            prisma.professionalProfile.findMany({
                skip,
                take,
                include: {
                    user: true
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

        const profile = await prisma.professionalProfile.findUnique({
            where: { id },
            include: {
                user: true
            }
        });

        if (!profile) {
            throw AppError.badRequest("Professional profile not found");
        }

        return profile;
    },

    // =====================
    // CREATE PROFILE
    // =====================
    async create(data: {
        userId: number;
        title: string;
        description?: string;
        yearsExperience: number;
        phone: string;
        location: string;
        baseRate: number;
        mode: ServiceMode;
    }) {

        // 1. Validar user existe
        const user = await prisma.user.findUnique({
            where: { id: data.userId }
        });

        if (!user) {
            throw AppError.badRequest("User does not exist");
        }

        // 2. Validar que sea PROFESSIONAL
        if (user.role !== Role.PROFESSIONAL) {
            throw AppError.badRequest("User must be a professional");
        }

        // 3. Evitar duplicado de perfil
        const existingProfile = await prisma.professionalProfile.findUnique({
            where: { userId: data.userId }
        });

        if (existingProfile) {
            throw AppError.badRequest("Professional profile already exists");
        }

        // 4. Crear perfil
        return prisma.professionalProfile.create({
            data: {
                userId: data.userId,
                title: data.title,
                description: data.description,
                yearsExperience: data.yearsExperience,
                phone: data.phone,
                location: data.location,
                baseRate: data.baseRate,
                mode: data.mode
            },
            include: {
                user: true
            }
        });
    },

    // =====================
    // UPDATE PROFILE
    // =====================
    async update(id: number, data: any) {

        await this.getById(id);

        return prisma.professionalProfile.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                yearsExperience: data.yearsExperience,
                phone: data.phone,
                location: data.location,
                baseRate: data.baseRate,
                mode: data.mode
            },
            include: {
                user: true
            }
        });
    },

    // =====================
    // DELETE PROFILE
    // =====================
    async delete(id: number) {

        await this.getById(id);

        return prisma.professionalProfile.delete({
            where: { id }
        });
    }
};