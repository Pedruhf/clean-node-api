import { LoginController } from "../../../presentation/controllers/login/login-controller";
import { Controller } from "../../../presentation/protocols";
import { DbAuthentication } from "../../../data/usecases/authentication/db-authentication";
import { LogControllerDecorator } from "../../decorators/log-controller-decorator";
import { LogMongoRepository } from "../../../infra/db/mongodb/log/log-mongo-repository";
import { makeLoginValidation } from "./login-validation-factory";
import { AccountMongoRepository } from "../../../infra/db/mongodb/account/account-mongo-repository";
import { BcryptAdapter } from "../../../infra/criptography/bcrypt-adapter/bcrypt-adapter";
import { JwtAdapter } from "../../../infra/criptography/jwt-adapter/jwt-adapter";
import env from "../../config/env";

export const makeLoginController = (): Controller => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const validation = makeLoginValidation();
  const accountMongoRepository = new AccountMongoRepository();
  const dbAuthentication = new DbAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository);
  const loginController = new LoginController(validation, dbAuthentication);
  const logErrorRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logErrorRepository);
}