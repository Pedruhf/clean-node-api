import { Collection } from "mongodb";
import { MongoHelper } from "../helpers/mongo-helper";
import { AccountMongoRepository } from "./account-mongo-repository";

let accountCollection: Collection;

const makeSut = ():AccountMongoRepository => {
  return new AccountMongoRepository()
}

describe('AccountMongoRepository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });

  describe('add()', () => {
    it('Should return an account on add success', async () => {
      const sut = makeSut();
      const account = await sut.add({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });
  
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });
  });
  
  describe('loadByEmail()', () => {
    it('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();
      await accountCollection.insertOne({
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      });
      
      const account = await sut.loadByEmail("any_email@mail.com");
  
      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe("any_name");
      expect(account.email).toBe("any_email@mail.com");
      expect(account.password).toBe("any_password");
    });
  
    it('Should return null if loadByEmail fails', async () => {
      const sut = makeSut();
      const account = await sut.loadByEmail("any_email@mail.com");
  
      expect(account).toBe(null);
    });
  });
  
  describe('updateAccessToken()', () => {
    it('Should update the account accessToken on updateAccessToken success', async () => {
      const sut = makeSut();
      const accountData = {
        name: "any_name",
        email: "any_email@mail.com",
        password: "any_password",
      };
  
      const { value: result } = await accountCollection.findOneAndUpdate(accountData,
        { $setOnInsert: accountData },
        { upsert: true, returnDocument: "after" },
      );
      
      expect(result.accessToken).toBeFalsy();
      await sut.updateAccessToken(result._id as unknown as string, "any_token");
      const account = await accountCollection.findOne({ _id: result._id });
  
      expect(account).toBeTruthy();
      expect(account.accessToken).toBe("any_token");
    });
  });
});
