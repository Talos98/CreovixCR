import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { professionalService } from "../services/professional.service";


export class ProfessionalController {

    create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {

            const professional = await professionalService.create(req.body);

            return res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Professional created successfully",
                data: professional
            });

        } catch (error) {
            next(error);
        }
    };

    update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        const id = Number(req.params.id);

        const professional =
            await professionalService.update(
                id,
                req.body
            );


        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Professional updated successfully",
            data: professional
        });


    } catch(error) {
        next(error);
    }
};

}