import { httpResponse } from "../protocols/http"

export const badRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
}

export const serverError = (error: Error): httpResponse => {
  return {
    statusCode: 500,
    body: error,
  };
}
