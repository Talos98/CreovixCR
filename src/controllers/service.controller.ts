import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { serviceService } from "../services/service.service";
import { parseId } from "../utils/parse-id";

export class ServiceController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await serviceService.list(page, limit);

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

            const service = await serviceService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: service
            });
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const service = await serviceService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Service created successfully",
                data: service
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const service = await serviceService.update(id, req.body);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Service updated successfully",
                data: service
            });
        } catch (error) {
            next(error);
        }
    };
}