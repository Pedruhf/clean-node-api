import { LoginController } from "../../../../../presentation/controllers/auth/login/login-controller";
import { Controller } from "../../../../../presentation/protocols";
import { makeLoginValidation } from "./login-validation-factory";
import { makeDbAuthentication } from "../../../usecases/authentication/db-authentication-factory";
import { makeLogControllerDecorator } from "../../../decorators/log-controller-decorator-factory";

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(makeLoginValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(loginController);
}