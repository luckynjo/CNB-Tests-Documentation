import {Randomizer} from '../utils/Randomizer.js';


const w = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const y = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 29, 40, 41, 42, 43, 44, 45];
const z = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 29, 40, 41, 42, 43, 44, 45, 46];
// using nodejs's build in asserts that throw on failure
var assert = require('assert')

exports['test that stops execution on first failure'] = function() {
  const randomized_w1 = Randomizer(w, 1, true);
  const randomized_w2 = Randomizer(w, 2, true);
  const randomized_w3 = Randomizer(w, 3, true);
  for(i=0; i < randomized_w1.length; i++)
  {
    assert.equal(count(randomized_w1, randomized_w1[i]), 1, 'assert fails and test execution stop here')
  }
  //assert.equal(2 + 2, 5, 'assert fails and test execution stop here')
  //assert.equal(3 + 2, 5, 'will never pass this since test failed above')
}

function count(a, k)
{
  let count = 0;
  for(i=0; i < a.length; i++)
  {
    if(a[i] === k)
    {
      count++;
    }
  }
  return count;
}

if (module == require.main) require('test').run(exports)
