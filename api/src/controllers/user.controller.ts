import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services/user.service";
import { parseId } from "../utils/parse-id";
import { sendSuccess } from "../utils/http-response";
import { AuthRequest } from "../middlewares/auth.middleware";
import { success } from "zod";

export class UserController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await userService.list(page, limit);

            return res.status(StatusCodes.OK).json({
                success: true,
                meta: result.meta,
                data: result.data
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            if (isNaN(id)) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    message: "Invalid ID"
                });
            }

            const user = await userService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await userService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Usuarion creado existosamente",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (request: Request, response: Response, next: NextFunction) => {
        try {

            const result = await userService.login(request.body);

            return sendSuccess(
                response,
                result,
                "Inicio de sensón correcto"
            );

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Credenciales incorrectas";

            if (
                message === "Correo o contraseña incorrectos" ||
                message === "El usario se encuentra inactivo"
            ) {
                return response.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Credenciales incorrectas",
                });
            }

            next(error);
        }
    };

    profile = async (request: AuthRequest, response: Response, next: NextFunction) => {
        const userId = request.user?.id;

        if (!userId) {
            return response.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Usuario no autenticado: " + userId,
            });
        }

        const user = await userService.profile(userId);

        if (!user) {
            return response
                .status(StatusCodes.NOT_FOUND)
                .json({ success: false, message: "El usuario autenticado no existe" + userId })
        }
        return sendSuccess(
            response,
            user,
            "Perfil obtenido correctamente"
        );
    };



    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const user = await userService.update(id, req.body);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Usuario actualizado exitosamente",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);
            const user = await userService.toggleStatus(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Estado del usuario, actualizado exitosmanente",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            await userService.delete(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Usuario eliminado exitosmanete"
            });
        } catch (error) {
            next(error);
        }
    };
}