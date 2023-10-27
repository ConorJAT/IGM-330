/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let rotation;
let canvasSprites = []; 

const Planet = class{
	constructor(xPos, yPos, radius, barWidth, barMaxHeight, barPadding, fillColor){
		this.xPos = xPos;
		this.yPos = yPos;
		this.radius = radius;
		this.barWidth = barWidth;
		this.barMaxHeight = barMaxHeight;
		this.barPadding = barPadding;
		this.fillColor = fillColor;
	}

	draw(){
		ctx.fillStyle = this.fillColor;
		ctx.strokeStyle = "white";
		ctx.save();
		ctx.translate(this.xPos, this.yPos);
		ctx.rotate(rotation);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.closePath();
		ctx.restore();

		drawCircularBars(this.xPos, this.yPos, this.radius, this.barWidth, this.barMaxHeight, this.barPadding, "white");
	}

	changeFillColor(value){
		this.fillColor = value;
	}
};

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#00101c"},{percent:.33,color:"#041f3a"},{percent:.67,color:"#083f53"},{percent:1,color:"#239294"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);


	canvasSprites = [new Planet(540, 620, 184, 5, 100, 4, "rgba(14, 111, 128, .9)"), new Planet(880, 300, 120, 2.9, 60, 3, "rgba(27, 45, 112, .9)"), new Planet(200, 180, 50, 1.4, 40, 1, "rgba(6, 37, 87, .9)")];
	rotation = 0;
}

const draw = (params={}) => {
  	// 1 - populate the audioData array with the frequency data from the analyserNode
	if (params.visualData == "frequency") analyserNode.getByteFrequencyData(audioData);
	else if (params.visualData == "time-domain") analyserNode.getByteTimeDomainData(audioData);
	
	// 2 - draw background
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = .1;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.restore();
		
	// 3 - draw gradient
	if(params.showGradient){
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.restore();
	}

	// 4 - draw bars
	// if(params.showBars){
	// }

	// 5 - draw circles
	if(params.showCircles){
		let maxRadius = canvasHeight/4;
		ctx.save();
		ctx.globalAlpha = .5;
		for (let i = 0; i<audioData.length; i++) {
			// red-ish circles
			let percent = audioData[i] / 255;

			let circleRadius = percent * maxRadius;
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(210, 210, 210, .34 - percent/3.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(180, 180, 180, .1 - percent/10.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(240, 240, 240, .5 - percent/5.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * .5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();
			ctx.restore();
		}
		ctx.restore();
	}

	// 6 - bitmap manipulation
	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width;

	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
	for (let i = 0; i < length; i += 4){ 

		// C) randomly change every 20th pixel to red
		if (params.showNoise && Math.random() < .05){		
			// data[i] is the red channel
			// data[i+1] is the green channel
			// data[i+2] is the blue channel
			// data[i+3] is the alpha channel
			data[i] = data[i+1] = data[i+2] = 0; // zero out the red and green and blue channels
			data[i] = 255;
			data[i+1] = 255;
			data[i+2] = 255;
		} // end if
	} // end for

	// D) copy image data back to canvas
	ctx.putImageData(imageData, 0, 0);

	if (params.showPlanets) for (let s of canvasSprites) s.draw();
	rotation -= 0.01;
}

const drawCircularBars = (xStart, yStart, radialOffset, barWidth, maxBarHeight, barPadding, fillColor) => {
	ctx.fillStyle = fillColor;
	ctx.strokeStyle = "black";
	ctx.save();
	
	ctx.translate(xStart, yStart);
	ctx.rotate(rotation);
	ctx.translate(0, -radialOffset)

	for (let d of audioData){
		let percent = d/255;
		if (percent < 0.02) percent = .02;

		ctx.translate(barWidth, 0);
		ctx.rotate((Math.PI * 2) / 128);
		
		ctx.save();
		ctx.scale(1, -1);
		ctx.fillRect(0, 0, barWidth, maxBarHeight * percent);
		ctx.restore();

		ctx.translate(barPadding, 0);
	}

	ctx.restore();
};

const changeTheme = (params={}, value) => {
	if (value != "none") params.showGradient = true;
	
	if (value == "evening") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#00101c"},{percent:.33,color:"#041f3a"},{percent:.67,color:"#083f53"},{percent:1,color:"#239294"}]);
		canvasSprites[0].changeFillColor("rgba(14, 111, 128, .9)");
		canvasSprites[1].changeFillColor("rgba(27, 45, 112, .9)");
		canvasSprites[2].changeFillColor("rgba(6, 37, 87, .9)");
	}
	
	else if (value == "midnight"){
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#070707"},{percent:.5,color:"#1D1D25"},{percent:1,color:"#263242"}]);
		canvasSprites[0].changeFillColor("rgba(48, 68, 92, 0.9)");
		canvasSprites[1].changeFillColor("rgba(42, 42, 56, 0.9)");
		canvasSprites[2].changeFillColor("rgba(35, 35, 43, 0.9)");
	} 
	else if (value == "morning") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#0087A5"},{percent:.33,color:"#7FACB2"},{percent:.67,color:"#D4C6AB"},{percent:1,color:"#FAAD51"}]);
		canvasSprites[0].changeFillColor("rgba(245, 186, 118, 0.9)");
		canvasSprites[1].changeFillColor("rgba(165, 204, 207, 0.9)");
		canvasSprites[2].changeFillColor("rgba(15, 141, 166, 0.9)");
	}

	else if (value == "afternoon") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#3B589E"},{percent:.33,color:"#6A719F"},{percent:.67,color:"#B28393"},{percent:1,color:"#EC5065"}]);
		canvasSprites[0].changeFillColor("rgba(245, 144, 145, 0.9)");
		canvasSprites[1].changeFillColor("rgba(172, 156, 184, 0.9)");
		canvasSprites[2].changeFillColor("rgba(95, 122, 194, 0.9)");
	}
	else if (value == "none") {
		params.showGradient = false;
		canvasSprites[0].changeFillColor("white");
		canvasSprites[1].changeFillColor("white");
		canvasSprites[2].changeFillColor("white");
	}	
}
export {setupCanvas,draw,changeTheme};