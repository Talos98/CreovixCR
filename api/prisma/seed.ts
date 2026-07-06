import { spec } from "node:test/reporters";
import { AppointmentStatus, Role, ServiceMode } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";
async function main() {
    console.log("Iniciando seed...");

    // 1. Clean of data
    const models = [
        prisma.review,
        prisma.appointment,
        prisma.service,
        prisma.professionalProfile,
        prisma.specialty,
        prisma.category,
        prisma.user,
    ];

    for (const model of models) {
        await (model as any).deleteMany();
    }


    // 2. Creación de datos maestros (Independientes)

    //Categories
    await prisma.category.createMany({
        data: [
            { name: "Branding", description: "Logo and brand identity" },
            { name: "Social Media", description: "Contenido creation" },
            { name: "Web Design", description: "UI/UX design" },
        ],

    });

    // Specialties
    await prisma.specialty.createMany({
        data: [
            { name: "Logo Design" },
            { name: "Instagram Content" },
            { name: "UI Design" },
            { name: "UX Research" },
        ],

    });

    //Users

    await prisma.user.createMany({
        data: [

            { name: "Admin", email: "admin@mail.com", password: "hash", role: Role.ADMIN },

            { name: "John Designer", email: "pro1@mail.com", password: "hash", role: Role.PROFESSIONAL },
            { name: "Jane Creative", email: "pro2@mail.com", password: "hash", role: Role.PROFESSIONAL },

            { name: "Carlos Client", email: "client1@mail.com", password: "hash", role: Role.CLIENT },
            { name: "Ana Client", email: "client2@mail.com", password: "hash", role: Role.CLIENT },
        ],

    });

    // 3. Recuperar datos para mapeo (Uso de Maps para optimizar)

    const [cats, specs, users] = await Promise.all([
        prisma.category.findMany(),
        prisma.specialty.findMany(),
        prisma.user.findMany(),
    ]);

    const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));
    const specMap = Object.fromEntries(specs.map(s => [s.name, s.id]));
    const userMap = Object.fromEntries(users.map(u => [u.email, u.id]));

    // 4. Professional Profiles
    await prisma.professionalProfile.create({
        data: {
            userId: userMap["pro1@mail.com"],
            title: "Graphic Designer",
            yearsExperience: 5,
            phone: "1111-1111",
            location: "Costa Rica",
            baseRate: 25,
            mode: ServiceMode.ONLINE
        },
    });

    await prisma.professionalProfile.create({
        data: {
            userId: userMap["pro2@mail.com"],
            title: "UI/UX Designer",
            yearsExperience: 7,
            phone: "2222-2222",
            location: "Costa Rica",
            baseRate: 30,
            mode: ServiceMode.ONLINE
        }
    });

    // Services with relations

    const logoService = await prisma.service.create({
        data: {
            name: "Logo Design",
            description: "Professional logo creation",
            price: 150,
            duration: 3,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["pro1@mail.com"],
            categoryId: catMap["Branding"],
            specialties: {
                connect: [{ id: specMap["Logo Design"] }]
            }
        },
    });

    const socialService = await prisma.service.create({
        data: {
            name: "Social Media Pack",
            description: "10 posts",
            price: 100,
            duration: 2,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["pro1@mail.com"],
            categoryId: catMap["Social Media"],
            specialties: {
                connect: [{ id: specMap["Instagram Content"] }]
            }
        },
    });

    const uiService = await prisma.service.create({
        data: {
            name: "UI Design",
            description: "App interface design",
            price: 200,
            duration: 5,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["pro2@mail.com"],
            categoryId: catMap["Web Design"],
            specialties: {
                connect: [
                    { id: specMap["UI Design"] },
                    { id: specMap["UX Research"] }
                ]
            }
        },
    });

    // Appointments
    const appointment1 = await prisma.appointment.create({
        data: {
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            mode: ServiceMode.ONLINE,
            status: AppointmentStatus.COMPLETED,
            clientId: userMap["client1@mail.com"],
            professionalId: userMap["pro1@mail.com"],
            serviceId: logoService.id,
        },
    });

    const appointment2 = await prisma.appointment.create({
        data: {
            date: new Date(),
            startTime: new Date(),
            endTime: new Date(),
            mode: ServiceMode.ONLINE,
            status: AppointmentStatus.PENDING,
            clientId: userMap["client2@mail.com"],
            professionalId: userMap["pro2@mail.com"],
            serviceId: uiService.id,

        },
    });
    // Reviews

    await prisma.review.create({
        data:

        {
            clientId: userMap["client1@mail.com"],
            professionalId: userMap["pro1@mail.com"],
            appointmentId: appointment1.id,
            rating: 5,
            comment: "Excellent work!",
        },
    });
    console.log("Seed completado con éxito.");
}
main()
    .catch((e) => {
        console.error("Error en seed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });