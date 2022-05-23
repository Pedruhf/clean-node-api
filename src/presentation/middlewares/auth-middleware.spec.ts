import { AccountModel } from "../../domain/models/account";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest } from "../protocols";
import { AuthMiddleware } from "./auth-middleware";

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

const makeFakeRequest = (): HttpRequest => ({
  headers: {
    "x-access-token": "any_token"
  }
});

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load(AccessToken: string, role?: string): Promise<AccountModel> {
      return makeFakeAccount();
    }
  }

  return new LoadAccountByTokenStub();
}

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken();
  const sut = new AuthMiddleware(loadAccountByTokenStub);

  return {
    sut,
    loadAccountByTokenStub,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpRequest: HttpRequest = {
      headers: {}
    };
    
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadAccountByToken with correct token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    
    const loadSpy = jest.spyOn(loadAccountByTokenStub, "load");
    const httpRequest = makeFakeRequest();
    
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();
    jest.spyOn(loadAccountByTokenStub, "load").mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    );

    const httpRequest = makeFakeRequest();
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()));
  });
});
