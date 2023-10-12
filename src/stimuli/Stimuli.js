/***
* Base stimuli manager.
*
*/
export default class Stimuli
{

	constructor(items, randomize, sampleSize, n, terminate)
	{
		this.items = items || [];
		this.randomize = randomize || false;
		this.questions = [];
		this.current = 0;
		this.index = 0;
		this.N = n || 0;
		this.sampleSize = sampleSize || 1;
		this.terminate = terminate || {incorrect: -1, correct: -1};
		this.incorrect = 0;
		this.correct = 0;
		this._init();
  }

	setFeedback(feedback)
	{
		this.feedback = feedback;
	}

	_init()
	{
		this.questions = this.generateQuestionSampleArray(this.items.length, this.randomize);

		for(var j=1; j < this.sampleSize; j++)
		{
			let questionSample = this.generateQuestionSampleArray(this.items.length, this.randomize);
			this.questions = this.questions.concat(questionSample);
		}

		this.index = 0;
		this.current = this.questions[this.index];

		if(this.terminate.consecutive)
		{
			this.correct = 0;
			this.incorrect = 0;
		}
	}

	/***
	*
	* Generate a sample questions array for a given sample size n.
	* @param n sample size
	* @param randomize whether to randomize the generated sample block.
	*/
	generateQuestionSampleArray(n, randomize)
	{

		// Create an array of length n that holds the values 0,...,n-1
		let array = new Array(n);
		for(let i=0; i < n; i++)
		{
			array[i] = i;
		}

		if(randomize)
		{
			var currentIndex = array.length - 1, temporaryValue, randomIndex;
			// Randomize array elements
			while (currentIndex > -1)
			{
				// Pick a remaining element...
				randomIndex = Math.floor(Math.random() * currentIndex);

				// And swap it with the current element.
				temporaryValue = array[currentIndex];
				array[currentIndex] = array[randomIndex];
				array[randomIndex] = temporaryValue;

				currentIndex -= 1;
			}
		}

		return array;
	}

	reset()
	{
		this._init();
	}

	_current()
	{
		return this.current;
	}

	getIndex()
	{
		return this.index;
	}

	updateIncorrect(response)
	{
		if(this.terminate.incorrect > 0)
		{
			var i = this.getIndex();

			if(this.items[i].correct !== response)
			{
				this.incorrect += 1;
			}
		}
	}

	getRemainingIncorrect()
	{
		return {incorrect: this.terminate.incorrect - this.incorrect};
	}

	qid()
	{
		return this.current + this.N;
	}

	getFeedback(response)
	{
		let feedback = '';
		var i = this.getIndex();
		if(this.feedback)
		{
			if(this.items[i].correct === response)
			{
				if(this.feedback.correct)
				{
					feedback = this.feedback.correct;
				}
			}
			else
			{
				if(this.feedback.incorrect)
				{
					feedback = this.feedback.incorrect;
				}
			}
		}
		return feedback;
	}

	_next()
	{
		if(this.questions.length === 0)
		{
			return -1;
		}

		this.questions.splice(this.index, 1);
		if(this.questions.length === 0)
		{
			return -1;
		}
		else if(this.questions.length == 1)
		{
			var item = this.questions[0];
			this.index = 0;
			this.current = item;
			return item;
		}
		else
		{
			var item = this.questions[0];
			this.index = 0;
			this.current = item;
			return item;
		}
	}

	discontinueTest(response)
	{
		if(this.terminate.incorrect > 0)
		{
			this.updateIncorrect(response);
			return this.incorrect >= this.terminate.incorrect;
		}
		else if(this.terminate.correct > 0)
		{
			var i = this.getIndex();
			if(this.items[i].correct === response)
			{
				this.correct++;
			}
			// For pcet, we require consecutive correct responses
			else if(this.terminate.consecutive)
			{
				this.correct = 0;
			}
			return this.correct === this.terminate.correct;
		}
		 else
		{
			return false;
		}
	}

	getIndex()
	{
		return this._current();
	}

	hasNext()
	{
		return this.questions.length > 0;
	}

	next()
	{
		return this._next();
	}
}
