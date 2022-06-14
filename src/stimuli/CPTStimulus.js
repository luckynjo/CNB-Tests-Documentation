/***
*
* Rectablge shape.
*/
export default class CPTStimulus
{
	constructor(base64_encoded_img)
	{
		this.image = new Image();
		this.image.src = base64_encoded_img;
		this.image.style.height = "350px";
		this.image.style.width = "auto";

		console.log('CPT stim image is ', base64_encoded_img);
	}

	draw(ctx)
	{
		const destH = 350;
		const ratio = destH / this.image.height;
		const destW = Math.round(ratio*this.image.width);
		ctx.drawImage(this.image, (800 - this.image.width)/2, (600 - this.image.height)/2, this.image.width, this.image.height);
	}
};
