import bcrypt from "bcrypt";
import { BcryptAdapter } from "./bcrypt-adapter";

jest.mock("bcrypt", () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve("hashedValue"));
  }
}));

const salt = 12;
const makeSut = (): BcryptAdapter => {
  const sut = new BcryptAdapter(salt);
  return sut;
}

describe('BcryptAdapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const salt = 12;
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, "hash");
    await sut.encrypt("any_value");
    expect(hashSpy).toHaveBeenCalledWith("any_value", salt);
  });

  it('Should return a hash on success', async () => {
    const sut = makeSut();
    const hashedValue = await sut.encrypt("any_value");
    expect(hashedValue).toBe("hashedValue");
  });

  it('Should throws if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, "hash").mockImplementation(
      async () => new Promise((resolve, reject) => reject(new Error()))
    );

    const bcryptPromise = sut.encrypt("any_value");
    await expect(bcryptPromise).rejects.toThrow();
  });
});
