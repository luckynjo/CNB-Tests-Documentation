import React from 'react';
import CNBResponse from './CNBResponse.js';

export class PCETTestTrials extends React.Component {
  constructor(props){
    super(props);
    const index = 0;
    this.getTrialsFromSection = this.getTrialsFromSection.bind(this);

    this.state={
      index: index,
      trials: props.trials,
      current_question_number: JSON.parse(props.trials[0].question_number),
      current_trial: JSON.parse(props.trials[0].responses),
      current_correct_response: JSON.parse(props.trials[0].correct_response),
      current_section: 1,
      trialTime: new Date(),
      responses: [],
      trials_section_1: this.getTrialsFromSection(props.trials, 1),
      trials_section_2: this.getTrialsFromSection(props.trials, 2),
      trials_section_3: this.getTrialsFromSection(props.trials, 3),
      previous_correct: true,
      correct_response_cnt: 0,
      trial_num: 0,
      show_crosshair: false,
      feedback: null,
      total_trial_cnt: 48
    };

    this.findAssetFile = this.findAssetFile.bind(this);
    this.findAssetFileInArray = this.findAssetFileInArray.bind(this);
    this.onClick = this.onClick.bind(this);
    this.findImage = this.findImage.bind(this);
    this.isConsecutiveTenCorrect = this.isConsecutiveTenCorrect.bind(this);
    //this.renderCrossHair = this.renderCrossHair.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.resetCrossHair = this.resetCrossHair.bind(this);
  }

  // componentDidMount(){
  //   this.setState({
  //     trials_section_1: this.getTrialsFromSection(this.state.trials, 1),
  //     trials_section_2: this.getTrialsFromSection(this.state.trials, 2),
  //     trials_section_3: this.getTrialsFromSection(this.state.trials, 3)
  //   });
  // }

  getTrialsFromSection(allTrials, section){
    const trialsInSection = [];
    for(let i = 0; i<=allTrials.length-1; i++){
      if(allTrials[i].trial_section == section){
        trialsInSection.push(allTrials[i]);
      }
    }
    return trialsInSection;
  }


  onClick(evt, response)
  {
    //console.log("response: ", response);
    let responses = this.state.responses;
    const duration = (new Date()) - this.state.trialTime;
    responses.push(new CNBResponse(this.state.current_question_number, JSON.stringify(response.response), duration));
    if(this.checkAnswer(JSON.stringify(response.response))){
      this.setState({
        feedback: this.props.feedback_correct,
        show_crosshair: true
      });
      //setTimeout(this.resetCrossHair, 1000);
    } else {
      this.setState({
        feedback: this.props.feedback_incorrect,
        show_crosshair: true
      });
      //setTimeout(this.resetCrossHair, 1000);
    };
    setTimeout(()=> {
      this.setState({
        feedback: null,
        show_crosshair: false
      });
    }, 1000);
    this.nextTrial(responses, JSON.stringify(response.response));
  }


  nextTrial(responses, answer)
  {
    let next_trial_num = this.state.trial_num+1;
    let trial_count = this.state.trials.length;
    let next_current_section = this.state.current_section;
    let next_trials = this.state.trials;
    let previous_correct = this.state.previous_correct;
    let next_trial = this.state.trials[next_trial_num];
    let total_trial_cnt = this.state.total_trial_cnt;
    let next_question_number = next_trial.question_number;
    let correct_response_cnt = this.state.correct_response_cnt;

    if(answer == this.state.current_correct_response){
      previous_correct = true;
      correct_response_cnt++;
    } else {
      previous_correct = false;
      correct_response_cnt = 0;
    }

    if(this.state.current_question_number == 48 && this.state.current_section == 2){
      this.props.onTrialsComplete(responses);
      return;
    }

    if(this.isConsecutiveTenCorrect(answer)){
      next_trial_num = 0;
      next_current_section++;
      if(this.state.current_section == 1){
        next_trials = this.state.trials_section_2;
      } else if(this.state.current_section == 2){
        next_trials = this.state.trials_section_3;
      } else if(this.state.current_section == 3){
        this.props.onTrialsComplete(responses);
        return;
      }
      if(next_current_section == 2 || next_current_section == 3){
        total_trial_cnt = next_trials.length;
      }
      next_trial = next_trials[next_trial_num];
      next_question_number = next_trial.question_number;
    }

    // Continue task.
    if(next_trial_num < total_trial_cnt)
    {
      //const stimulus = this.findImage(this.props.trials[next_trial].stimulus);
      //console.log("next_trial: ", next_trial);
      this.setState((prevState, props) => {
        return {
          current_trial: JSON.parse(next_trial.responses),
          trialTime: new Date(),
          trials: next_trials,
          responses: responses,
          trial_num: next_trial_num,
          current_section: next_current_section,
          total_trial_cnt: total_trial_cnt,
          current_correct_response: JSON.parse(next_trial.correct_response),
          previous_correct: previous_correct,
          current_question_number: next_question_number,
          correct_response_cnt: correct_response_cnt
        };
      });
    }
    // Task completed.
    else
    {
      this.props.onTrialsComplete(responses);
    }
  }


