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
		console.log(request.body)
		const predict : Predict = request.body
		axios.post("http://127.0.0.1:8000/temperature/",predict)
			.then(data => {
				response.json (data.data)
			})
			.catch(err => next(err));

	}
}