import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { specialtyService } from "../services/specialty.service";
import { parseId } from "../utils/parse-id";

export class SpecialtyController {

    list = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const specialties = await specialtyService.list();

            return res.status(StatusCodes.OK).json({
                success: true,
                data: specialties
            });

        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const specialty = await specialtyService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: specialty
            });

        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);
            const data = await specialtyService.toggleStatus(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Specialty status updated successfully",
                data
            });
        } catch (error) {
            next(error);
        }
    };
}