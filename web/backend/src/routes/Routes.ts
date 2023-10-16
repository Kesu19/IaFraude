import { NextFunction, Request, Response } from "express";
import { FraudeController } from "../controller/FraudeController";

export class Routes {
  private FraudeController: FraudeController;

  constructor() {
    this.FraudeController = new FraudeController();
  }

  public routes(app): void {
    app.route('/').get((request: Request, response: Response) => {
      response.status(200).send({
        message: 'GET request successfully.'
      });
    });

    app.route('/fraudes').get((request: Request, response: Response, next: NextFunction) => {
      this.FraudeController.getFraude(request, response, next);
    });
  }
}
