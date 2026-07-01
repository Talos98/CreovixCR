import { Router } from "express";
import { SpecialtyController } from "../controllers/specialty.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class SpecialtyRoutes {
    static get routes() : Router {
        const router = Router()
        const controller = new SpecialtyController()

        //Routes
        //localhost:3000/specialty/

        router.get('/', asyncHandler(controller.list))
        router.get('/:id', asyncHandler(controller.getById))
        return router
    }
}