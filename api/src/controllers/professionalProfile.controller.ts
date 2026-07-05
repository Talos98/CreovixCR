import { Request, Response, NextFunction } from "express";
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

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const profile = await professionalProfileService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Professional profile created successfully",
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
                message: "Availability updated successfully",
                data: profile
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const profile = await professionalProfileService.update(id, req.body);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Professional profile updated successfully",
                data: profile
            });

        } catch (error) {
            next(error);
        }
    };
}