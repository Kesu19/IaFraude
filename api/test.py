from fastapi import FastAPI
from pydantic import BaseModel
from codecarbon import EmissionsTracker
from numba import jit

app = FastAPI()

@jit(nopython=True)
def temp(ws, ta, tc, i, delta=30):
    tc = ((-ws**2/1600) * 0.4-0.1) * (tc - ta - (i**1.4/73785) * 130) * (delta/60/1000) + tc
    return tc
 
@jit(nopython=True)
def temp_wrapper(time, ws, ta, tc, i, delta):
    x = []
    y = []
    time = time*1000
    for n in range(0, time+delta, delta):
        x.append(n/1000)
        y.append(tc)
        tc = temp(ws, ta, tc, i, delta)
    return x, y

class InputData(BaseModel):
    wind_speed: float
    intensity: float
    ambient_temp: float
    cable_temp: float
    time: int
    delta: int

@app.post("/temperature/")
def estimate(data: InputData):

    tracker = EmissionsTracker()
    tracker.start()

    resx, resy = temp_wrapper(data.time, data.wind_speed, data.ambient_temp, data.cable_temp, data.intensity, data.delta)

    emissions: float = tracker.stop()

    return {"estimation": resy[-1], "energy": emissions}
