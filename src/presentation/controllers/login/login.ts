import { MissingParamError } from "../../errors";
import { badRequest, created } from "../../helpers/http-helper";
import { Controller, HttpRequest, httpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    const requiredFields = ["email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        const error = badRequest(new MissingParamError(field));
        return new Promise(resolve => resolve(error));
      }
    }

    const { email, password } = httpRequest.body;

    const isValidEmail = this.emailValidator.isValid(email);
  }
}
