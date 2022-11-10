import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';
import digsym_a_banner from '../assets/digsym/digsym_a_banner.png';
import digsym_b_banner from '../assets/digsym/digsym_b_banner.png';
import {Randomizer} from '../utils/Randomizer.js';
/***

Handler for all Digit Symbol matchinf trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce cpf here stimuli/cpf/ with test.stimulus_folder.
*/

// Constants used for recorind responses.
const SAME = 'same';
const DIFF = 'diff';
const TRUE_POSITIVE = 'tp';
const FALSE_POSITIVE = 'fp';
const TRUE_NEGATIVE = 'tn';
const FALSE_NEGATIVE = 'fn';

export class DigsymMatchingTrials extends React.Component{

  constructor(props)
  {
    super(props);

    const trials = props.trials.filter(trial => trial.trial_section === "<matching>");
    let qs = Randomizer(trials, props.practice ? 1 : 10, true);
    const questions = this.preventBackToBackSameTrials(trials, qs);
    const index = questions[0];
    const digit = this.findImage(JSON.parse(trials[index].stimulus).digit);
    const symbol = this.findImage(JSON.parse(trials[index].stimulus).symbol);
    const stimulus = {"is_match": JSON.parse(trials[index].stimulus).is_match === 1};

    this.state = {
      trial: 0,
      questions: questions,
      stimulus: stimulus,
      digit: digit,
      symbol: symbol,
      trials: trials,
      responses: [],
      trialTime: new Date(),
      timerStart: new Date(),
      completed_trial_count: 0
    };

    const content = this.props.content;
    const section_type = content[0];
    this.same_text = content[1];
    this.different_text = content[2];

    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
    this.duration = 0;
  }

  componentDidMount()
  {
    if(!this.props.practice)
    {
      this.start();
    }
  }

  // Digit symbol contains some duplicate trials for example questions 21 and 43 are the same [7, 7] so if randomly assigned one can get both back to back.
  // This code prevents that.
  preventBackToBackSameTrials(trials, questions)
  {
    let updated_trials = new Array(questions.length);

    for(let i=0; i < questions.length; i++)
    {
      let j = i + 1;
      let q1 = questions[i];
      let q2 = questions[j];
      let trial1 = trials[q1];
      let trial2 = trials[q2];

      // While the current trial is the same as the next one, swap trials around.
      while(j < questions.length - 2 && JSON.parse(trial1.stimulus).digit === JSON.parse(trial2.stimulus).digit && JSON.parse(trial1.stimulus).symbol === JSON.parse(trial2.stimulus).symbol)
      {
        // Swap questions.
        let tmp = questions[j + 1];
        questions[j + 1] = q2;
        questions[j] = tmp;
        q2 = questions[j];
        trial2 = trials[q2];
        j++;
      }
    }
    //console.log('Updated questions are ', questions.join(", "));
    return questions;
  }

  // Start test timer.
  start()
  {
    this.intervalid = setTimeout(() => {this.update();}, 512);
  }

  // Update test timer.
  update()
  {
    this.duration = this.duration + 512;
    if(this.duration >= 90000)
    {
      this.stop();
      this.props.onTrialsComplete(this.state.responses);
    }
    else
    {
      this.intervalid = setTimeout(() => {this.update();}, 512);
    }
  }

  // Stop test timer.
  stop()
  {
    clearTimeout(this.intervalid);
    this.intervalid = null;
  }

  componentWillUnmount()
  {
    if(!this.props.practice)
    {
      this.stop();
    }
  }

  onClick(evt, response)
  {
    const stimulus = this.state.stimulus;
    let recorded_response = "";
    if(stimulus.is_match)
    {
      recorded_response = (response === SAME) ? TRUE_POSITIVE : FALSE_NEGATIVE;
    }
    else
    {
      recorded_response = (response === SAME) ? FALSE_POSITIVE : TRUE_NEGATIVE;
    }
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    const trial = this.state.trial;
    const index = this.state.questions[trial];
    const question_number = this.state.trials[index].question_number;
    responses.push(new CNBResponse(question_number, recorded_response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.state.questions.length;
    let completed_trial_count = this.state.completed_trial_count + 1;

    // Continue task.
    if(next_trial < trial_count)
    {
      //const stimulus = this.findImage(this.state.trials[next_trial].stimulus);
      const index = this.state.questions[next_trial];
      const trial = this.state.trials[index];
      const digit = this.findImage(JSON.parse(trial.stimulus).digit);
      const symbol = this.findImage(JSON.parse(trial.stimulus).symbol);
      const stimulus = {"is_match": JSON.parse(trial.stimulus).is_match === 1};


      // Mark end of 55 trials completed.
      if(completed_trial_count >=55)
      {
        responses.push(new CNBResponse(55, "NEXT", ''));
        completed_trial_count = 0;
      }
      this.setState((prevState, props) => {
        return {trial: next_trial, digit: digit, symbol: symbol, stimulus: stimulus, trialTime: new Date(), responses: responses, completed_trial_count: completed_trial_count};
      });
    }
    // Task completed.
    else
    {
      if(this.props.practice)
      {
        this.props.onTrialsComplete(responses);
      }
      else
      {
        const index = this.state.questions[0];
        const trial = this.state.trials[index];
        const digit = this.findImage(JSON.parse(trial.stimulus).digit);
        const symbol = this.findImage(JSON.parse(trial.stimulus).symbol);
        const stimulus = {"is_match": JSON.parse(trial.stimulus).is_match === 1};

        // Mark end of 55 trials completed.
        if(completed_trial_count >=55)
        {
          responses.push(new CNBResponse(55, "NEXT", ''));
        }

        this.setState((prevState, props) => {
          return {trial: 0, stimulus: stimulus, digit: digit, symbol: symbol, rialTime: new Date(), responses: responses, completed_trial_count: 0};
        });
      }
    }
  }

  ///// Helper methods to retrieve images from cache or local storage so they don't have to be loaded from the network.
  findImage(image_url)
  {


    const clean_url = image_url;
    const stimuli_path = this.props.test_form === "b" ? "stimuli/digsym_b/" : "stimuli/digsym/";
    console.log("stimuli path: ", stimuli_path);
    
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + stimuli_path + clean_url;
  }

  findAssetFile(url)
  {
    let file = localStorage.getItem(url);
    if(!file)
    {
      file = this.findAssetFileInArray(url);
    }
    return file;
  }

  findAssetFileInArray(url)
  {
    let file = null;
    const stimuli_path = this.props.test_form === "b" ? "stimuli/digsym_b/" : "stimuli/digsym/";
    const assets = this.props.images || [];
    for(let i=0; i < assets.length; i++)
    {
      if((assets[i].url).includes(url))
      {
        file = assets[i].data;
        continue;
      }
    }
    return file || this.props.base_url + stimuli_path + url;
  }

  render()
  {
    const stimulus = this.state.stimulus;
    const banner = this.props.test_form === "a" ? digsym_a_banner : digsym_b_banner;

    return (
      <div className="container">

       <img className="digsym-trial-banner" src={banner} />

       <img className="digsym-stimulus-symbol" src={this.state.symbol} alt="..."/>
       <img className="digsym-stimulus-digit" src={this.state.digit} alt="..."/>

       <div className="digsym-response-buttons flex inline">
       <button className='button digsym-button' onClick={(e) => this.onClick(e, SAME)}>
        {this.props.same_text}
       </button>
       <button className='button digsym-button' onClick={(e) => this.onClick(e, DIFF)}>
        {this.props.different_text}
       </button>
       </div>

      </div>
    );
  }
}
