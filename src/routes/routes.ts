import { Router } from "express";
import { AppointmentRoutes } from "./appointment.routes";
import { CategoryRoutes } from "./category.routes";
import { ProfessionalProfileRoutes } from "./professionalProfile.routes";
import { ReviewRoutes } from "./review.routes";
import { RoleRoutes } from "./role.routes";
import { ServiceRoutes } from "./service.routes";
import { SpecialtyRoutes } from "./specialty.routes";
import { UserRoutes } from "./user.routes";

export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/appointment', AppointmentRoutes.routes)
        router.use('/category', CategoryRoutes.routes)
        router.use('/professionalProfile', ProfessionalProfileRoutes.routes)
        router.use('/review', ReviewRoutes.routes)
        router.use('/role', RoleRoutes.routes)
        router.use('/service', ServiceRoutes.routes)
        router.use('/specialty', SpecialtyRoutes.routes)
        router.use('/user', UserRoutes.routes)
        return router;
    }
}