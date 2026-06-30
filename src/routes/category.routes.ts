import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new CategoryController()

        //Routes
        //localhost:3000/category/

        router.get('/', asyncHandler(controller.list))
        router.get('/:id', asyncHandler(controller.getById))
        return router
    }
}