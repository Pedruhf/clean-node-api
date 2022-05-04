import { Controller, HttpRequest, httpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    await this.controller.handle(httpRequest);
    return null;
  }
}
