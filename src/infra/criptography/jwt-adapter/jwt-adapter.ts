import { TokenGenerator } from "../../../data/protocols/criptography/token-generator";
import { Decrypter } from "../../../data/protocols/criptography/decrypter";
import jwt from "jsonwebtoken";

export class JwtAdapter implements TokenGenerator, Decrypter {
  constructor (private readonly secret: string) {}

  async generate(id: string): Promise<string> {
    const token = await jwt.sign({ id }, this.secret);
    return token;
  }

  async decrypt (hashedValue: string): Promise<string> {
    const value = await jwt.verify(hashedValue, this.secret) as string;
    if (!value) {
      return null;
    }

    return value;
  }
}
