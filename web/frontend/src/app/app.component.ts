import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import axios from 'axios';
interface Predict {
  vitesse_vent :number
  temperature_abiant    :number
  temparature_cable    :number
  intesite    :number
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: Predict = {
    vitesse_vent: 0,
    temperature_abiant: 0,
    temparature_cable: 0,
    intesite: 0,
  };

  isFraud:boolean = false
  constructor(private http: HttpClient) {}

  onSubmit() {
    const apiUrl = 'http://localhost:4547/predict'; // Remplacez par votre URL API correcte
    axios.post(apiUrl, this.data).then(
      (response) => {
        this.isFraud = response.data.prediction == 1
        console.log('Réponse de l\'API :', response.data.prediction);
      },
      (error) => {
        console.error('Erreur lors de la requête POST :', error);
      }
    );
  }


}
