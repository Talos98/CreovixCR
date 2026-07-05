import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { createReviewSchema } from "../dtos/review.dto";


export class ReviewRoutes {
    static get routes() : Router {
        const router = Router();
        const controller = new ReviewController();

        router.get("/", controller.list);
        router.get("/:id", controller.getById);

        router.post(
            "/",
            validateRequest(createReviewSchema),
            asyncHandler(controller.create)
        );

        return router;
    }
}