import { Decrypter } from "../../protocols/criptography/decrypter";
import { DbLoadAccountByToken } from "./db-load-account-by-token";

describe('DbLoadAccountByToken Usecase', () => {
  test('should call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (hashedValue: string): Promise<string> {
        return new Promise(resolve => resolve("any_token"));
      }
    }

    const decrypterStub = new DecrypterStub();
    const sut = new DbLoadAccountByToken(decrypterStub);

    const decryptSpy = jest.spyOn(decrypterStub, "decrypt");
    await sut.load("any_token");

    expect(decryptSpy).toHaveBeenCalledTimes(1);
    expect(decryptSpy).toHaveBeenCalledWith("any_token");
  });
});
