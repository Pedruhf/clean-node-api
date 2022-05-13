import { AccountModel } from "../../../domain/models/account";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/load-account-by-email-repository";
import { DbAuthentication } from "./db-authentication";

const makeFakeAccount = (): AccountModel => {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_mail@mail.com",
    password: "hashed_password",
  };
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return new Promise(resolve => resolve("any_token"));
    }
  }

  return new TokenGeneratorStub();
}

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => resolve(true));
    }
  }

  return new HashComparerStub();
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
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashComparerStub: HashComparer;
  tokenGeneratorStub: TokenGenerator;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const hashComparerStub = makeHashComparerStub();
  const tokenGeneratorStub = makeTokenGeneratorStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub, tokenGeneratorStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashComparerStub,
    tokenGeneratorStub,
  };
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

  it('Should throws if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, "load").mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    );

    const accessTokenPromise = sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    await expect(accessTokenPromise).rejects.toThrow();
  });

  it('Should return null if LoadAccountByEmailRepository fails', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, "load").mockReturnValueOnce(null);

    const accessToken = await sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    expect(accessToken).toBe(null);
  });

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, "compare");

    await sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
      new Promise((_, reject) => reject(new Error()))
    );

    const accessTokenPromise = sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    await expect(accessTokenPromise).rejects.toThrow();
  });

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, "compare").mockReturnValueOnce(
      new Promise(resolve => resolve(false))
    );

    const accessToken = await sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    expect(accessToken).toBe(null);
  });

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    const generateSpy = jest.spyOn(tokenGeneratorStub, "generate");

    await sut.auth({
      email: "any_mail@mail.com",
      password: "any_password",
    });

    expect(generateSpy).toHaveBeenCalledWith("any_id");
  });
});
