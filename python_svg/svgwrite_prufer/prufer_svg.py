import svgwrite
import numpy as np
import os

def pth_Angles_List(prime, order):
    angles  = []
    for m in range(1, order + 1):
        angle = []
        for n in range(0, 100000):
            if n < prime**m:
                angle.append(2*np.pi*n/(prime**m))
            else:
                break
        angles.append(angle)
    return angles

def permute_colors(num): #num is the number of colors
    part = 255
    colors = []
    colors.append("rgb(" + str(part))


def prufer_rep(filename, prime, order): 
    center = (500, 500) #center of the complex circle
    radius = 200 #radius of the complex circle
    line_scale = 2 #scaling factor for arrows
    tip_scale = 0.1
    colors = ['blue', 'purple', 'red', 'green', 'magenta', 'orange', 'black', "brown", 'blue', "purple", "red"] #color sequence

    angles = pth_Angles_List(prime, order)
    dwg = svgwrite.Drawing(filename, viewBox=('0 0 1000 1000'))   
    dwg.add(dwg.circle( center, radius, fill = "white", stroke = "black")) #the complex circle
    for i in range(len(angles)):
        line_scale = line_scale*(0.70) #line_scale makes sure that the family of arrows length get smaller across each iteration
        tip = tip_scale*(2*np.pi/(prime**(i + 1)))*radius*(1 + line_scale)

        for angle in angles[i]:     #draws the lines from initial to final point
            x_i = center[0] + radius*np.cos(angle) #initial point
            y_i = center[1] + radius*np.sin(angle)
            x_f = center[0] + radius*(1 + line_scale)*np.cos(angle) #final point
            y_f = center[1] + radius*(1 + line_scale)*np.sin(angle)

            if prime**(i+1) < 33: #takes care of crazy looking arrow tips
                dwg.add(dwg.circle( (x_f, y_f), 8, fill = colors[i])) #adds a tip to the lines
                dwg.add(dwg.line( (x_i, y_i), (x_f, y_f), stroke = colors[i] )) #adds the line
            else:
                dwg.add(dwg.circle( (x_f, y_f), tip, fill = colors[i])) #adds a tip to the lines
                dwg.add(dwg.line( (x_i, y_i), (x_f, y_f), stroke = colors[i], stroke_width = str(1.5*tip) )) #adds the line
    dwg.save() 