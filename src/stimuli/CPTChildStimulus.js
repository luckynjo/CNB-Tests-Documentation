/***
*
* Rectablge shape.
*/
export default class CPTChildStimulus
{
	constructor(base64_encoded_img)
	{
		this.image = new Image();
		this.image.src = base64_encoded_img;
	}

	draw(ctx)
	{
		this.image.height = 300;
		this.image.width = 270;
		const destH = 300;
		const ratio = destH / this.image.height;
		const destW = Math.round(ratio*this.image.width);
		ctx.drawImage(this.image, (800 - 300)/2, (600 - 400)/2, 300, 270);
	}
};
