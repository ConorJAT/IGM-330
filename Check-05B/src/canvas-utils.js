import {getRandomColor, getRandomInt} from "./utils.js";

export const drawRectangle = (ctx, x, y, width, height, fillStyle="black", lineWidth=0, strokeStyle="black") => { 
	ctx.save();
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.fill();
	if (lineWidth > 0){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
};

export const drawArc = (ctx, x, y, radius, startAngle=0, endAngle=(MAth.PI*2), fillStyle="black", lineWidth=0, strokeStyle="black") => {
	ctx.save();
	ctx.fillStyle = fillStyle;
	ctx.beginPath();
	ctx.arc(x, y, radius, startAngle, endAngle, false);
	ctx.fill();
	if (lineWidth > 0){
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = strokeStyle;
		ctx.stroke();
	}
	ctx.closePath();
	ctx.restore();
};

export const drawLine = (ctx, x1, y1, x2, y2, lineWidth=1, strokeStyle="black") => {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.closePath();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = strokeStyle;
	ctx.stroke();
	ctx.restore();
};

export const drawRandomRect = (obj) => {
    let x = getRandomInt(obj.minX, obj.maxX);
    let y = getRandomInt(obj.minY, obj.maxY);
    let width = getRandomInt(obj.minWidth, obj.maxWidth);
    let height = getRandomInt(obj.minHeight, obj.maxHeight);
    let fillStyle = getRandomColor();
    let lineWidth = getRandomInt(2, 12);
    let strokeStyle = getRandomColor();

    drawRectangle(obj.ctx, x, y, width, height, fillStyle, lineWidth, strokeStyle);
};

export const drawRandomArc = (obj) => {
	let x = getRandomInt(obj.minX, obj.maxX);
    let y = getRandomInt(obj.minY, obj.maxY);
    let radius = getRandomInt(obj.minRadius, obj.maxRadius);
    let fillStyle = getRandomColor();
    let lineWidth = getRandomInt(2, 12);
    let strokeStyle = getRandomColor();
    
    drawArc(obj.ctx, x, y, radius, 0, Math.PI*2, fillStyle, lineWidth, strokeStyle);
};

export const drawRandomLine = (obj) => {
	let x1 = getRandomInt(obj.minX, obj.maxX);
    let y1 = getRandomInt(obj.minY, obj.maxY);
    let x2 = getRandomInt(obj.minX, obj.maxX);
    let y2 = getRandomInt(obj.minY, obj.maxY);
    let lineWidth = getRandomInt(2, 12);
    let strokeStyle = getRandomColor();

    drawLine(obj.ctx, x1, y1, x2, y2, lineWidth, strokeStyle);
};