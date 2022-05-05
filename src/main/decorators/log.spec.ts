import { LogErrorRepository } from "../../data/protocols/log-error-repository";
import { serverError } from "../../presentation/helpers/http-helper";
import { Controller, HttpRequest, httpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return new Promise(resolve => resolve());
    }
  }

  return new LogErrorRepositoryStub();
} 

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<httpResponse> {
      const httpResponse: httpResponse = {
        statusCode: 200,
        body: {
          name: "another_any_name"
        }
      }

      return httpResponse;
    }
  }

  const controllerStub = new ControllerStub();
  return controllerStub;
}

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
}

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");

    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword"
      }
    }

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });

  it('Should return the same httpResponse of controller handle', async () => {
    const { sut, controllerStub } = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword"
      }
    }
    const httpResponseStub = await controllerStub.handle(httpRequest);
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(httpResponseStub);
  });

  it('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    
    const fakeError = new Error();
    fakeError.stack = "any_stack";
    const error = serverError(fakeError);
    
    const logSpy = jest.spyOn(logErrorRepositoryStub, "log");
    jest.spyOn(controllerStub, "handle").mockReturnValueOnce(
      new Promise(resolve => resolve(error))
    );

    const httpRequest: HttpRequest = {
      body: {
        name: "any_name",
        email: "any_mail@mail.com",
        password: "any_password",
        confirmPassword: "any_confirmPassword"
      }
    }

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith(fakeError.stack);
  });
});