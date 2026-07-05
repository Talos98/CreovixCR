import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "../services/user.service";
import { parseId } from "../utils/parse-id";

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
            const id = parseId (req.params.id);

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
                message: "User created successfully",
                data: user
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseId(req.params.id);

            const user = await userService.update(id, req.body);

            return res.status(StatusCodes.OK).json({
                success: true,
                message: "User updated successfully",
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
                message: "User status updated successfully",
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
                message: "User deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    };
}