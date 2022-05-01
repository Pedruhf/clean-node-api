import { Encrypter } from "../../protocols/encrypter";
import { DbAddAccount } from "./db-add-account";

type SutTypes = {
  sut: DbAddAccount;
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve("hashed_password"));
    }
  }

  const encrypterStub = new EncrypterStub();
  const sut = new DbAddAccount(encrypterStub);

  return {
    sut,
    encrypterStub
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
});
