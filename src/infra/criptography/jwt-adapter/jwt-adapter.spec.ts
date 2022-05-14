import { JwtAdapter } from "./jwt-adapter";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => {
  return {
    async sign(): Promise<string> {
      return new Promise(resolve => resolve("any_token"));
    }
  };
});

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
}

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = makeSut();
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.generate("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });
  
  it('Should return a token on sign success', async () => {
    const sut = makeSut();
    const token = await sut.generate("any_id");
    expect(token).toBe("any_token");
  });
  
  it('Should throw if sign throws', async () => {
    const sut = makeSut();
    jest.spyOn(jwt, "sign").mockImplementation(
      async () => new Promise((resolve, reject) => reject(new Error()))
    );
    const tokenPromise = sut.generate("any_id");
    await expect(tokenPromise).rejects.toThrow();
  });
});
