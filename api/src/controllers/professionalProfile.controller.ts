import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { professionalProfileService } from "../services/professionalProfile.service";
import { parseId } from "../utils/parse-id";

export class ProfessionalProfileController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profiles = await professionalProfileService.list();

            return res.status(StatusCodes.OK).json({
                success: true,
                data: profiles
            });

        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const profile = await professionalProfileService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: profile
            });

        } catch (error) {
            next(error);
        }
    };

    async getMyProfile(req: AuthRequest, res: Response) {

        const userId = req.user!.id;

        const profile =
            await professionalProfileService.getMyProfile(userId);

        return res.json({
            success: true,
            data: profile
        });
    };




    create = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const userId = req.user?.id;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Usuario no autenticado"
                });
            }

            const profile =
                await professionalProfileService.create(
                    req.body,
                    userId
                );

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Perfil profesinal creado exitosamente",
                data: profile
            });

        } catch (error) {
            next(error);
        }
    };

    toggleAvailability = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);
            const profile = await professionalProfileService.toggleAvailability(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Disponibilidad actualizada correctamente",
                data: profile
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (
        req: AuthRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const id = parseId(req.params.id);

            const userId = req.user?.id;

            if (!userId) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    success: false,
                    message: "Usuario no autenticado"
                });
            }

            const profile = await professionalProfileService.update(
                id,
                req.body,
                userId
            );

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Perfil profesional actualizado exitosamente",
                data: profile
            });

        } catch (error) {
            next(error);
        }
    };
}