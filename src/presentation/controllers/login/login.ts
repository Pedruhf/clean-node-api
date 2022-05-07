import { Authentication } from "../../../domain/usecases/authentication";
import { InvalidParamError, MissingParamError } from "../../errors";
import { badRequest, created, serverError } from "../../helpers/http-helper";
import { Controller, HttpRequest, httpResponse } from "../../protocols";
import { EmailValidator } from "../signup/signup-protocols";

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    try {
      const requiredFields = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          const error = badRequest(new MissingParamError(field));
          return new Promise(resolve => resolve(error));
        }
      }

      const { email, password } = httpRequest.body;

      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        const error = badRequest(new InvalidParamError("email"));
        return new Promise(resolve => resolve(error));
      }

      await this.authentication.auth(email, password);
    } catch (error) {
      return serverError(error);
    }
  }
}
