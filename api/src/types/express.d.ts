import { extend } from "zod/mini";
import { AuthTokenPayload } from "../middlewares/auth.middleware";

declare global {
    namespace Express {
        interface User extends AuthTokenPayload {}
    }
}
export{};