import {ctx, rotation, drawCircularBars} from '../canvas';

export default class Planet{
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