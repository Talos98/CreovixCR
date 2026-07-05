import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { Status } from "../../generated/prisma/enums";

export const specialtyService = {

    async list() {
        return prisma.specialty.findMany({
            orderBy: { name: "asc" }
        });
    },

    async getById(id: number) {
        return prisma.specialty.findUnique({
            where: { id }
        });
    },

    async toggleStatus(id: number) {
        const specialty = await this.getById(id);
        if (!specialty) throw AppError.badRequest("Specialty not found");
        const newStatus = specialty.status === 'ACTIVE' ? Status.INACTIVE : Status.ACTIVE;
        return prisma.specialty.update({
            where: { id },
            data: { status: newStatus }
        });
    }
};