import { AccountModel } from "../../../domain/models/account";
import { LoadAccountByEmailRepository } from "../../protocols/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_mail@mail.com",
    password: "any_password",
  };
}

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return new Promise(resolve => resolve(account));
    }
  }

  return new LoadAccountByEmailRepositoryStub;
}

type SutTypes = {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "load");

    await sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    expect(loadSpy).toHaveBeenLastCalledWith("any_mail@mail.com");
  });
});
