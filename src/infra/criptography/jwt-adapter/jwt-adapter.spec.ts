import { JwtAdapter } from "./jwt-adapter";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => {
  return {
    async sign(): Promise<string> {
      return new Promise(resolve => resolve("any_token"));
    },

    async verify(): Promise<string> {
      return new Promise(resolve => resolve("any_value"));
    }
  };
});

const makeSut = (): JwtAdapter => {
  return new JwtAdapter("secret");
}

describe('Jwt Adapter', () => {
  describe("sign()", () => {
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
  
  describe("verify()", () => {
    it('Should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, "verify");
      await sut.decrypt("any_token");

      expect(verifySpy).toHaveBeenCalledTimes(1);
      expect(verifySpy).toHaveBeenCalledWith("any_token", "secret");
    });

    it('Should return a value on verify success', async () => {
      const sut = makeSut();
      const value = await sut.decrypt("any_token");
      expect(value).toBe("any_value");
    });

    it('Should return null if verify returns null', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, "verify").mockImplementation(
        async () => new Promise(resolve => resolve(null))
      );
      
      const value = await sut.decrypt("any_token");
      expect(value).toBe(null);
    });
  });
});
