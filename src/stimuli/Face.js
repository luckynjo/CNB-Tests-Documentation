/***
*
* Rectablge shape.
*/
export default class Face
{
	constructor(base64_encoded_img)
	{
		this.image = new Image();
		this.image.src = base64_encoded_img;
		//console.log('Face image is ', base64_encoded_img);
	}

	draw(ctx)
	{
		console.log('Attempting to draw ', this.image);
		ctx.drawImage(0, 0, this.image);
	}
};
