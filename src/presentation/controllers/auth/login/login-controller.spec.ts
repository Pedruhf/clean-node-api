import { Authentication, AuthenticationModel, HttpRequest, Validation } from "./login-controller-protocols";
import { MissingParamError } from "../../../errors";
import { badRequest, ok, serverError, unauthorized } from "../../../helpers/http/http-helper";
import { LoginController } from "./login-controller";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  }
});

const makeAuthentication = (): any => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve("any_token"));
    }
  }

  return new AuthenticationStub();
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

type SutTypes = {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}
const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const validationStub = makeValidation();
  const sut = new LoginController(validationStub, authenticationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, "auth");

    const httpRequest: HttpRequest = {
      body: {
        email: "any_mail@mail.com",
        password: "any_password",
      },
    };

    await sut.handle(httpRequest);
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    );

    const httpRequest: HttpRequest = {
      body: {
        email: "invalid_mail@mail.com",
        password: "invalid_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(unauthorized())
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, "auth").mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    );

    const httpRequest: HttpRequest = {
      body: {
        email: "any_mail@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should return an accessToken on success', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      body: {
        email: "any_mail@mail.com",
        password: "any_password",
      },
    };

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(ok({
      accessToken: "any_token"
    }));
  });

  test("Should call Validation with correct value", async () => {
    const { sut, validationStub } = makeSut();
    const valiteSpy = jest.spyOn(validationStub, "validate")
    
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(valiteSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  test("Should return 400 if validations returns an error", async () => {
    const { sut, validationStub } = makeSut();
    jest.spyOn(validationStub, "validate").mockReturnValueOnce(new MissingParamError("any_field"))
    
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(badRequest(new MissingParamError("any_field")));
  });
});
