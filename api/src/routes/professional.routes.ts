import { Router } from "express";
import { ProfessionalController } from "../controllers/professional.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createProfessionalSchema } from "../dtos/professional.dto";


export class ProfessionalRoutes {

    static get routes(): Router {

        const router = Router();
        const controller = new ProfessionalController();


        router.post(
            "/",
            validateRequest(createProfessionalSchema),
            asyncHandler(controller.create)
        );


        return router;
    }
}
