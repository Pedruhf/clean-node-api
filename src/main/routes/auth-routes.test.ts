import request from "supertest";
import app from "../config/app";
import { Collection } from "mongodb";
import { MongoHelper } from "../../infra/db/mongodb/helpers/mongo-helper";
import { hash } from "bcrypt";

let accountCollection: Collection;

describe('Auth Routes', () => {
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

  describe('POST /login', () => {
    it('Should return 200 on login success', async () => {
      const hashedPassword = await hash("asdasdasd", 12)
      await accountCollection.insertOne({
        name: "Pedro Freitas",
        email: "pedrofreitas@gmail.com",
        password: hashedPassword,
      });

      await request(app)
        .post("/api/login")
        .send({
          email: "pedrofreitas@gmail.com",
          password: "asdasdasd",
        })
        .expect(200);
    });

    it('Should return 401 on signup fails', async () => {
      await request(app)
        .post("/api/login")
        .send({
          email: "pedrofreitas@gmail.com",
          password: "asdasdasd",
        })
        .expect(401);
    });
  });
});
