import React, { useState, useEffect } from 'react';
import CNBResponse from './CNBResponse.js';

export class PLLTTrials extends React.Component{
  constructor(props)
	{
		super(props);
    const trial = props.trial;
    const stimulus = props.trials[trial];
    this.state = {
      responseCount: 0,
      responses: [],
      trial: trial,
      stimulus: stimulus
    }
    this.renderResponses = this.renderResponses.bind(this);
	}

  onResponse(evt, data)
  {
    console.log('Response ', data);
    console.log("State: ", this.state.responses);
    let responses = this.state.responses;
    const qid = this.state.stimulus.question_number;
    const count = this.state.responseCount + 1;
    //console.log('Response count ', count);
    let trial_completed = false;

    if(data === "OTHER")
    {
      // Add number of taps
      responses.push(new CNBResponse(qid, "OTHER", ""));
    }
    else if(data === "NEXT")
    {
      // Add number of taps
      responses.push(new CNBResponse(qid, "NEXT", ""));
      trial_completed = true;
    }
    else
    {
      const response = data.replace(/\*/g, "").replace(/ /g, "");;
      responses.push(new CNBResponse(qid, response, ""));
    }

    if(count >= 25 && data !== "NEXT")
    {
      responses.push(new CNBResponse(qid, "NEXT", ""));
      trial_completed = true;
    }

    if(trial_completed)
    {
      this.props.onTrialsComplete(responses);
    }
    else
    {
      this.setState((prevState, props) => {return {responseCount: count, responses: responses}});
    }
  }

  nextTrial()
  {
    const next_trial = this.state.trial + 1;
    if(next_trial < this.props.trials.length)
    {
      const stimulus = this.props.trials[next_trial];
      this.setState((prevState, props) => {
        return {trial: next_trial, stimulus: stimulus}
      });
    }
    else
    {
      this.onTrialsComplete(this.state.responses);
    }
  }

  renderResponses(responseIndex)
  {
    const all_responses = [this.props.words.slice(0, this.props.words.length/2), this.props.words.slice(this.props.words.length/2)];
    const responses = all_responses[responseIndex];
    const count = responses.length;
    const wordsLeft = responses && responses.slice(0, count/2) || [];
    const wordsRight = responses && responses.slice(count/2) || [];
    const response_values = JSON.parse(this.state.stimulus.stimulus);
    const responsesLeft = response_values.slice(0, count/2) || [];
    const responsesRight = response_values.slice(count/2) || [];
    const className = ' ';
    let active = false;
    let activeCount = active ? active.length : -1;

    let activeClass = function(word){
      return activeCount > -1 && active.indexOf(word) > -1 ? " active" : "";
    }

    //const additionalResponses = this.props.responses.additional;
    const other_button_text = this.props.other_button_text;
    const next_trial_button_text = this.props.next_trial_button_text;

    const words = wordsLeft.map((word, index) =>
    <tr key={index}>
    <td>
    <button style={this.props.form && this.props.form === "c" && this.props.language === "de_DE" ? {fontSize:"14px"} : {}} className={"pllt-response-button " + activeClass(wordsLeft[index])} onClick={(e) => this.onResponse(e, wordsLeft[index].trim())}>{"** " + wordsLeft[index] + " **"}</button>
    </td>
    <td>
    <button style={this.props.form && this.props.form === "c" && this.props.language === "de_DE" ? {fontSize:"14px"} : {}} className={"pllt-response-button " + activeClass(wordsRight[index])} onClick={(e) => this.onResponse(e, wordsRight[index].trim())}>{"** " + wordsRight[index] + " **"}</button>
    </td>
    {index === 0 &&
      (
        <td rowSpan={4}>
        <button className={"pllt-response-button" + " wide"} onClick={(e) => this.onResponse(e, responseIndex === 0 ? "OTHER" : "NEXT")}>
        {responseIndex === 0 ? (other_button_text || 'OTHER') : (next_trial_button_text || 'NEXT')}
        </button>
        </td>
      )
    }
    </tr>)
    return words;

  }

  render()
  {
    const responsesTop = this.renderResponses(0);
    const responsesBottom = this.renderResponses(1);

    return(
      <div className={"instructions center"}>

      <table className="responses-top center--horizontal">
       <tbody>
       {responsesTop}
       </tbody>
      </table>
      <table className="response-messages">
      <tbody>
      <tr>

      <td></td>
      <td></td>
      <td><p className="response-message text--center">{this.props.total_responses_text}</p></td>
      </tr>
      <tr>
      <td></td>
      <td></td>
      <td><p className="response-message-count text--center">{this.state.responseCount > 0 && this.state.responseCount}</p></td>
      </tr>
      </tbody>
      </table>
      <br/>
      <table className="responses-bottom center--horizontal">
       <tbody>
       {responsesBottom}
       </tbody>
      </table>
      </div>
    );
  }
}
