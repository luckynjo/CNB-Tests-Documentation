import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';
import FeedbackPage from '../instructions/FeedbackPage.js';
import {ContinueButton} from '../components/ContinueButton.js';
import angry_emoji from '../assets/er40Child/anger_transparent.png';
import happy_emoji from '../assets/er40Child/happy_transparent.png';
import fear_emoji from '../assets/er40Child/fear_transparent.png';
import noe_emoji from '../assets/er40Child/Neutral_transparent.png';
import sad_emoji from '../assets/er40Child/sad_transparent.png';

/***

Handler for all CPF trials, regardless of form.
Takes in trials and test as react prop parameters.
TO DO: Reaplce cpf here stimuli/cpf/ with test.stimulus_folder.

*/

export class ER40ChildPracticeTrial extends React.Component{

  constructor(props)
  {
    super(props);
    const stimulus = this.findImage(this.props.trials[0].stimulus);
    this.state = {
      trial: 0,
      stimulus: stimulus,
      responses: [],
      trialTime: new Date(),
      correctFeedback: false,
      incorrectFeedback: false
    };
    // Method bindings
    this.responded = false;
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
    this.onPracticeResponse = this.onPracticeResponse.bind(this);
    this.updateCorrectFeedback = this.updateCorrectFeedback.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
    this.emoji_array = [happy_emoji, sad_emoji, angry_emoji, fear_emoji, noe_emoji];
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
    //this.responded = true;
    //const questions = this.state.questions;
    const index = this.state.index;
    const trial = this.props.trials[this.state.trial];
    if(trial.correct_response !== JSON.parse(trial.responses)[response-1])
    {
      //this.stop();
      //window.removeEventListener("keydown", this.keyDown, false);
      this.correct = 0;
      //this.props.onPracticeFeedback("Feedback_Incorrect");
      this.setState((prevState, props) => {
        return {feedback: this.props.feedback_incorrect, correctFeedback: false, incorrectFeedback: true};
      });
    }
    else {
      this.props.nextPractice(3);
      this.setState((prevState, props) => {
        return {feedback: this.props.feedback_correct, correctFeedback: true, incorrectFeedback: false};
      });
      this.nextTrial();
    }
  }

  nextTrial()
  {
    const next_trial = this.state.trial + 1;
    const trial_count = this.props.trials.length;

    // Continue task.
    if(next_trial < trial_count)
    {
      const stimulus = this.findImage(this.props.trials[next_trial].stimulus);
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus, trialTime: new Date()};
      });
      //this.props.nextPractice(3);
    }
    //Task completed.
    else
    {
      //this.props.onPracticeComplete();
      this.responded = true;
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

  updateCorrectFeedback(boolVal){
    if(this.responded){
      this.props.onPracticeComplete();
    }
    else{
      this.setState({
        correctFeedback: boolVal,
        incorrectFeedback: false
      });
    }
  }

  render()
  {
    const stimulus = this.state.stimulus;
    const feedback = this.state.feedback;
    const practiceInstruction = this.props.buttons[0];
    const buttons = this.props.buttons.map((item, index) => {
      const emotions = ["Happy", "Sad", "Angry", "Scared", "Neutral"];
      if(index > 0){
        return (<div className="button er40--response-button-child" key={index + 155} onClick={(e) => this.onPracticeResponse(e, index)}><img src={this.emoji_array[index-1]} height="80" width = "80" style={{marginLeft: "2px"}}/><p style={{ paddingLeft: "5px", marginTop: "22px", marginRight: "4px"}}>{emotions[index-1]}</p></div>)
      }
    })

    if(this.state.feedback && this.state.correctFeedback){
      return (
        <FeedbackPage instructions={this.state.feedback} updateCorrectFeedback={this.updateCorrectFeedback}/>
      );
    }

    return (
      <div className="container">



          <table className="er40--table">
            <tbody>
            <tr>
            <td colSpan={2}>
            <p className={"er40--feedback" + (this.state.feedback && this.state.incorrectFeedback ? " red" : "")}>{this.state.feedback && this.state.incorrectFeedback ? this.state.feedback : practiceInstruction}</p>
            </td>
            </tr>

              <tr>
                <td>
                  <div className="stimulus">
                    <div className="stimulus--container">
                      <div className="stimulus--er40">
                        <img src={stimulus} />
                        <br/>
                        {this.state.feedback == this.props.feedback_correct && this.responded === true && <ContinueButton text={this.props.continue_button_text} onClick={this.props.onPracticeComplete}/>}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                <div className="responses-4">
                  {(!(this.state.feedback == this.props.feedback_correct) || this.responded !== true) && buttons}
                </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

    );
  }
}
