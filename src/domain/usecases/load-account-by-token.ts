import { AccountModel } from "../models/account";

export interface LoadAccountByToken {
  load (AccessToken: string, role?: string): Promise<AccountModel>
}
