import { prisma } from "../config/prisma";

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
    }
};