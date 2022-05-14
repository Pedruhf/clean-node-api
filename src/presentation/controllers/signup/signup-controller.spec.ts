import { MissingParamError, ServerError } from "../../errors";
import { badRequest } from "../../helpers/http/http-helper";
import { SignUpController } from "./signup-controller";
import { HttpRequest, AccountModel, AddAccountModel, AddAccount, Validation } from "./signup-controller-protocols";

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password"
      };

      return new Promise(resolve => resolve(fakeAccount));
    }
  }

  return new AddAccountStub();
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: "any_name",
    email: "any_email@mail.com",
    password: "any_password",
    passwordConfirmation: "any_password",
  }
});

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

type SutTypes = {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  }
}

describe("SignUp Controller", () => {
  test("Should return 500 if AddAccount throws an error", async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, "add").mockImplementation( async () => {
      return new Promise((_, reject) => reject(new Error()));
    });
    
    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError(""));
  });

  test("Should call AddAccount with correct email values", async () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, "add")
    
    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email@mail.com",
      password: "any_password",
    });
  });

  test("Should return 201 if valid data is provided", async () => {
    const { sut } = makeSut();
    
    const httpRequest: HttpRequest = {
      body: {
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "valid_password",
        passwordConfirmation: "valid_password",
      }
    }

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual(expect.objectContaining({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password",
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