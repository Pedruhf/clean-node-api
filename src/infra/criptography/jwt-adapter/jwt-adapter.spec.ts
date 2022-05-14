import { JwtAdapter } from "./jwt-adapter";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken", () => {
  return {
    async sign(): Promise<string> {
      return new Promise(resolve => resolve("any_token"));
    }
  };
});

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter("secret");
    const signSpy = jest.spyOn(jwt, "sign");
    await sut.generate("any_id");
    expect(signSpy).toHaveBeenCalledWith({ id: "any_id" }, "secret");
  });
});
