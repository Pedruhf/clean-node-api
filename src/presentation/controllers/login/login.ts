import { MissingParamError } from "../../errors";
import { badRequest } from "../../helpers/http-helper";
import { Controller, HttpRequest, httpResponse } from "../../protocols";

export class LoginController implements Controller {
  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        const error = badRequest(new MissingParamError(field));
        return new Promise(resolve => resolve(error));
      }
    }
  }
}
