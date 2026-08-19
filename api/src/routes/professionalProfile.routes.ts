import { Router } from "express";
import { ProfessionalProfileController } from "../controllers/professionalProfile.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createProfessionalProfileSchema, updateProfessionalProfileSchema } from "../dtos/professionalProfile.dto";
import { authenticateToken } from "../middlewares/auth.middleware";

export class ProfessionalProfileRoutes {
    static get routes(): Router {
        const router = Router();
        const controller = new ProfessionalProfileController();

        router.get("/", controller.list);
        router.get("/:id", controller.getById);

        router.post(
            "/",
            authenticateToken,
            validateRequest(createProfessionalProfileSchema),
            asyncHandler(controller.create)
        );

        router.put(
            "/:id",
            authenticateToken,
            validateRequest(updateProfessionalProfileSchema),
            asyncHandler(controller.update)
        );

        router.patch("/:id/availability",
            authenticateToken,
            asyncHandler(controller.toggleAvailability))

        return router;
    }
}