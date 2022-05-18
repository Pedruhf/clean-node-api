import { ServerError, UnauthorizedError } from "../../errors";
import { httpResponse } from "../../protocols/http"

export const ok = <T> (data: T): httpResponse => {
  return {
    statusCode: 200,
    body: data,
  };
}

export const created = <T> (data: T): httpResponse => {
  return {
    statusCode: 201,
    body: data,
  };
}

export const badRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error,
  };
}

export const unauthorized = (): httpResponse => {
  return {
    statusCode: 401,
    body: new UnauthorizedError()
  }
}

export const forbidden = (error: Error): httpResponse => {
  return {
    statusCode: 403,
    body: error
  }
}

export const serverError = (error: Error): httpResponse => {
  return {
    statusCode: 500,
    body: new ServerError(error.stack),
  };
}
