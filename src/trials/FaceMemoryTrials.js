import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';

/***

Handler for all CPF trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce cpf here stimuli/cpf/ with test.stimulus_folder.

*/
export class FaceMemoryTrials extends React.Component{

  constructor(props)
  {
    super(props);
    const stimulus = this.findImage(this.props.trials[0].stimulus);
    this.state = {
      trial: 0,
      stimulus: stimulus,
      responses: [],
      trialTime: new Date()
    };
    // Method bindings
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
  }

  onClick(evt, response)
  {
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(this.state.trial + 1, response, duration));
    this.nextTrial(responses);
  }

  nextTrial(responses)
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;
    //console.log('Next trial be ', next_trial);
    // Continue task.
    if(next_trial < trial_count)
    {
      const stimulus = this.findImage(this.props.trials[next_trial].stimulus);
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
    else return this.props.base_url + "stimuli/cpf/" + clean_url;
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
    return file || this.props.base_url + "stimuli/cpf/" + url;
  }

  render()
  {
    const stimulus = this.state.stimulus;
    const buttons = this.props.buttons.map((item, index) => {
      return (<button className="button cpf-test-button" key={index + 155} onClick={(e) => this.onClick(e, index + 1)}>{item}</button>)
    })

    return (
      <div className="container">

      <div className="stimulus--cpw center">
       <img className="slideshow-image" src={stimulus} />
      </div>

      <div className='cpf-inline cpf-buttons--test'>
      {buttons}
      </div>

      </div>
    );
  }
}
