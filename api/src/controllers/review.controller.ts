import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { reviewService } from "../services/review.service";
import { parseId } from "../utils/parse-id";

export class ReviewController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 0);

            const result = await reviewService.list(page, limit);

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

            const review = await reviewService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data: review
            });

        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const review = await reviewService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Review created successfully",
                data: review
            });

        } catch (error) {
            next(error);
        }
    };
}
