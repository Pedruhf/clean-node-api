import { Authentication, AuthenticationModel } from "../../../domain/usecases/authentication";
import { HashComparer } from "../../protocols/criptography/hash-comparer";
import { TokenGenerator } from "../../protocols/criptography/token-generator";
import { LoadAccountByEmailRepository } from "../../protocols/db/account/load-account-by-email-repository";
import { UpdateAccessTokenRepository } from "../../protocols/db/account/update-access-token-repository";

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth(authentication: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
    if (!account) {
      return null;
    }

    const isPasswordEqual = await this.hashComparer.compare(authentication.password, account.password);
    if (!isPasswordEqual) {
      return null;
    }

    const accessToken = await this.tokenGenerator.generate(account.id);
    await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
    return accessToken;
  }
}