import { HttpRequest, httpResponse } from "../protocols/http";


export class SignUpController {
  handle(httpRequest: HttpRequest): httpResponse {
    const requiredFields = ["name", "email"];

    for(const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return {
          statusCode: 400,
          body: new Error(`Missing param: ${field}`),
        };
      }
    }
  }
}
