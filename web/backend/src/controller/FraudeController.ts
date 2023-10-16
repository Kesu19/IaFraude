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

  async getFraude(request: Request, response: Response, next: NextFunction) {
    const predict: Predict = {
      wind_speed: 10.0, // Example wind_speed
      intensity: 20.0, // Example intensity
      ambient_temp: 25.0, // Example ambient_temp
      cable_temp: 30.0, // Example cable_temp
      time: 100, // Example time
      delta: 10 // Example delta
    };

    try {
      const fastAPIResponse = await axios.post('http://127.0.0.1:8000/temperature/', predict);
      response.json(fastAPIResponse.data);
    } catch (error) {
      next(error);
    }
  }
}