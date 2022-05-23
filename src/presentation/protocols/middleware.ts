import { HttpRequest, httpResponse } from "./http";

export interface Middleware {
  handle(httpRequest: HttpRequest): Promise<httpResponse>
}
