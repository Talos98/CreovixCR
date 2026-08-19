import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { asyncHandler } from "../middlewares/async-handler.middleware"
import { validateRequest } from "../middlewares/validate-request.middleware"
import { createUserSchema, updateUserSchema, loginUserSchema } from "../dtos/user.dto"
import { authenticateToken } from "../middlewares/auth.middleware"

export class UserRoutes {
    static get routes(): Router {
        const router = Router()
        const controller = new UserController()

        //Routes
        //localhost:3000/category/

        router.get('/', asyncHandler(controller.list));

        // IMPORTANTE: /profile debe ir antes de /:id
        router.get(
            "/profile",
            authenticateToken,
            asyncHandler(controller.profile)
        );

        router.get('/:id', asyncHandler(controller.getById));

        router.post(
            "/",
            validateRequest(createUserSchema),
            asyncHandler(controller.create)
        );

        router.post(
            "/login",
            validateRequest(loginUserSchema),
            asyncHandler(controller.login)
        );

        router.put(
            "/:id",
            validateRequest(updateUserSchema),
            asyncHandler(controller.update)
        );

        router.patch(
            "/:id/status",
            asyncHandler(controller.toggleStatus)
        );

        return router
    }
}