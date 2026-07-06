import { Router } from "express";
import { ServiceController } from "../controllers/service.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createServiceSchema, updateServiceSchema } from "../dtos/service.dto";

export class ServiceRoutes {
    static get routes() : Router {
        const router = Router();
        const controller = new ServiceController();

        router.get("/", controller.list);
        router.get("/:id", controller.getById);

        router.post (
            "/",
            validateRequest(createServiceSchema),
            asyncHandler(controller.create)
        );

        router.put (
            "/:id",
            validateRequest(updateServiceSchema),
            asyncHandler(controller.update)
        );

        router.patch("/:id/status", controller.toggleStatus);

       return router
    }
}