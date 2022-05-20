import { AccountModel, AddAccountModel, Encrypter, AddAccountRepository, LoadAccountByEmailRepository } from "./db-add-account-protocols";
import { DbAddAccount } from "./db-add-account";

const makeFakeAccount = (): AccountModel => {
  return {
    id: "any_id",
    name: "any_name",
    email: "any_mail@mail.com",
    password: "hashed_password",
  };
};

const makeLoadAccountByEmailRepositoryStub = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(null));
    }
  }

  return new LoadAccountByEmailRepositoryStub;
};

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
  encrypterStub: Encrypter;
  addAccountRepositoryStub: AddAccountRepository;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
  const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub);

  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub,
  };
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

  it('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, "add").mockResolvedValueOnce(
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

  it('Should return an account on success', async () => {
    const { sut } = makeSut();
    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    }

    const account = await sut.add(accountData);
    expect(account).toEqual(expect.objectContaining({
      id: "valid_id",
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "hashed_password"
    }));
  });

  it('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail").mockReturnValueOnce(
      new Promise(resolve => resolve(makeFakeAccount()))
    )

    const accountData = {
      name: "valid_name",
      email: "valid_email@mail.com",
      password: "valid_password"
    }
    
    const account = await sut.add(accountData);
    expect(account).toBe(null);
  });

  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, "loadByEmail");

    await sut.add(makeFakeAccount());
    expect(loadSpy).toHaveBeenLastCalledWith("any_mail@mail.com");
  });
});
