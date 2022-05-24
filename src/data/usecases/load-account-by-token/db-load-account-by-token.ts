import { LoadAccountByToken } from "../../../domain/usecases/load-account-by-token";
import { Decrypter } from "../../protocols/criptography/decrypter";
import { LoadAccountByTokenRepository } from "../../protocols/db/account/load-account-by-token-repository";
import { AccountModel } from "../add-account/db-add-account-protocols";

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const decryptedAccessToken = await this.decrypter.decrypt(accessToken);
    if (!decryptedAccessToken) {
      return null;
    }

    const account = await this.loadAccountByTokenRepository.loadByToken(decryptedAccessToken, role);
    if (!account) {
      return null;
    }
  }
}
