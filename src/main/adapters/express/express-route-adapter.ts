import { Controller, HttpRequest } from "../../../presentation/protocols"
import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.handle(httpRequest);
    if (httpResponse.statusCode === 201) {
      return res.status(httpResponse.statusCode).json(httpResponse.body);
    }

    res.status(httpResponse.statusCode).json({
      error: httpResponse.body.message
    });
  }
}