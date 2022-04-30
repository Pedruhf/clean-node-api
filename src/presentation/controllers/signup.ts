import { MissingParamError, InvalidParamError } from "../errors";
import { badRequest, serverError } from "../helpers/http-helper";
import { HttpRequest, httpResponse, Controller, EmailValidator } from "../protocols";

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest): httpResponse {
    try {
      const requiredFields = ["name", "email", "password", "passwordConfirmation"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError("passwordConfirmation"));
      }

      const isEmailValid = this.emailValidator.isValid(email);
      if (!isEmailValid) {
        return badRequest(new InvalidParamError("email"));
      }
    } catch (error) {
      return serverError();
    }
  }
}
