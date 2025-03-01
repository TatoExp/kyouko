import { ExpressErrorMiddlewareInterface, HttpError, Middleware } from "routing-controllers";
import { isHttpError } from "../utils/error-utils";
import { Service } from "typedi";

@Middleware({ type: "after" })
@Service()
class KyoukoErrorHandler implements ExpressErrorMiddlewareInterface {
    error(error: any, request: any, response: any, next: (err?: any) => any): void {
        if (isHttpError(error)) {
            const httpError = error as HttpError;

            response.status(httpError.httpCode);
            response.send({
                error: true,
                status: httpError.httpCode || 500,
                message: httpError.message || undefined
            });
        } else {
            response.status(500);
            response.send({
                error: true,
                status: 500,
                message: "Internal server error."
            });
        }

        if (process.env.DEV) {
            console.debug(`An error was thrown, message: ${error.message}`);
        }

        next();
    }
}

export { KyoukoErrorHandler };
