import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest, httpResponse, Middleware } from "../protocols";

export class AuthMiddleware implements Middleware {
  handle(httpRequest: HttpRequest): Promise<httpResponse> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())));
  }
}
