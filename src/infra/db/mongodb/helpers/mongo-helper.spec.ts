import { MongoHelper as sut } from "./mongo-helper";

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  it('Should reconnect if client is down', async () => {
    let accountsCollection = await sut.getCollection("accounts");
    expect(accountsCollection).toBeTruthy();
    await sut.disconnect();
    accountsCollection = await sut.getCollection("accounts");
    expect(accountsCollection).toBeTruthy()
  });
});