  isConsecutiveTenCorrect(answer){
    //return this.state.previous_correct && answer == this.state.current_correct_response && this.state.trial_num == 9;
    return this.state.previous_correct && answer == this.state.current_correct_response && this.state.correct_response_cnt == 9;
  }


  resetCrossHair(){
    this.setState({
      show_crosshair: false,
      feedback: null
    })
  }


  checkAnswer(answer){
    return answer == this.state.current_correct_response;
  }

  // renderCrossHair(){
  //
  //   return(
  //     <div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
  //       <h2>{this.state.feedback}</h2>
  //     </div>
  //   )
  // }


  findImage(image_url)
  {
    const clean_url = JSON.parse(image_url);
    if(this.props.images)
    {
      return this.findAssetFile(clean_url);
    }
    else return this.props.base_url + "stimuli/pcet/" + clean_url;
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
    return file || this.props.base_url + "stimuli/pcet/" + url;
  }

  render(){
    console.log(this.state);
    const firstStimuli = this.findImage(JSON.stringify(this.state.current_trial[0].img));
    const secondStimuli = this.findImage(JSON.stringify(this.state.current_trial[1].img));
    const thirdStimuli = this.findImage(JSON.stringify(this.state.current_trial[2].img));
    const fourthStimuli = this.findImage(JSON.stringify(this.state.current_trial[3].img));
    // let renderedComponent;
    // if(this.state.showCrossHair){
    //   renderedComponent = (<div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
    //     <h2>{this.state.feedback}</h2>
    //   </div>);
    // } else {
    //   renderedComponent = (
    //     <div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
    //       <div style={{display: "flex", width: "800px", flexDirection: "row", justifyContent: "space-around"}}>
    //       <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[0].classList} src={firstStimuli} style={{ cursor: "pointer" }} onClick={(e) => this.onClick(e, this.state.current_trial[0])}/></div>
    //       <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[1].classList} src={secondStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[1])}/></div>
    //       <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[2].classList} src={thirdStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[2])}/></div>
    //       <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[3].classList} src={fourthStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[3])}/></div>
    //       </div>
    //       <p className="position-bottom--absolute text--center">{this.props.trialsText}</p>
    //     </div>
    //   )
    // }

    return (
      <div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
        {this.state.show_crosshair
          ? (<div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
            <p className="text--center" style={{ fontSize: "28px" }}>{this.state.feedback}</p>
          </div>)
          : (<div style={{display: "flex", width: "800px", height: "600px", alignItems: "center", justifyContent: "center"}}>
            <div style={{display: "flex", width: "800px", flexDirection: "row", justifyContent: "space-around"}}>
            <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[0].classList} src={firstStimuli} style={{ cursor: "pointer" }} onClick={(e) => this.onClick(e, this.state.current_trial[0])}/></div>
            <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[1].classList} src={secondStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[1])}/></div>
            <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[2].classList} src={thirdStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[2])}/></div>
            <div style={{display: "flex", alignItems: "end"}}><img className={this.state.current_trial[3].classList} src={fourthStimuli} style={{ cursor: "pointer" }} onClick={(e)=> this.onClick(e, this.state.current_trial[3])}/></div>
            </div>
            <p className="position-bottom--absolute text--center">{this.props.trialsText}</p>
          </div>)
        }
      </div>
    );
  }

}
