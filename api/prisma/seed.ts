import { AppointmentStatus, Role, ServiceMode } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";

async function main() {
    console.log("Iniciando seed...");

    // LIMPIEZA
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

    // ========================
    // CATEGORÍAS (5)
    // ========================
    await prisma.category.createMany({
        data: [
            { name: "Branding", description: "Identidad visual y logotipos" },
            { name: "Redes Sociales", description: "Contenido para redes sociales" },
            { name: "Diseño Web", description: "Interfaces y experiencia de usuario" },
            { name: "Publicidad", description: "Diseño publicitario" },
            { name: "Ilustración", description: "Arte digital e ilustraciones" },
        ],
    });

    // ========================
    // ESPECIALIDADES (8)
    // ========================
    await prisma.specialty.createMany({
        data: [
            { name: "Diseño de Logotipos" },
            { name: "Branding Corporativo" },
            { name: "Contenido para Instagram" },
            { name: "Diseño UI" },
            { name: "Investigación UX" },
            { name: "Banners Publicitarios" },
            { name: "Ilustración Digital" },
            { name: "Packaging" },
        ],
    });

    // ========================
    // USUARIOS (8)
    // ========================
    await prisma.user.createMany({
        data: [
            { name: "Josué", lastName: "Calderón", email: "admin@creovixcr.com", password: "hash", role: Role.ADMIN },

            { name: "Daniel", lastName: "Vargas", email: "daniel@creovixcr.com", password: "hash", role: Role.PROFESSIONAL },
            { name: "María", lastName: "Fernández", email: "maria@creovixcr.com", password: "hash", role: Role.PROFESSIONAL },
            { name: "Luis", lastName: "Ramírez", email: "luis@creovixcr.com", password: "hash", role: Role.PROFESSIONAL },
            { name: "Sofía", lastName: "Gómez", email: "sofia@creovixcr.com", password: "hash", role: Role.PROFESSIONAL },
            { name: "Andrés", lastName: "Castro", email: "andres@creovixcr.com", password: "hash", role: Role.PROFESSIONAL },

            { name: "Carlos", lastName: "Mora", email: "carlos@creovixcr.com", password: "hash", role: Role.CLIENT },
            { name: "Ana", lastName: "Rojas", email: "ana@creovixcr.com", password: "hash", role: Role.CLIENT },
            { name: "Ramon", lastName: "Morales", email: "ramon@creovixcr.com", password: "hash", role: Role.CLIENT },
            { name: "Antonio", lastName: "Chaves", email: "antonio@creovixcr.com", password: "hash", role: Role.CLIENT },
        ],
    });

    // ========================
    // MAPAS
    // ========================
    const [cats, specs, users] = await Promise.all([
        prisma.category.findMany(),
        prisma.specialty.findMany(),
        prisma.user.findMany(),
    ]);

    const catMap = Object.fromEntries(cats.map(c => [c.name, c.id]));
    const specMap = Object.fromEntries(specs.map(s => [s.name, s.id]));
    const userMap = Object.fromEntries(users.map(u => [u.email, u.id]));

    // ========================
    // PROFESIONALES (5)
    // ========================
    await prisma.professionalProfile.createMany({
        data: [
            {
                userId: userMap["daniel@creovixcr.com"],
                title: "Diseñador Gráfico Senior",
                yearsExperience: 6,
                phone: "8888-1111",
                location: "San José",
                baseRate: 30,
                mode: ServiceMode.ONLINE,
            },
            {
                userId: userMap["maria@creovixcr.com"],
                title: "Especialista en Branding",
                yearsExperience: 8,
                phone: "8888-2222",
                location: "Alajuela",
                baseRate: 35,
                mode: ServiceMode.IN_PERSON,
            },
            {
                userId: userMap["luis@creovixcr.com"],
                title: "Diseñador UI/UX",
                yearsExperience: 5,
                phone: "8888-3333",
                location: "Heredia",
                baseRate: 28,
                mode: ServiceMode.ONLINE,
            },
            {
                userId: userMap["sofia@creovixcr.com"],
                title: "Ilustradora Digital",
                yearsExperience: 4,
                phone: "8888-4444",
                location: "Cartago",
                baseRate: 25,
                mode: ServiceMode.ONLINE,
            },
            {
                userId: userMap["andres@creovixcr.com"],
                title: "Diseñador Publicitario",
                yearsExperience: 7,
                phone: "8888-5555",
                location: "San José",
                baseRate: 32,
                mode: ServiceMode.IN_PERSON,
            },
        ],
    });

    // ========================
    // SERVICIOS (10)
    // ========================
    const services = [];

    services.push(await prisma.service.create({
        data: {
            name: "Diseño de Logotipo",
            description: "Creación profesional de logotipo",
            price: 150,
            duration: 3,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["daniel@creovixcr.com"],
            categoryId: catMap["Branding"],
            specialties: {
                connect: [{ id: specMap["Diseño de Logotipos"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Manual de Marca",
            description: "Identidad visual completa",
            price: 300,
            duration: 5,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["maria@creovixcr.com"],
            categoryId: catMap["Branding"],
            specialties: {
                connect: [{ id: specMap["Branding Corporativo"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Posts para Instagram",
            description: "10 diseños para redes",
            price: 120,
            duration: 2,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["daniel@creovixcr.com"],
            categoryId: catMap["Redes Sociales"],
            specialties: {
                connect: [{ id: specMap["Contenido para Instagram"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Diseño UI App",
            description: "Interfaces modernas",
            price: 250,
            duration: 4,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["luis@creovixcr.com"],
            categoryId: catMap["Diseño Web"],
            specialties: {
                connect: [{ id: specMap["Diseño UI"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Investigación UX",
            description: "Análisis de usuarios",
            price: 200,
            duration: 3,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["luis@creovixcr.com"],
            categoryId: catMap["Diseño Web"],
            specialties: {
                connect: [{ id: specMap["Investigación UX"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Banner Publicitario",
            description: "Diseño de banners",
            price: 80,
            duration: 1,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["andres@creovixcr.com"],
            categoryId: catMap["Publicidad"],
            specialties: {
                connect: [{ id: specMap["Banners Publicitarios"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Ilustración Personalizada",
            description: "Arte digital único",
            price: 140,
            duration: 3,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["sofia@creovixcr.com"],
            categoryId: catMap["Ilustración"],
            specialties: {
                connect: [{ id: specMap["Ilustración Digital"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Diseño de Packaging",
            description: "Diseño de empaques atractivos para productos",
            price: 220,
            duration: 4,
            mode: ServiceMode.IN_PERSON,
            professionalId: userMap["maria@creovixcr.com"],
            categoryId: catMap["Branding"],
            specialties: {
                connect: [{ id: specMap["Packaging"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Rediseño de Marca",
            description: "Actualización completa de identidad visual",
            price: 280,
            duration: 5,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["maria@creovixcr.com"],
            categoryId: catMap["Branding"],
            specialties: {
                connect: [{ id: specMap["Branding Corporativo"] }]
            }
        }
    }));

    services.push(await prisma.service.create({
        data: {
            name: "Kit de Historias para Instagram",
            description: "Plantillas editables para stories",
            price: 90,
            duration: 2,
            mode: ServiceMode.ONLINE,
            professionalId: userMap["sofia@creovixcr.com"],
            categoryId: catMap["Redes Sociales"],
            specialties: {
                connect: [{ id: specMap["Contenido para Instagram"] }]
            }
        }
    }));


    const clients = [
        userMap["carlos@creovixcr.com"],
        userMap["ana@creovixcr.com"],
        userMap["ramon@creovixcr.com"],
        userMap["antonio@creovixcr.com"],
    ];

    const professionalServices = [
        {
            professionalId: userMap["daniel@creovixcr.com"],
            serviceId: services[0].id,
        },
        {
            professionalId: userMap["maria@creovixcr.com"],
            serviceId: services[1].id,
        },
        {
            professionalId: userMap["luis@creovixcr.com"],
            serviceId: services[3].id,
        },
        {
            professionalId: userMap["sofia@creovixcr.com"],
            serviceId: services[6].id,
        },
        {
            professionalId: userMap["andres@creovixcr.com"],
            serviceId: services[5].id,
        },
    ];

    for (let i = 0; i < 12; i++) {

        const appointmentDate = new Date();
        appointmentDate.setDate(
            appointmentDate.getDate() + (i + 1)
        );

        const startHour = 8 + (i % 5);

        const startTime = new Date(appointmentDate);
        startTime.setHours(startHour, 0, 0, 0);

        const endTime = new Date(appointmentDate);
        endTime.setHours(startHour + 1, 0, 0, 0);

        const assigned = professionalServices[i % professionalServices.length];

        await prisma.appointment.create({
            data: {
                date: appointmentDate,
                startTime,
                endTime,

                mode: i % 2 === 0
                    ? ServiceMode.ONLINE
                    : ServiceMode.IN_PERSON,

                status: i % 3 === 0
                    ? AppointmentStatus.COMPLETED
                    : AppointmentStatus.PENDING,

                clientId: clients[i % clients.length],
                professionalId: assigned.professionalId,
                serviceId: assigned.serviceId,

                description: [
                    "Necesito asesoría para crear la identidad visual de mi emprendimiento.",
                    "Revisión de propuesta de logotipo y ajustes finales.",
                    "Diseño de piezas gráficas para una campaña publicitaria.",
                    "Análisis de experiencia de usuario para una aplicación web.",
                    "Creación de contenido visual para redes sociales.",
                    "Desarrollo de manual de marca corporativo.",
                    "Diseño de ilustraciones personalizadas para un proyecto.",
                    "Revisión de diseño y recomendaciones profesionales.",
                    "Creación de banners promocionales para una campaña.",
                    "Mejoras al diseño actual de la marca.",
                    "Asesoría sobre colores, tipografías y estilo visual.",
                    "Diseño de material gráfico para lanzamiento de producto."
                ][i],
            }
        });
    }


    console.log("Seed completado con éxito");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });