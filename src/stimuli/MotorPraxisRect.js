/***
*
* Rectablge shape.
*/
export default class MotorPraxisRect
{
	constructor(props, settings)
	{
		var sx = settings.sx || 1;
		var sy = settings.sy || 1;
    this.x = props.x * sx;
    this.y = props.y * sy;
		this.w = props.w * sx;
		this.h = props.h * sy;
		this.response = props.response || null;
	}

	init()
	{

	}

	draw(ctx)
	{
    ctx.fillStyle = "#009900";
    ctx.strokeStyle = "#009900";
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.stroke();
		ctx.fill();
	}

	onMouseMove(data)
	{

		let x1 = this.x;
		let y1 = this.y;
		let x2 = this.x + this.w;
		let y2 = this.y + this.h;

		return (data.x >= x1 && data.x <= x2 && data.y >= y1 && data.y <= y2);
	}

	onResponse(data)
	{
		return this.onMouseMove(data);
	}
}
