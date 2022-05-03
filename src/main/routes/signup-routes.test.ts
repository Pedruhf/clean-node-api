import request from "supertest";
import app from "../config/app";

describe('SignUp Route', () => {
  it('Should return an account on success', async () => {
    await request(app)
      .post("/api/signup")
      .send({
        name: "Pedro Freitas",
        email: "pedrofreitas@gmail.com",
        password: "asdasdasd",
        passwordConfirmation: "asdasdasd"
      })
      .expect(200);
  });
});