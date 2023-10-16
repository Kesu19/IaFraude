// app.component.ts
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import {CanvasJS} from "@canvasjs/angular-charts";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  capteur = {
    wind_speed: 3.09,
    cable_temp: 20.0,
    ambient_temp: 5.09,
    intensity: 20.0,
    time: 1800.0,
    delta: 10.0,
  };

  response: any = {};
  city = '';
  dataPoints: any[] = [];

  chart: any;
  chartOptions = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'Estimation de température sur les 30 prochaines minutes',
    },
    axisX: {
      minimum:0,
      maximum:1800,


      labelFormatter: function (e: any) {
        return Math.round(e.value / 60);
      },
      title: 'Minutes',
    },
    axisY: {
      title: 'Température',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      itemclick: function (e: any) {
        if (typeof e.dataSeries.visible === 'undefined' || e.dataSeries.visible) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },
    data: [
      {
        type: 'line',
        showInLegend: true,
        name: 'Variation de la température',
        xValueFormatString: '',
        dataPoints: this.dataPoints,
      },
    ],
  };

  constructor() {}

  ngOnInit() {
    // Initialize the chart
    this.chart = new CanvasJS.Chart('chartContainer', this.chartOptions);
  }

  apiCall() {
    const weather = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=3cf54aa3315ab17be061f59b12cd8ca4`;

    axios.get(weather).then((response) => {
      this.capteur.wind_speed = response.data.wind.speed;
      this.capteur.ambient_temp = response.data.main.temp;
    });
  }

  onSubmit() {
    const apiUrl = 'http://localhost:4547/fraudes';

    axios
      .post(apiUrl, this.capteur)
      .then((response) => {
        this.response = response.data;
        this.dataPoints.splice(0); // Vide le tableau dataPoints
        this.chart = new CanvasJS.Chart('chartContainer', this.chartOptions); // Recrée le graphique

        this.dataPoints.push({ x: 0, y: this.capteur.ambient_temp });
        this.dataPoints.push({ x: this.capteur.time, y: this.response.estimation });
        this.chart.render();

      })
      .catch((error) => {
        console.error('Erreur lors de la requête POST :', error);
      });
  }
}