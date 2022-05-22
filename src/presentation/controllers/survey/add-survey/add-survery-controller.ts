import { Controller, HttpRequest, httpResponse, Validation } from "./add-survey-protocols";

export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    this.validation.validate(httpRequest.body);
    return new Promise(resolve => resolve({statusCode: 200, body: httpRequest.body}));
  }
}