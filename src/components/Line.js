/***
* Plot test line objects.
*/
export default class Line
{

	constructor(props, settings)
	{
		this.x = props.x;
		this.y = props.y;
		this.radius = props.radius || 24;
		this.theta = props.theta || 60;
		this.startAngle = props.theta || 60;
		this.delta = props.delta || 9;
		this.coordinates = [];
		this.color = props.type === 'red' ? '#CC3300' : '#0097CB';
		this.lineWidth = props.type === 'red' ? 3 : 2;
		this.currentRotationDirection = 0;
		this.currentMoves = 0;
		this.moves = "";
		this.showExtension = false;
		this.init();
	}

	init()
	{
		this.coordinates = [];
		let a = this.angleToRadians(this.theta);
		let dx = this.radius*Math.cos(a);
		let dy = this.radius*Math.sin(a);
		this.coordinates[0] = this.x + dx;
		this.coordinates[1] = this.y + dy;
		this.coordinates[2] = this.x - dx;
		this.coordinates[3] = this.y - dy;
	}

	getCoordinates()
	{
		let a = this.angleToRadians(this.theta);
		let dx = this.radius*Math.cos(a);
		let dy = this.radius*Math.sin(a);

		return [this.x + dx, this.y + dy, this.x - dx, this.y - dy];
	}

	draw(ctx)
	{
		ctx.globalAlpha = 1;
		ctx.strokeStyle = this.color;
		ctx.lineWidth = this.lineWidth;
		ctx.beginPath();
		ctx.moveTo(this.coordinates[0], this.coordinates[1]);
		ctx.lineTo(this.coordinates[2], this.coordinates[3]);
		ctx.stroke();

		if(this.showExtension)
		{
			this.drawExtension(ctx);
		}
	}

	drawExtension(ctx)
	{
		let a = this.angleToRadians(this.theta);
		let dx = 60*Math.cos(a);
		let dy = 60*Math.sin(a);
		var x1 = this.x + dx;
		var y1= this.y + dy;
		var x2= this.x - dx;
		var y2 = this.y - dy;

		ctx.lineWidth=4;
		ctx.globalAlpha=0.5;
		ctx.strokeStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		this.showExtension = false;
	}

	angleToRadians(degrees)
	{
		var rad=degrees*Math.PI/180;
		return rad;
	}

	parallelTo(line)
	{
		var m1 = this.slope();
		var m2 = line.slope();

		return (Math.round(m1*1000)/1000) == (Math.round(m2*1000)/1000);
	}

	// Helper method to return the direction in which to ratate this line to make it parallel to the other line.
	directionToParallel(line)
	{
		return Math.abs(this.theta) < Math.abs(line.theta) ? 2 : 1;
	}

	normalizeAngle(degrees)
	{
		let a = this.angleToRadians(a);
		let center = Math.PI;
	         return a - (2*Math.PI) * Math.floor((a + Math.PI - center) / (2*Math.PI));
	}

	slope()
	{
		var coordinates = this.getCoordinates();
		var m = (coordinates[3] - coordinates[1])/(coordinates[2] - coordinates[0]);
		return m;
	}

	getMoves()
	{
		return (this.currentMoves == 0) ? "" : (this.currentRotationDirection*this.currentMoves) + "";
	}

	validDirection(dir)
	{
		return dir === 1 || dir === -1;
	}

	onResponse(response)
	{
		let inDirection = response*1;
		if(!this.validDirection(inDirection))
		{
			return "";
		}
		var moves = "";
		// Update the angle
		this.theta += (this.delta*inDirection);

		if(this.currentRotationDirection == 0)
		{
			this.currentRotationDirection = inDirection;
			this.currentMoves++;
		}
		else if(this.currentRotationDirection == inDirection)
		{
			this.currentMoves++;
		}
		else
		{
			moves = (this.currentRotationDirection*this.currentMoves) + "";
			this.currentRotationDirection = inDirection;
			this.currentMoves = 1;
		}

		// Since we are drawing a line (not a vector), a rotation of 180 degrees in either direction returns us to the starting angle.
		// For example we know that 0, 180, and 360 are equivalent; they produce horizontal lines just as 90 and 270 produce vertical lines.
		// Fix rotation bug.
		if(this.theta === 180 || this.theta === -180)
		{
			this.theta = 0;
		}
		else if(this.theta < 0)
		{
			this.theta = 180 + this.theta;
		}
		else if(this.theta > 180)
		{
			this.theta = 360 - this.theta;
		}

		this.init();
		return moves;
	}
}
