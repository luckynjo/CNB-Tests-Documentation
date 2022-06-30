import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';
import {Randomizer} from '../utils/Randomizer.js';

/***

Handler for all CPF trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce cpf here stimuli/cpf/ with test.stimulus_folder.

*/

const SAME = 'same';
const DIFF = 'diff';
const TRUE_POSITIVE = 'tp';
const FALSE_POSITIVE = 'fp';
const TRUE_NEGATIVE = 'tn';
const FALSE_NEGATIVE = 'fn';
const DIGITS = ["dig1.png", "dig2.png", "dig3.png", "dig4.png", "dig5.png", "dig6.png", "dig7.png", "dig8.png", "dig9.png"];
export class DigsymMemoryTrials extends React.Component{

  constructor(props)
  {
    super(props);
    this.content = this.props.content;

    //const section_type = content[0];
    const trials = props.trials.filter(trial => trial.trial_section === "<memory>");
    const questions = Randomizer(trials, 1, true);
    const symbol = this.findImage(JSON.parse(trials[questions[0]].stimulus).symbol);
    const stimulus = symbol;
    this.state = {
      trial: 0,
      stimulus: stimulus,
      trials: trials,
      questions: questions,
      responses: [],
      trialTime: new Date()
    };
    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);


    this.digit_buttons = DIGITS.map((digit, index) => {
      return <img key={'digit' + index} className="digsym-memory-digit" src={this.findImage(digit)} onClick={(e) => this.onClick(e, index + 1)}/>
    });


  }

  onClick(evt, response)
  {

    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(this.state.trials[this.state.trial].question_number, response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.state.trials.length;

    // Continue task.
    if(next_trial < trial_count)
    {
      const questions = this.state.questions;
      const symbol = this.findImage(JSON.parse(this.state.trials[questions[next_trial]].stimulus).symbol);
      const stimulus = symbol;
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus, trialTime: new Date(), responses: responses};
      });
    }
    // Task completed.
    else
    {
      this.props.onTrialsComplete(responses);
    }
  }

  ///// Helper methods to retrieve images from cache or local storage so they don't have to be loaded from the network.
  findImage(image_url)
  {
    const clean_url = image_url;
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/digsym/" + clean_url;
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
    const assets = this.props.images || [];
    for(let i=0; i < assets.length; i++)
    {
      if((assets[i].url).includes(url))
      {
        file = assets[i].data;
        continue;
      }
    }
    return file || this.props.base_url + "stimuli/digsym/" + url;
  }

  render()
  {
    const stimulus = this.state.stimulus;

    return (
      <div className="container">

       <p className="digsym-memory-instructions">
       <span>
       {this.props.content[1]}
       </span>
       <br/>
       <span>
       {this.props.content[2]}
       </span>
       </p>

       <img className="digsym-memory-symbol" src={stimulus}/>

       <div className="digsym-memory-digit-container">
         {this.digit_buttons}
       </div>

      </div>
    );
  }
}
