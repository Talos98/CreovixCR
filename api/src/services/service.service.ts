import { ServiceMode, Status } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";

export const serviceService = {

    // =====================
    // LIST SERVICES
    // =====================
    async list(page: number = 1, limit: number = 0) {
        const paginar = limit > 0;

        const skip = paginar ? (page - 1) * limit : undefined;
        const take = paginar ? limit : undefined;

        const [totalItems, data] = await Promise.all([
            prisma.service.count(),
            prisma.service.findMany({
                skip,
                take,
                include: {
                    category: true,
                    professional: true,
                    specialties: true
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
        const service = await prisma.service.findUnique({
            where: { id },
            include: {
                category: true,
                professional: true,
                specialties: true
            }
        });

        if (!service) {
            throw AppError.badRequest("Service not found");
        }

        return service;
    },

    // =====================
    // Create Service
    // =====================

    async create(data: {
        name: string;
        description: string;
        price: number;
        duration: number;
        mode: string;
        status: string;
        categoryId: number;
        professionalId: number;
        specialtyIds?: number[];
    }) {

        await this.validateCategory(data.categoryId);
        await this.validateProfessional(data.professionalId);

        return prisma.service.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                categoryId: data.categoryId,
                professionalId: data.professionalId,
                mode: data.mode === 'IN_PERSON' ? ServiceMode.IN_PERSON : ServiceMode.ONLINE,
                status: data.status === 'ACTIVE' ? Status.ACTIVE : Status.INACTIVE,
                specialties: data.specialtyIds?.length
                    ? { connect: data.specialtyIds.map(id => ({ id })) }
                    : undefined
            },
            include: {
                category: true,
                professional: true,
                specialties: true
            }
        });
    },

    // =====================
    // Update Service
    // =====================

    async update(id: number, data: any) {
        await this.getById(id);

        if (data.categoryId) {
            await this.validateCategory(data.categoryId);
        }

        if (data.professionalId) {
            await this.validateProfessional(data.professionalId);
        }

        const specialtiesUpdate = data.specialtyIds
            ? { set: (data.specialtyIds as number[]).map(id => ({ id })) }
            : undefined;

        return prisma.service.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                duration: data.duration,
                categoryId: data.categoryId,
                professionalId: data.professionalId,
                mode: data.mode === 'IN_PERSON' ? ServiceMode.IN_PERSON : ServiceMode.ONLINE,
                status: data.status === 'ACTIVE' ? Status.ACTIVE : Status.INACTIVE,
                specialties: specialtiesUpdate
            },
            include: {
                category: true,
                professional: true,
                specialties: true
            }
        });
    },


    // =====================
    // TOGGLE STATUS
    // =====================
    async toggleStatus(id: number) {
        const service = await this.getById(id);
        const newStatus = service.status === 'ACTIVE' ? Status.INACTIVE : Status.ACTIVE;
        return prisma.service.update({
            where: { id },
            data: { status: newStatus },
            include: { category: true, professional: true, specialties: true }
        });
    },

    // =====================
    // Validations
    // =====================

    async validateCategory(categoryId: number) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            throw AppError.badRequest("Category does not exist");
        }
    },

    async validateProfessional(professionalId: number) {
        const professional = await prisma.user.findUnique({
            where: { id: professionalId }
        });

        if (!professional) {
            throw AppError.badRequest("Professional does not exist");
        }
    }


};