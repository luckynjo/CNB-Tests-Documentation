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
			this.stimulus.src = stimulus;
			this.stimulus.style.height = "350px";
			this.stimulus.style.width = "auto";
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
			const ratio = destH / this.stimulus.height;
			const destW = Math.round(ratio*this.stimulus.width);
			ctx.drawImage(this.stimulus, (800 - this.stimulus.width)/2, (600 - this.stimulus.height)/2, this.stimulus.width, this.stimulus.height);
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
