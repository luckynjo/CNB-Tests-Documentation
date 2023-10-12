import Line from '../components/Line.js';
import PlotStimuli from './PlotStimuli.js';
import Stimuli from  './Stimuli.js';
// import Text from './graphics/Text.js';
// import Image from './graphics/Image.js';

export default class CanvasStimuli extends Stimuli
{

	constructor(items, randomize, sampleSize, n, terminate, type)
	{
		super(items, randomize, sampleSize, n, terminate);
		this.type = type;
		this.createItem();
	}

	createItem()
	{
		if(this.type === 'plot')
		{
			this.item = new PlotStimuli(JSON.parse(this.items[this.current].stimulus), this.current);
		}
	}

	draw(ctx)
	{
		if(this.item){
			this.item.draw(ctx);
		}
	}

	draw(ctx, item)
	{
		if(this.item){
			this.item.draw(ctx, item);
		}
	}


	onPracticeResponse(response)
	{
		var result = this.item.onPracticeResponse(response);
		return result;
	}

	onMouseMove(data)
	{
		if(this.type === 'img' || this.type === 'mpraxis' || this.type === 'mousetraininggame' || this.type === 'pcet')
		{
			return this.item.onMouseMove(data);
		}
		else
		{
			return false;
		}
	}

	onResponse(data, responses, qid, starttime)
	{
		var result = this.item.onResponse(data, responses, qid, starttime);
		return result;
	}

	canContinue()
	{
		return this.item.canContinue();
	}

	getFeedback(data)
	{
		var msg = this.item.getFeedback(data);

		return msg;
	}

	next()
	{
		let index = this._next();
		if(index > -1)
		{
			this.createItem();
		}
		return index;
	}
}
