import Line from '../components/Line.js';
import CNBResponse from '../trials/CNBResponse.js';

export default class PlotStimuli
{

	constructor(lines, index)
	{
		this.lines = [new Line(lines[0]), new Line(lines[1])];
		this.showExtension = false;
		this.index = index;
		this.feedback = [3, 4, 5];
	}

	draw(ctx)
	{
		if(this.lines[1].parallelTo(this.lines[0]) && this.showExtension)
		{
			this.lines[0].showExtension = true;
			this.lines[1].showExtension = true;
		}
		else
		{
			this.lines[0].showExtension = false;
			this.lines[1].showExtension = false;
		}

		this.lines.forEach((line) => line.draw(ctx));
	}

	getMoves()
	{
		return this.lines[1].getMoves();
	}

	onPracticeResponse(data)
	{
		var responded = this.lines[1].onResponse(data);
		var feedback = this.getFeedback(data);
		this.showExtension = true;
		var next = data === 'FINISHED' && this.canContinue();
		return {responded: responded, feedback: feedback, next: next};
	}

	onResponse(data, responses, qid, starttime)
	{
		var result = {responses: responses, next: false};
		if(data === 'FINISHED')
		{
			if(this.responded)
			{
				let moves = this.lines[1].getMoves();
				if(moves.length > 0)
				{
					responses.push(new CNBResponse(qid, moves, null));
				}
				let duration = (new Date()) - starttime;
				responses.push(new CNBResponse(qid, "FINISHED", duration));
				result.next = true;
				result.responses = responses;
			}
		}
		else
		{
			this.responded = true;
			var response = this.lines[1].onResponse(data);
			if(response && response.length > 0)
			{
				responses.push(new CNBResponse(qid, response, null));
				result.responses = responses;
			}
		}
		return result;
	}

	parallel()
	{
		return this.lines[1].parallelTo(this.lines[0]);
	}

	canContinue()
	{
		return this.parallel();
	}

	getFeedback(data)
	{
		var msg = -1;
		if(this.lines[1].parallelTo(this.lines[0]))
		{
			this.lines[0].showExtension = true;
			this.lines[1].showExtension = true;
		}
		else
		{
			this.lines[0].showExtension = false;
			this.lines[1].showExtension = false;
		}

		if(data === 'FINISHED')
		{
			if(this.lines[1].parallelTo(this.lines[0]))
			{
				msg = this.feedback[this.index];
			}
			else
			{
				msg = this.lines[1].directionToParallel(this.lines[0]);
				//msg = -1;
			}
		}
		else
		{
			if(this.lines[1].parallelTo(this.lines[0]) && this.index === 0)
			{
				msg = 0;
			}
		}
		return msg;
	}
}
