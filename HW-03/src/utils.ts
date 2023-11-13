import {ctx, rotation, drawCircularBars} from './canvas';

interface DrawParams{
	visualData    : string,
	showGradient  : boolean,
	showPlanets   : boolean,
	showCircles   : boolean,
	showNoise     : boolean
}

const Planet = class{
	xPos: number;
	yPos: number;
	radius: number;
	barWidth: number;
	barMaxHeight: number;
	barPadding: number;
	fillColor: string;

	constructor({xPos, yPos, radius, barWidth, barMaxHeight, barPadding, fillColor}){
		Object.assign(this, {xPos, yPos, radius, barWidth, barMaxHeight, barPadding, fillColor});
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

const makeColor = (red, green, blue, alpha = 1) => {
  return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
  return Math.random() * (max - min) + min;
};
  
const getRandomColor = () => {
  const floor = 35; // so that colors are not too bright or too dark 
  const getByte = () => getRandom(floor,255-floor);
  return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};
  
const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
  let lg = ctx.createLinearGradient(startX,startY,endX,endY);
  for(let stop of colorStops){
    lg.addColorStop(stop.percent,stop.color);
  }
  return lg;
};
  
// https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
const goFullscreen = (element:HTMLElement) => { element.requestFullscreen(); };
  
export {makeColor, getRandomColor, getLinearGradient, goFullscreen, DrawParams, Planet};