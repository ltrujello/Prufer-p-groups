// main controls for output
aspect_ratio = 2.5; //vary for aesthetics
const center_x = window.outerWidth/aspect_ratio; //center of complex unit circle
const center_y = window.innerWidth/(2*aspect_ratio);
const radius = aspect_ratio*100; //radius of complex unit circle
const edge = radius/(aspect_ratio*50) //thickness of complex unit circle
const axis_len = 3.5*radius; //length of the complex axis
let line_scale = 2.5; //distance between subsequent groups of circles
let tip_scale = .5; //controls decrease in size of circles
let tip;
let colors = [ "#000000", "#3498DB", "#ff0000", "#9B59B6", "#2980B9", "#27AE60", "#F1C40F", "#E67E22", "#CD6155", "#AF7AC5", "#5499C7", "#52BE80", "#F4D03F", "#EB984E"];
//the prime and order
const prime = 2; 
const order = 10;

//initializes the svg, searches for the id = "dataviz_basicZoom"
const svg = d3.select("#dataviz_basicZoom")
.append("svg")
	.attr("width",  window.innerWidth)
	.attr("height",  window.innerHeight)
	.call(d3.zoom()
		.scaleExtent([.38, Infinity])
		// .translateExtent([0,0], [aspect_ratio*window.innerWidth, aspect_ratio*window.innerHeight])
		.on("zoom", function () { //takes care of zoom thanks to d3
	svg.attr("transform", d3.event.transform)
	}))
.append("g")

//adds the complex circle
svg.append("circle")
	.attr("cx", center_x)
	.attr("cy", center_y)
	.attr("r", radius)
	.style("fill", "#000000")
svg.append("circle")
	.attr("cx", center_x)
	.attr("cy", center_y)
	.attr("r", radius - edge)
	.style("fill", "#ffffff")

//adds the axis
svg.append("line")
	.style("stroke", "#000000")
	.attr("x1",  center_x -axis_len)
	.attr("y1",  center_y )
	.attr("x2",  center_x +axis_len)
	.attr("y2",  center_y )
svg.append("line")
	.style("stroke", "#000000")
	.attr("x1",  center_x)
	.attr("y1",  center_y - axis_len)
	.attr("x2",  center_x)
	.attr("y2",  center_y + axis_len)

//adds the rest of the diagram
let angles = pthAngles(prime, order);
angles.forEach(drawCircles);

function drawCircles(item, index) {
	line_scale *= .80;
	tip = tip_scale*(2*Math.PI/(prime**(index + 1)))*radius*(1 + line_scale)
	item.forEach(drawSubCircles)
	function drawSubCircles(item){
		endpoint_x = (1 + line_scale)*radius*Math.cos(item);
		endpoint_y = (1 + line_scale)*radius*Math.sin(item)

		//we need to consider two cases so that the lines don't run into each other. 
		if(tip > 2){
			svg.append("line")
			.style("stroke", colors[index])
			.attr("x1",  center_x + radius*Math.cos(item))
			.attr("y1",  center_y + radius*Math.sin(item))
			.attr("x2",  center_x + endpoint_x)
			.attr("y2",  center_y + endpoint_y)
		}		
		else{
			svg.append("line")
			.style("stroke", colors[index])
			.attr("x1",  center_x + radius*Math.cos(item))
			.attr("y1",  center_y + radius*Math.sin(item))
			.attr("x2",  center_x + endpoint_x)
			.attr("y2",  center_y + endpoint_y)
			.attr("stroke-width", tip/1.3)
		}
		//we need to consider two cases so that the circles don't run into each other. 
		const size_check = prime**(index); 
		if(size_check < 33){
			svg.append("circle")
			.attr("cx", center_x + endpoint_x)
			.attr("cy", center_y + endpoint_y)
			.attr("r", 10)
			.style("fill", colors[index]);
		}
		else{
			svg.append("circle")
			.attr("cx", center_x + endpoint_x)
			.attr("cy", center_y + endpoint_y)
			.attr("r", tip)
			.style("fill", colors[index]);
		}
	}
}

//outputs an array of arrays containing, in radians, 
//the angles of the roots of unity
function pthAngles (prime, order){
	let all_angles = [];
	for(m = 1; m <= order; m++){
		let mth_angle = [];
			for(n = 0; n <= 10000; n++){
				if(n < prime**m){
					mth_angle.push(2*Math.PI*n/(prime**m));
				}else{
					break;
				}
			}
		all_angles.push(mth_angle);
		}
	return all_angles;
}