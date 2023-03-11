import numpy as np
import matplotlib.pyplot as plt
import sys

def runge_kutta_second_order(equation,x, y, h, n, f, dy=0):
    """ Calcula o valor de y em x usando o método de Runge-Kutta """
    xi = np.arange(x, x + n * h, h)
    yi = np.zeros(n)
    dyi = np.zeros(n)
    yi[0],dyi[0]=y,dy
    for i in range(n-1):
        k1dd = h * f(equation,xi[i], yi[i], dyi[i])
        k1d = h * dyi[i]
        
        k2dd = h*f(equation,xi[i]+h/2, yi[i]+k1d/2, dyi[i]+k1dd/2)
        k2d = h*(dyi[i]+k1dd/2)

        k3dd = h*f(equation,xi[i]+h/2, yi[i]+k2d/2, dyi[i]+k2dd/2)
        k3d = h*(dyi[i]+k2dd/2)

        k4dd = h*f(equation,xi[i]+h, yi[i]+k3d, dyi[i]+k3dd)
        k4d = h*(dyi[i]+k3dd)

        dyi[i+1] = dyi[i] + (k1dd + 2 * k2dd + 2 * k3dd + k4dd) / 6
        yi[i+1] = yi[i] + (k1d + 2 * k2d + 2 * k3d + k4d) / 6
    return xi, yi, dyi

def runge_kutta(x,y,h,n,f):
    xi = np.arange(x, x + n * h, h)
    yi = np.zeros(n)
    yi[0]=y
    for i in range(n-1):
        k1 = h * f(x, y)
        k2 = h * f(x + h / 2, y + k1 / 2)
        k3 = h * f(x + h / 2, y + k2 / 2)
        k4 = h * f(x + h, y + k3)
        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6
        x = x + h
        yi[i+1] = y
    return xi, yi

def ode_second_order(equation,t,y,dy):
    return eval(equation)

def ode(equation,t,y):
    return eval(equation)


def main(equation,x0, y0, dy0, step, n):
    x,y,dy = runge_kutta_second_order(equation,x0, y0, step, n,ode_second_order,dy0)
    fig, ax = plt.subplots()
    ax.plot(x,dy,label='dy')
    ax.plot(x,y,label='y')
    ax.grid()
    ax.legend()
    fig.savefig('./images/plot.png')

if __name__ == "__main__":
    equation, x0, y0, dy0, step, n = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]), int(sys.argv[6])
    main(equation,x0, y0, dy0, step, n)