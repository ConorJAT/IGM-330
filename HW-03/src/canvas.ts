// The purpose of this file is to take in the analyser node and a <canvas> element: 
//   - The module will create a drawing context that points at the <canvas> 
//   - It will store the reference to the analyser node
//   - In draw(), it will loop through the data in the analyser node
//   - And then draw something representative on the canvas

// Import from local ts file.
import * as utils from './utils';
import Planet from './classes/planet';
import DrawParams from './interfaces/drawParams.interface';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;
let rotation;
let canvasSprites = []; 

// Declare DrawParams interface to dictate what gets shown or not.
let drawParams : DrawParams = {visualData: "frequency", showGradient: true, showPlanets: true, showCircles: true, showNoise: false};


// Set up the canvas for visualization.
const setupCanvas = (canvasElement,analyserNodeRef) => {
	// 1.) - Create drawing context.
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

	// 2.) - Create default gradient that runs top to bottom.
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#00101c"},{percent:.33,color:"#041f3a"},{percent:.67,color:"#083f53"},{percent:1,color:"#239294"}]);

	// 3.) - Store a reference to the analyser node.
	analyserNode = analyserNodeRef;

	// 4.) - Set up array where the analyser data will be stored.
	audioData = new Uint8Array(analyserNode.fftSize/2);

	// 5.) - Set up visualizer sprites and rotation value.
	canvasSprites = [new Planet({xPos: 540, yPos: 620, radius: 184, barWidth: 5, barMaxHeight: 100, barPadding: 4, fillColor: "rgba(14, 111, 128, .9)"}), 
					 new Planet({xPos: 880, yPos: 300, radius: 120, barWidth: 2.9, barMaxHeight: 60, barPadding: 3, fillColor: "rgba(27, 45, 112, .9)"}), 
					 new Planet({xPos: 200, yPos: 180, radius: 50, barWidth: 1.4, barMaxHeight: 40, barPadding: 1, fillColor: "rgba(6, 37, 87, .9)"})];
	rotation = 0;
}


// Draw elements to the canvas.
const draw = () => {
  	// 1.) - Populate the audioData array with the frequency (or time domain) data from the analyserNode.
	if (drawParams.visualData == "frequency") analyserNode.getByteFrequencyData(audioData);
	else if (drawParams.visualData == "time-domain") analyserNode.getByteTimeDomainData(audioData);
	
	// 2.) - Draw the background.
	ctx.save();
	ctx.fillStyle = "black";
	ctx.globalAlpha = .1;
	ctx.fillRect(0, 0, canvasWidth, canvasHeight);
	ctx.restore();
		
	// 3.) - Draw the gradient.
	if(drawParams.showGradient){
		ctx.save();
		ctx.fillStyle = gradient;
		ctx.globalAlpha = .3;
		ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.restore();
	}

	// 4.) - Draw center beat circles.
	if(drawParams.showCircles){
		let maxRadius = canvasHeight/4;
		ctx.save();
		ctx.globalAlpha = .5;
		for (let i = 0; i<audioData.length; i++) {
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

	// 5.) - Draw visual noise via bitmap manipulation.
	// 5A.) - Grab all of the pixels on the canvas and put them in the `data` array.
	let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
	let data = imageData.data;
	let length = data.length;
	let width = imageData.width;

	// 5B.) - Iterate through each pixel, stepping 4 elements at a time.
	for (let i = 0; i < length; i += 4){ 

		// 5C.) - Randomly change every 20th pixel to white.
		if (drawParams.showNoise && Math.random() < .05){		
			data[i] = data[i+1] = data[i+2] = 0;
			data[i] = 255;
			data[i+1] = 255;
			data[i+2] = 255;
		}
	}

	// 5D.) - Copy image data back to canvas.
	ctx.putImageData(imageData, 0, 0);

	// 6.) - Draw the sprites and alter rotation value.
	if (drawParams.showPlanets) for (let s of canvasSprites) s.draw();
	rotation -= 0.01;
}


// Draws beat bars that encircle and rotate for the sprites.
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


// Changes the visual theme (gradient and sprites).
const changeTheme = (value) => {
	if (value != "none") drawParams.showGradient = true;
	
	// Set to evening theme colors.
	if (value == "evening") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#00101c"},{percent:.33,color:"#041f3a"},{percent:.67,color:"#083f53"},{percent:1,color:"#239294"}]);
		canvasSprites[0].changeFillColor("rgba(14, 111, 128, .9)");
		canvasSprites[1].changeFillColor("rgba(27, 45, 112, .9)");
		canvasSprites[2].changeFillColor("rgba(6, 37, 87, .9)");
	}
	
	// Set to midnight theme colors.
	else if (value == "midnight"){
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#070707"},{percent:.5,color:"#1D1D25"},{percent:1,color:"#263242"}]);
		canvasSprites[0].changeFillColor("rgba(48, 68, 92, 0.9)");
		canvasSprites[1].changeFillColor("rgba(42, 42, 56, 0.9)");
		canvasSprites[2].changeFillColor("rgba(35, 35, 43, 0.9)");
	} 

	// Set to morning theme colors.
	else if (value == "morning") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#0087A5"},{percent:.33,color:"#7FACB2"},{percent:.67,color:"#D4C6AB"},{percent:1,color:"#FAAD51"}]);
		canvasSprites[0].changeFillColor("rgba(245, 186, 118, 0.9)");
		canvasSprites[1].changeFillColor("rgba(165, 204, 207, 0.9)");
		canvasSprites[2].changeFillColor("rgba(15, 141, 166, 0.9)");
	}

	// Set to afternoon theme colors.
	else if (value == "afternoon") {
		gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"#3B589E"},{percent:.33,color:"#6A719F"},{percent:.67,color:"#B28393"},{percent:1,color:"#EC5065"}]);
		canvasSprites[0].changeFillColor("rgba(245, 144, 145, 0.9)");
		canvasSprites[1].changeFillColor("rgba(172, 156, 184, 0.9)");
		canvasSprites[2].changeFillColor("rgba(95, 122, 194, 0.9)");
	}

	// Deactivate gradient and set sprites to white.
	else if (value == "none") {
		drawParams.showGradient = false;
		canvasSprites[0].changeFillColor("white");
		canvasSprites[1].changeFillColor("white");
		canvasSprites[2].changeFillColor("white");
	}	
}

export {setupCanvas,draw,changeTheme,drawParams,ctx,rotation,drawCircularBars};