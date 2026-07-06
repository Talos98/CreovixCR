import { Router } from "express";
import { AppointmentController } from "../controllers/appointment.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createAppointmentSchema } from "../dtos/appointment.dto"; 


export class AppointmentRoutes {
    static get routes() : Router {
        const router = Router();
        const controller = new AppointmentController();

        router.get("/", controller.list);
        router.get("/:id", controller.getById);

        router.post (
            "/",
            validateRequest(createAppointmentSchema),
            asyncHandler(controller.create)
        );

        return router
    }
}