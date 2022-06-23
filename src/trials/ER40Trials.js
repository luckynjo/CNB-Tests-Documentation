import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';

/***

Handler for all ER40 trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce er40 here stimuli/er40/ with test.stimulus_folder.

*/
export class ER40Trials extends React.Component{

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
    this.nextTrial = this.nextTrial.bind(this);
    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);

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
    else return this.props.base_url + "stimuli/er40/" + clean_url;
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
    return file || this.props.base_url + "stimuli/er40/" + url;
  }

  render()
  {
    const stimulus = this.state.stimulus;
    const buttons = this.props.buttons.map((item, index) => {
      return (<button className="button er40--response-button" key={index + 155} onClick={(e) => this.onClick(e, index + 1)}>{item}</button>)
    })

    return (
      <div className="page test">
        <table className="er40--table">
          <tbody>
            <tr>
              <td colspan="2">
                <div>
                  <p></p>
                </div>
              </td>
            </tr>
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
                <div className="responses">
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
