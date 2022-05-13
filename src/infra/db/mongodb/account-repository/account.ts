import { AddAccountRepository } from "../../../../data/protocols/db/add-account-repository";
import { AccountModel } from "../../../../domain/models/account";
import { AddAccountModel } from "../../../../domain/usecases/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AccountMongoRepository implements AddAccountRepository {
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const { value: result } = await accountCollection.findOneAndUpdate(accountData,
      { $setOnInsert: accountData },
      { upsert: true, returnDocument: "after" },
    );

    return MongoHelper.map(result)
  }
}