import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { Controller, HttpRequest, httpResponse } from "../../presentation/protocols";

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle(httpRequest: HttpRequest): Promise<httpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      this.logErrorRepository.logError(httpResponse.body.stack)
    }
    
    return httpResponse;
  }
}
