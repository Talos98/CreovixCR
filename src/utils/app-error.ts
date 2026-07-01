import { StatusCodes} from "http-status-codes";

export interface ValidationErrorDetail {
    field: string;
    message: string;
}

interface AppErrorArgs {
    name?: string;
    statusCode: StatusCodes;
    message: string;
    isOperational?: boolean;
    validationErrors?: ValidationErrorDetail[];
}

export class AppError extends Error {
    public readonly name: string;
    public readonly statusCode: StatusCodes;
    public readonly isOperational: boolean;
    public readonly validationErrors?: ValidationErrorDetail[];

    constructor(args: AppErrorArgs) {
        super(args.message);

        Object.setPrototypeOf(this, new.target.prototype);

        this.name = args.name ?? "ApplicationError";
        this.statusCode = args.statusCode;
        this.isOperational = args.isOperational ?? true;
        this.validationErrors = args.validationErrors;

        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message: string, validationErrors?: ValidationErrorDetail[]) {
        return new AppError({
            name: "BadRequestError",
            message,
            statusCode: StatusCodes.BAD_REQUEST,
            validationErrors,
        });
    }

    static unauthorized(message = "No authorized") {
        return new AppError({
            name: "UnauthorizedError",
            message,
            statusCode: StatusCodes.UNAUTHORIZED,
        });
    }

    static forbidden(message = "Acceso denied") {
        return new AppError({
            name: "ForbiddenError",
            message,
            statusCode: StatusCodes.FORBIDDEN,
        });
    }

    static notFound(message = "Resource not found") {
        return new AppError({
            name: "NotFoundError",
            message,
            statusCode: StatusCodes.NOT_FOUND,
        });
    }

    static conflict(message = "Conflitc with the current resource") {
        return new AppError({
            name: "ConflictError",
            message,
            statusCode: StatusCodes.CONFLICT,
        });
    }

    static internalServer(message = "There is an internal error in the server") {
        return new AppError({
            name: "InternalServerError",
            message,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            isOperational: false,
        });
    }
}