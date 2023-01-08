# Runge Kutta API - A Work in Progress
## This is extremely WIP!! I'll keep updating it as I go along.
This is a simple API for solving ordinary differential equations using the Runge Kutta method.

The Runge Kutta method is a numerical method for solving ordinary differential equations. It is a family of methods that can be used to solve a wide range of problems. The method is named after the German mathematicians Carl Runge and Wilhelm Kutta.

The API was built using Express.js and Node.js with an python script for solving the equations.

## Installation

```bash
   pip install requirements.txt
   npm i package.json
   npm start
```
 This should start the server on port 5000.
 You can change the port in the app.js file.

## Usage

You can send a <span style="color:#C77D48">`POST`</span> request to `localhost:5000/ode` with the following body:

```json
{
    "equation": "'-2*dy-2*y+np.cos(2*t)'",
    "x0": "0",
    "y0": "0",
    "dy0": "0",
    "step": "0.01",
    "max": "20"
}
```

The equation should be a string ready to be evaluated by python(working on the best way to solve that). The x0, y0, dy0, step and max are all numbers.

There may be some unused code, mostly on the python side, but I'll clean it up as I go along and find out what I need and what I don't.