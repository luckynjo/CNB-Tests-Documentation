export function Randomizer(questions, sample_size, randomize)
{
  //const {questions, sample_size, randomize} = {content};
  console.log('Given trials ', questions, ' sample size ', sample_size, ' and randomization ', randomize);
  let sampled_questions = randomize_questions(questions.length, randomize);

  for(var j=1; j < sample_size; j++)
  {
    let question_sample = randomize_questions(questions.length, randomize);
    sampled_questions = sampled_questions.concat(question_sample);
  }
  console.log('randomzed questions are ', sampled_questions);
  return sampled_questions;
}

/***
*
* Generate a sample questions array for a given sample size n.
* @param n sample size
* @param randomize whether to randomize the generated sample block.
*/
function randomize_questions(n, randomize)
{
  // Create an array of length n that holds the values 0,...,n-1
  let array = new Array(n);
  for(let i=0; i < n; i++)
  {
    array[i] = i;
  }

  if(randomize)
  {
    let currentIndex = array.length - 1, temporaryValue, randomIndex;
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
