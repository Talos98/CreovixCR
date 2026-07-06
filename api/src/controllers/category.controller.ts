import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { categoryService } from "../services/category.service";
import { parseId } from "../utils/parse-id";


export class CategoryController {

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await categoryService.list();

            return res.status(StatusCodes.OK).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const data = await categoryService.getById(id);

            return res.status(StatusCodes.OK).json({
                success: true,
                data
            });
        } catch (error) {
            next(error);
        }
    };

    toggleStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);
            const data = await categoryService.toggleStatus(id);
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Category status updated successfully",
                data
            });
        } catch (error) {
            next(error);
        }
    };
}