import { prisma } from "../config/prisma";

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
    }
};
