import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { roleService } from "../services/role.service";

export class RoleController {

    list = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const roles = await roleService.list();

            return res.status(StatusCodes.OK).json({
                success: true,
                data: roles
            });

        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;

        const role = await roleService.getById(rawId ?? "");

        if (!role) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Role not found"
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            data: role
        });

    } catch (error) {
        next(error);
    }
};
}