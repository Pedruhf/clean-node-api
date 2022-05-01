import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository } from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"));
    }
  }
  
  return new EncrypterStub();
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: "valid_id",
        name: "valid_name",
        email: "valid_email@mail.com",
        password: "hashed_password"
      }

      return new Promise(resolve => resolve(fakeAccount));
    }
  }
  
  return new AddAccountRepositoryStub();
}

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, "encrypt");
    
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    }

    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenLastCalledWith("valid_password");
  });

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, "encrypt").mockResolvedValueOnce(
      new Promise((resolve, reject) => reject(new Error()))
    );
    
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    }

    const accountPromise = sut.add(accountData);
    await expect(accountPromise).rejects.toThrow();
  });

  it('Should call AddAccountRepository with correct data', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addAccountRepositoryStub, "add");
    
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    }

    await sut.add(accountData);
    expect(addSpy).toHaveBeenLastCalledWith(expect.objectContaining({
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password"
    }));
  });
});
