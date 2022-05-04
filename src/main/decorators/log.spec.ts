import { Controller, HttpRequest, httpResponse } from "../../presentation/protocols";
import { LogControllerDecorator } from "./log";

describe('LogController Decorator', () => {
  it('Should call controller handle', async () => {
    class ControllerStub implements Controller {
      async handle(httpRequest: HttpRequest): Promise<httpResponse> {
        const httpResponse: httpResponse = {
          statusCode: 200,
          body: {
            name: "another_any_name"
          }
        }
        return new Promise(resolve => resolve(httpResponse));
      }
    }

    const controllerStub = new ControllerStub();
    const sut = new LogControllerDecorator(controllerStub);
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
});
