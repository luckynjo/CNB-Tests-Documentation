import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';
import {ContinueButton} from '../components/ContinueButton.js';

/***

Handler for all CPF trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce cpf here stimuli/cpf/ with test.stimulus_folder.

*/
export class ER40PracticeTrial extends React.Component{

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
    this.responded = false;
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
    this.correct = 0;
    this.incorrect = 0;
  }

  onClick(evt, response)
  {
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(this.state.trial + 1, response, duration));
    this.nextTrial(responses);
  }

  onPracticeResponse(e, response)
  {
    this.responded = true;
    //const questions = this.state.questions;
    const index = this.state.index;
    const trial = this.props.trials[this.state.trial];
    if(3 !== response)
    {
      //this.stop();
      //window.removeEventListener("keydown", this.keyDown, false);
      this.correct = 0;
      //this.props.onPracticeFeedback("Feedback_Incorrect");
      this.setState((prevState, props) => {
        return {feedback: this.props.feedback_incorrect};
      });
    }
    else {
      this.setState((prevState, props) => {
        return {feedback: this.props.feedback_correct};
      });
    }
  }

  // nextTrial(responses)
  // {
  //   const next_trial = this.state.trial + 1;
  //   const trial_count = this.props.trials.length;
  //
  //   // Continue task.
  //   if(next_trial < trial_count)
  //   {
  //     const stimulus = this.findImage(this.props.trials[next_trial].stimulus);
  //     this.setState((prevState, props) => {
  //       return {trial: next_trial, stimulus: stimulus, trialTime: new Date(), responses: responses};
  //     });
  //   }
  //   // Task completed.
  //   else
  //   {
  //     this.props.onTrialsComplete(responses);
  //   }
  // }

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
    const feedback = this.state.feedback;
    const practiceInstruction = this.props.buttons[0];
    const buttons = this.props.buttons.map((item, index) => {
      if(index > 0){
        return (<button className="button er40--response-button" key={index + 155} onClick={(e) => this.onPracticeResponse(e, index)}>{item}</button>)
      }
    })

    return (
      <div className="container">



          <table className="er40--table">
            <tbody>
            <tr>
            <td colSpan={2}>
            <p className="er40--feedback">{this.state.feedback ? this.state.feedback : practiceInstruction}</p>
            </td>
            </tr>

              <tr>
                <td>
                  <div className="stimulus">
                    <div className="stimulus--container">
                      <div className="stimulus--er40">
                        <img src={stimulus} />
                        <br/>
                        {this.state.feedback == this.props.feedback_correct && <ContinueButton text={this.props.continue_button_text} onClick={this.props.onPracticeComplete}/>}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                <div className="responses">
                  {!(this.state.feedback == this.props.feedback_correct) && buttons}
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    );
  }
}
