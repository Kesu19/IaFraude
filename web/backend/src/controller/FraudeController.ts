import { NextFunction, Request, Response } from 'express';
import axios from 'axios';

interface Predict {
  wind_speed: number;
  intensity: number;
  ambient_temp: number;
  cable_temp: number;
  time: number;
  delta: number;
}

export class FraudeController {
  constructor() {}

  async getTemperature(request: Request, response: Response, next: NextFunction) {
    const predict: Predict = request.body

    try {
      const fastAPIResponse = await axios.post('http://127.0.0.1:8000/temperature/', predict);
      response.json(fastAPIResponse.data);
    } catch (error) {
      next(error);
    }
  }
}