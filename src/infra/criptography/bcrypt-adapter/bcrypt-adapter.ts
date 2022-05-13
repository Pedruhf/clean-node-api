import { Encrypter } from "../../../data/protocols/criptography/encrypter";
import bcrypt from "bcrypt";
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Encrypter, HashComparer {
  constructor (private readonly salt: number) {}
  
  async encrypt (value: string): Promise<string> {
    const hashedValue = await bcrypt.hash(value, this.salt);
    return hashedValue;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isEqual = await bcrypt.compare(value, hash);
    return isEqual;
  }
}
