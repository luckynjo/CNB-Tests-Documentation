import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';
import {Randomizer} from '../utils/Randomizer.js';
import angry_emoji from '../assets/er40Child/anger_transparent.png';
import happy_emoji from '../assets/er40Child/happy_transparent.png';
import fear_emoji from '../assets/er40Child/fear_transparent.png';
import noe_emoji from '../assets/er40Child/Neutral_transparent.png';
import sad_emoji from '../assets/er40Child/sad_transparent.png';

/***

Handler for all ER40 trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce er40 here stimuli/er40/ with test.stimulus_folder.

*/
export class ER40ChildTrials extends React.Component{

  constructor(props)
  {
    super(props);
    const trials = props.trials;
    const questions = Randomizer(trials, 1, true);
    const stimulus = this.findImage(this.props.trials[questions[0]].stimulus);
    this.state = {
      trial: 0,
      questions: questions,
      stimulus: stimulus,
      responses: [],
      trialTime: new Date()
    };
    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);
    this.emoji_array = [happy_emoji, sad_emoji, angry_emoji, fear_emoji, noe_emoji];

  }

  onClick(evt, response)
  {
    const trial = this.state.trial;
    const questions = this.state.questions;
    const question = this.props.trials[questions[trial]];
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(question.question_number, response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;

    // Continue task.
    if(next_trial < trial_count)
    {
      const questions = this.state.questions;
      const stimulus = this.findImage(this.props.trials[questions[next_trial]].stimulus);
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
    const clean_url = JSON.parse(image_url);
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/er40_preschool/" + clean_url;
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
    return file || this.props.base_url + "stimuli/er40_preschool/" + url;
  }

  render()
  {
    const stimulus = this.state.stimulus;
    const buttons = this.props.buttons.map((item, index) => {
      const emotions = ["Happy", "Sad", "Angry", "Scared", "Neutral"];
      return (<div className="button er40--response-button-child" key={index + 155} onTouchEnd={(e) => this.onClick(e, index+1)}><img src={this.emoji_array[index]} height="80" width = "80" style={{marginLeft: "2px"}}/><p style={{ paddingLeft: "5px", marginTop: "22px", marginRight: "4px"}}>{emotions[index]}</p></div>)
    })

    return (
      <div className="page center">
        <table className="er40--table">
          <tbody>
            <tr>
              <td>
                <div className="stimulus">
                  <div className="stimulus--container">
                    <div className="stimulus--er40">
                      <img src={stimulus} />
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div className="responses-child">
                  {buttons}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
