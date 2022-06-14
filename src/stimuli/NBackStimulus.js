/***
*
* Rectablge shape.
*/

const IMG_REGEX = /\.?(png|gif|jpe?g)/ig;
export default class NBackStimulus
{
	constructor(stimulus)
	{
		if(stimulus.match(IMG_REGEX))
		{
			this.stimulus_type = "image";
			this.stimulus = new Image();
			this.image.src = base64_encoded_img;
			this.image.style.height = "350px";
			this.image.style.width = "auto";
		}
		else
		{
			this.stimulus = stimulus;
		}
	}

	draw(ctx)
	{
		if(this.stimulus_type === "image")
		{
			const destH = 350;
			const ratio = destH / this.image.height;
			const destW = Math.round(ratio*this.image.width);
			ctx.drawImage(this.image, (800 - this.image.width)/2, (600 - this.image.height)/2, this.image.width, this.image.height);
		}
		else
		{
			ctx.direction = 'ltr';
			ctx.textAlign = 'center';
			ctx.fillStyle = "#FFFFFF";
			ctx.font = "72px Arial";
			ctx.fillText(this.stimulus, 400, 300);
		}

	}
};
