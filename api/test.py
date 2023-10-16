from fastapi import FastAPI
from pydantic import BaseModel
from codecarbon import EmissionsTracker
from numba import jit

app = FastAPI()

@jit(nopython=True)
def calculate_temperature(Tc, t, I, Ta, ws, delta=30):
    return (-(ws**2 / 1600) * 0.4 - 0.1) * (Tc - Ta - (I**1.4 / 1.473785) * 130) * (delta / 60 / 1000)

@jit(nopython=True)
def calculate_temperature_wrapper(time, ws, ta, tc, i, delta):
    x_values = []
    y_values = []
    time_in_milliseconds = time * 1000
    for n in range(0, time_in_milliseconds + delta, delta):
        x_values.append(n / 1000)
        y_values.append(tc)
        tc = calculate_temperature(tc, ta, i, ta, ws, delta)
    return x_values, y_values

class TemperatureInput(BaseModel):
    wind_speed: float
    intensity: float
    ambient_temperature: float
    cable_temperature: float
    time: int
    delta: int

@app.post("/calculate_temperature/")
def calculate_temperature_estimate(data: TemperatureInput):

    emissions_tracker = EmissionsTracker()
    emissions_tracker.start()

    x_values, y_values = calculate_temperature_wrapper(data.time, data.wind_speed, data.ambient_temperature, data.cable_temperature, data.intensity, data.delta)

    emissions = emissions_tracker.stop()

    return {"estimation": y_values[-1], "energy": emissions}
