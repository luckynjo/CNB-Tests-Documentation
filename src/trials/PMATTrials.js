import React from 'react';
import CNBResponse from './CNBResponse.js';

export class PMATTrials extends React.Component {
  constructor(props){
    super(props);
    this.findImage = this.findImage.bind(this);
    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);
    this.getButtons = this.getButtons.bind(this);

    const current_trial = props.trials[0];
    const current_classList = JSON.parse(current_trial.responses)[0].classList;
    const current_stimulus = this.findImage(current_trial.stimulus);
    const current_correct_response = JSON.parse(current_trial.correct_response);
    const current_buttons = this.getButtons(JSON.parse(current_trial.responses));

    this.state = {
      index: 0,
      current_trial: current_trial,
      buttons: current_buttons,
      feedback: null,
      startTime: new Date(),
      correct_response: current_correct_response,
      feedback_correct: props.feedback_correct,
      feedback_incorrect: props.feedback_incorrect,
      responses: [],
      stimulus: current_stimulus,
      classList: current_classList,
      consecutive_wrong: 0
    };

    this.onClickPractice = this.onClickPractice.bind(this);
    this.onClickTest = this.onClickTest.bind(this);
    this.nextTrial = this.nextTrial.bind(this);
  }

  onClickTest(evt, response)
  {
    const correct_response = this.state.correct_response;
    const responses = this.state.responses;
    const duration = (new Date()) - this.state.startTime;
    let consecutive_wrong = this.state.consecutive_wrong;
    const question_number = this.state.current_trial.question_number;
    responses.push(new CNBResponse(question_number, response, duration));
    if(response == correct_response){
      consecutive_wrong = 0;
    } else {
      consecutive_wrong++;
    }
    this.setState({
      consecutive_wrong: consecutive_wrong
    });
    this.nextTrial(responses);
  }


  onClickPractice(evt, response)
  {
    const correct_response = this.state.correct_response;
    if(response == correct_response){
      this.setState({
        feedback: this.props.feedback_correct
      });
      this.nextTrial([]);
    } else {
      this.setState({
        feedback: this.props.feedback_incorrect
      });
    }
  }


  nextTrial(responses)
  {
    const next_index = this.state.index + 1;
    const trial_count = this.props.trials.length;

    // Continue task
    if(next_index < trial_count){
      const next_trial = this.props.trials[next_index];
      const next_correct_response = JSON.parse(next_trial.correct_response);
      const next_stimulus = this.findImage(next_trial.stimulus);
      const next_buttons = this.getButtons(JSON.parse(next_trial.responses));
      const next_classList = JSON.parse(next_trial.responses)[0].classList;

      if(this.props.section === "test" && this.state.consecutive_wrong >= 4){
        this.props.onTrialsComplete(responses);
        return;
      }

      this.setState((prevState, props) => {
        return {
          index: next_index,
          current_trial: next_trial,
          stimulus: next_stimulus,
          correct_response: next_correct_response,
          startTime: new Date(),
          responses: responses,
          buttons: next_buttons,
          classList: next_classList
        };
      });
    } else {
      if(this.props.section === "practice"){
        this.props.onTrialsComplete();
      } else {
        this.props.onTrialsComplete(responses);
      }
    }
  }


  getButtons(list)
  {
    let buttons = [];
    const classList = this.props.section === "test" ? "pmat-button" : list[0].classList;
    let i = 0;
    for(let index in list){
      let response = list[index];
      const img = this.findImage(JSON.stringify(response.img));
      const answer = response.response;
      buttons.push(<div className={`button ${classList}`} key={i+120} onClick={this.props.section === "test" ? (e) => this.onClickTest(e, answer) : (e) => this.onClickPractice(e, answer)}><img src={img} alt="Response button"/></div>);
      i++;
    }
    return buttons;
  }


  findImage(image_url)
  {
    const clean_url = JSON.parse(image_url);
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/pmat/" + clean_url;
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
    return file || this.props.base_url + "stimuli/pmat/" + url;
  }


  render(){
    const buttons = this.state.buttons;
    return (<div className="page">
      {this.props.section === "practice" &&  (<div className="feedback"><p>{this.state.feedback}</p></div>)}
      <img src={this.state.stimulus} alt="PMAT stimulus"/>
      <div className={`pmat--responses center--horizontal ${this.state.classList}`}>
        {buttons}
      </div>
    </div>);
  }
}
