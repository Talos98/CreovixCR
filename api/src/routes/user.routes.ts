import { Router } from "express";

import { UserController } from "../controllers/user.controller";
import { asyncHandler } from "../middlewares/async-handler.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";

import {
    createUserSchema,
    updateProfileSchema,
    loginUserSchema
} from "../dtos/user.dto";

import { authenticateToken } from "../middlewares/auth.middleware";

export class UserRoutes {

    static get routes(): Router {

        const router = Router();
        const controller = new UserController();

        // =====================
        // PUBLIC / GENERAL
        // =====================

        router.get(
            "/",
            asyncHandler(controller.list)
        );

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

        // =====================
        // AUTHENTICATED USER
        // =====================

        router.get(
            "/profile",
            authenticateToken,
            asyncHandler(controller.profile)
        );

        router.put(
            "/profile",
            authenticateToken,
            validateRequest(updateProfileSchema),
            asyncHandler(controller.updateProfile)
        );

        // =====================
        // GENERAL BY ID
        // =====================

        router.get(
            "/:id",
            asyncHandler(controller.getById)
        );

        // =====================
        // ADMINISTRATIVE
        // =====================

        router.patch(
            "/:id/status",
            asyncHandler(controller.toggleStatus)
        );

        return router;
    }
}