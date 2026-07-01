import { Response } from "express";
import { StatusCodes } from "http-status-codes";

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Operation has been completed successfully",
    statusCode: StatusCodes = StatusCodes.OK
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}