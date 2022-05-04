import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe('SignUp Route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.deleteMany({});
  });
  
  it('Should return an account on success', async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Pedro Freitas",
        email: "pedrofreitas@gmail.com",
        password: "asdasdasd",
        passwordConfirmation: "asdasdasd"
      })
      .expect(201);
  });
});