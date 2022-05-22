import { badRequest } from "../../../helpers/http/http-helper";
import { Controller, HttpRequest, httpResponse, Validation } from "./add-survey-protocols";

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    const error = this.validation.validate(httpRequest.body);
    if (error) {
      return badRequest(error);
    }

    return new Promise(resolve => resolve({statusCode: 200, body: httpRequest.body}));
  }
}