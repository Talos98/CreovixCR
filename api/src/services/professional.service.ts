import { prisma } from "../config/prisma";
import { Role, Status } from "../../generated/prisma/enums";
import { AppError } from "../utils/app-error";

export const professionalService = {

    async create(data: {
        name: string;
        lastName: string;
        email: string;

        title: string;
        description?: string;
        yearsExperience: number;
        phone: string;
        location: string;
        baseRate: number;
        mode: "ONLINE" | "IN_PERSON";
        isAvailable: boolean;
        profileImage?: string;
    }) {


        const existingUser = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });

        if (existingUser) {
            throw AppError.badRequest("Email already exists");
        }


        return await prisma.$transaction(async (tx) => {


            const user = await tx.user.create({
                data: {
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email,


                    password: "temporary-password",

                    role: Role.PROFESSIONAL,
                    status: Status.ACTIVE
                }
            });



            const profile = await tx.professionalProfile.create({
                data: {
                    userId: user.id,

                    title: data.title,
                    description: data.description,
                    yearsExperience: data.yearsExperience,
                    phone: data.phone,
                    location: data.location,
                    baseRate: data.baseRate,
                    mode: data.mode,
                    isAvailable: data.isAvailable,
                    profileImage:
                        data.profileImage ?? "image-not-found.jpg"
                }
            });

            return {
                user,
                profile
            };
        });
    },
    async update(id: number, data: any) {

        const professional = await prisma.professionalProfile.findUnique({
            where: {
                id
            },
            include: {
                user: true
            }
        });


        if (!professional) {
            throw AppError.badRequest("Professional not found");
        }


        if (data.email) {

            const existingUser = await prisma.user.findUnique({
                where: {
                    email: data.email
                }
            });


            if (
                existingUser &&
                existingUser.id !== professional.userId
            ) {
                throw AppError.badRequest("Email already exists");
            }
        }


        return await prisma.$transaction(async (tx) => {


            const user = await tx.user.update({
                where: {
                    id: professional.userId
                },
                data: {
                    name: data.name,
                    lastName: data.lastName,
                    email: data.email
                }
            });


            const profile = await tx.professionalProfile.update({
                where: {
                    id
                },
                data: {
                    title: data.title,
                    description: data.description,
                    yearsExperience: data.yearsExperience,
                    phone: data.phone,
                    location: data.location,
                    baseRate: data.baseRate,
                    mode: data.mode,
                    isAvailable: data.isAvailable,
                    profileImage: data.profileImage
                }
            });


            return {
                user,
                profile
            };

        });
    }

};