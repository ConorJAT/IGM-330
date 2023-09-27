import {getRandomColor, getRandomInt} from "./utils.js";
import {drawRectangle, drawRandomRect, drawArc, drawRandomArc, drawLine, drawRandomLine} from "./canvas-utils.js";

let ctx;
let canvas;
let obj;
let paused = false;

let createRectangles = true;
let createArcs = true; 
let createLines = true;
	
const init = () => {
	canvas = document.querySelector("canvas");
	ctx = canvas.getContext("2d");

    obj = {
        ctx,
        minX: 0, 
        minY: 0, 
        maxX: canvas.width, 
        maxY: canvas.height, 
        minWidth: 10, 
        maxWidth: 90, 
        minHeight: 10, 
        maxHeight: 90,
        minRadius: 10,
        maxRadius: 90
    }

	// rect()
	drawRectangle(ctx, 20, 20, 600, 440, "red");
	drawRectangle(ctx, 120, 120, 400, 300, "rgb(255, 255, 0)", 10, "green");

	// lineTo()
	drawLine(ctx, 20, 20, 620, 460, 5, "green");
	drawLine(ctx, 620, 20, 20, 460, 5, "green");

	// arc()
	drawArc(ctx, 320, 240, 50, 0, Math.PI*2, "purple", 5, "green");
	drawArc(ctx, 320, 240, 20, 0, Math.PI, "yellow", 5, "green");

	// check off
	drawArc(ctx, 300, 220, 10, 0, Math.PI*2, "yellow", 5, "green");
	drawArc(ctx, 340, 220, 10, 0, Math.PI*2, "yellow", 5, "green");
	drawLine(ctx, 20, 20, 620, 20, 20, "purple");

	setupUI();

	update();
};

const update = () => {
	if(paused) return;
	requestAnimationFrame(update);
	if(createRectangles) drawRandomRect(obj);
	if(createArcs) drawRandomArc(obj);
	if(createLines) drawRandomLine(obj);
};

// event handler function!
const canvasClicked = (e) => {
	let rect = e.target.getBoundingClientRect();
	let mouseX = e.clientX - rect.x;
	let mouseY = e.clientY - rect.y;

	for (let i = 0; i < 10; i++){
		let x = getRandomInt(-100, 100) + mouseX;
		let y = getRandomInt(-100, 100) + mouseY;
		let radius = getRandomInt(20, 50);
		let color = getRandomColor();
		drawArc(ctx, x, y, radius, 0, Math.PI*2, color);
	}
};

// helper function!
const setupUI = () => {	
	document.querySelector("#btn-pause").onclick = () => { paused = true; };

	document.querySelector("#btn-play").onclick = () => {
		if (paused){
			paused = false;
			update();
		}
	};

	document.querySelector("#btn-clear").onclick = () => { drawRectangle(ctx, 0, 0, 640, 480, "white"); };

    canvas.onclick = canvasClicked;

	document.querySelector("#cb-rectangles").onclick = (e) => { createRectangles = e.target.checked; };

	document.querySelector("#cb-arcs").onclick = (e) => { createArcs = e.target.checked; };

	document.querySelector("#cb-lines").onclick = (e) => { createLines = e.target.checked; };
};

init();