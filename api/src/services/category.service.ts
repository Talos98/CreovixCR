import { prisma } from "../config/prisma";
import { AppError } from "../utils/app-error";
import { Status } from "../../generated/prisma/enums";

export const categoryService = {
    async list() {
        return await prisma.category.findMany({
            orderBy: { name: "asc" }
        });
    },

    async getById(id: number) {
        return await prisma.category.findUnique({
            where: { id }
        });
    },

    async toggleStatus(id: number) {
        const category = await this.getById(id);
        if (!category) throw AppError.badRequest("Category not found");
        const newStatus = category.status === 'ACTIVE' ? Status.INACTIVE : Status.ACTIVE;
        return prisma.category.update({
            where: { id },
            data: { status: newStatus }
        });
    }
};
