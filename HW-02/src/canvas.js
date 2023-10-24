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
let test, test2; 

const MySprite = class{
	constructor(xPos, yPos, radius, barWidth, barMaxHeight, barPadding){
		this.xPos = xPos;
		this.yPos = yPos;
		this.radius = radius;
		this.barWidth = barWidth;
		this.barMaxHeight = barMaxHeight;
		this.barPadding = barPadding;
	}

	draw(){
		ctx.fillStyle = "white";
		ctx.save();
		ctx.translate(this.xPos, this.yPos);
		ctx.rotate(rotation);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
		ctx.fill();
		ctx.closePath();
		ctx.restore();

		drawRadialBars(this.xPos, this.yPos, this.radius, this.barWidth, this.barMaxHeight, this.barPadding);
	}

	update(){
		ctx.save();
		ctx.rotate(.05);
		ctx.restore();
	}
};

const setupCanvas = (canvasElement,analyserNodeRef) => {
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#0A7C69"},{percent:.25,color:"#5BC8D2"},{percent:.5,color:"#F1EFFF"},{percent:.75,color:"#7BADE2"},{percent:1,color:"#083371"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
	audioData = new Uint8Array(analyserNode.fftSize/2);

	test = new MySprite(880, 240, 50, 1.4, 40, 1);
	test2 = new MySprite(240, 540, 100, 3.8, 60, 1);
	rotation = 0;
}

const draw = (params={}) => {
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
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
	if(params.showBars){
		// let barSpacing = 4;
		// let margin = 5;
		// let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
		// let barWidth = screenWidthForBars / audioData.length;
		// let barHeight = 200;
		// let topSpacing = 250;

		// ctx.save();
		// ctx.fillStyle = 'rgba(255, 255, 255, .5)';
		// ctx.strokeStyle = 'rgba(0, 0, 0, .5)';
		// // loop through data and draw
		// for (let i = 0; i<audioData.length; i++) {
		// 	ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
		// 	ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256-audioData[i], barWidth, barHeight);
		// }
		// ctx.restore();

		drawCircularBars(540, 360, 5, 100, 4);
	}

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
			ctx.fillStyle = utils.makeColor(85, 215, 172, .34 - percent/3.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			// blue-ish circles, bigger, more transparent
			ctx.beginPath();
			ctx.fillStyle = utils.makeColor(0, 0, 255, .1 - percent/10.0);
			ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius * 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.closePath();

			// yellow-ish circles, smaller
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
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

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

	test.draw();
	test2.draw();

	rotation -= 0.01;
}

const drawCircularBars = (xStart, yStart, barWidth, maxBarHeight, barPadding) => {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.save();
	
	ctx.translate(xStart, yStart);
	ctx.rotate(rotation);
	ctx.translate(0, -yStart/2)

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

const drawRadialBars = (xStart, yStart, radialOffset, barWidth, maxBarHeight, barPadding) => {
	ctx.fillStyle = "white";
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

export {setupCanvas,draw};