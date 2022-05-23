import { AccountModel } from "../../domain/models/account";
import { LoadAccountByToken } from "../../domain/usecases/load-account-by-token";
import { AccessDeniedError } from "../errors/access-denied-error";
import { forbidden } from "../helpers/http/http-helper";
import { HttpRequest } from "../protocols";
import { AuthMiddleware } from "./auth-middleware";

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load(AccessToken: string, role?: string): Promise<AccountModel> {
    return makeFakeAccount();
  }
}

const makeFakeAccount = (): AccountModel => ({
  id: "any_id",
  name: "any_name",
  email: "any_email@mail.com",
  password: "any_password",
});

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: LoadAccountByToken;
};

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
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
    const httpRequest: HttpRequest = {
      headers: {
        "x-access-token": "any_token"
      }
    };
    
    await sut.handle(httpRequest);
    expect(loadSpy).toHaveBeenCalledTimes(1);
    expect(loadSpy).toHaveBeenCalledWith("any_token");
  });
});
