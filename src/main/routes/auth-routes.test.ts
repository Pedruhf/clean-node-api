import request from "supertest";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import app from "../config/app";

describe('Auth Routes', () => {
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
  
  describe('POST /signup', () => {
    it('Should return 201 on signup success', async () => {
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
});