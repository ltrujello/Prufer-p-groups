import svgwrite
import statistics
import queue


def toplevel(filename, iterations, colors=['black']*3):
    dwg = svgwrite.Drawing(filename, (1000,1000))

    init_coords = [(450, 450), (250, 50), (50, 450)]
    
    dwg.add(dwg.polygon(init_coords, fill='none', stroke='black'))


    triangles = queue.Queue() # queue of lists of tuples
    triangles.put(init_coords)
    
    while not triangles.empty() and iterations > 0: 
        iterations -= 1
        coords = triangles.get()
        new = medians(dwg, coords, colors)
        for tri in new: 
            triangles.put(tri)

    dwg.save()
 

def medians(dwg, coords, colors):
    '''
    draws medians in dwg
    input: dwg, coords - list of tuples, colors
    output: coords - list of lists of tuple pts to polygons created
    '''
    centroid = (statistics.mean([x[0] for x in coords]), statistics.mean([x[1] for x in coords]))
    
    newtri = [] # save coords of new triangles 

    # get median coordinates for all edges
    midpts = []
    for i in range(-len(coords), 0):
        ax, ay = coords[i]
        bx, by = coords[i+1]
        cx, cy = coords[i+2]

        # get median coords, draw median
        x = statistics.mean([bx, cx])
        y = statistics.mean([by, cy])
        dwg.add(dwg.line((ax, ay), (x, y), stroke=colors[i]))
        midpts.append((x,y))

    # get coords of all new triangles created
    for i in range(len(coords)):
        newtri.append([centroid, midpts[i], coords[i-1]])
        newtri.append([centroid, midpts[i], coords[i-2]])

    return newtri    


warm_colors = ['yellow', 'red', 'orange'] #, 'yellow', 'green', 'blue', 'purple']
cold_colors = ['blue', 'purple', 'green']
kinder_colors = ['yellow', 'blue', 'green']

# for i in range(10, 30):
#     toplevel("test%d.svg" %(i), i, kinder_colors)
    
toplevel("test.svg", 1600, warm_colors)