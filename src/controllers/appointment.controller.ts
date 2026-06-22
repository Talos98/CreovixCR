import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { appointmentService } from "../services/appointment.service";
import { parseId } from "../utils/parse-id";

export class AppointmentController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await appointmentService.list(page, limit);

            return res.status(StatusCodes.OK).json({
                success: true,
                meta: result.meta,
                data: result.data
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const appointment = await appointmentService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                data: appointment
            });
        } catch (error) {
            next(error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);
            const { status } = req.body;

            const appointment = await appointmentService.updateStatus(id, status);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: appointment
            });
        } catch (error) {
            next(error);
        }
    };
}