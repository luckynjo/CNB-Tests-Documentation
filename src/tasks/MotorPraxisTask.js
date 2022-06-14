import React from 'react';
import '../styles/motor_praxis.css';
import {MotorPraxisTrials} from '../trials/MotorPraxisTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import TitlePage from '../components/TitlePage.js';
import SubmitPage from '../components/SubmitPage.js';
import motor_praxis_banner from '../assets/motor_praxis/motor_praxis_banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

export default class MotorPraxisTask extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      index: 1,
			timeline: props.timeline,
			responses: [],
      assessment_complete: false,
      skipped: 0,
      starttime: new Date()
    };

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];
    this.responses = [];
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    document.body.classList.add('dark');
  }

  // Record practice responses, also override existing practice responses.
  onPracticeComplete(responses)
  {
    this.setState((prevState, props) => {
      return {responses: responses}
    }, this.next);
  }

  onComplete(responses)
  {
		let current_responses = this.state.responses;
    const updated_responses = current_responses.concat(responses);
		this.setState((prevState, props) => {
			return {responses: updated_responses}
		}, this.next);
  }

  next()
	{
    const current_index = this.state.index + 1;
    if(current_index < this.props.timeline.length)
    {
      this.setState((prevState, props) => {
        return {index: current_index}
      });
    }
    else
    {
      this.setState((prevState, props) => {
        return {assessment_complete: true};
      });
    }
  }

  hideGoBack()
  {
    const index = this.state.index;
    return index < 3;
  }

  back()
  {
    let current_index = this.state.index - 1;
    let found = false;

    if(current_index > -1){
      // Specifically for the back button shown after completing the practice.
      if(this.props.timeline[current_index].section_title.match(PRACTICE_REGEX))
      {
        current_index = current_index - 1;
      }

      this.setState((prevState, props) => {
        return {index: current_index}
      });
    }
  }

  render()
  {
    if(this.state.assessment_complete)
    {
      return  <SubmitPage test={this.props.test.test} skipped={this.state.skipped} starttime={this.state.starttime} responses={this.state.responses} />
    }
    const index = this.state.index;
		const timeline_object = this.props.timeline[index];
    const section_title = timeline_object.section_title;

    if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={motor_praxis_banner} onClick={this.next} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} {...this.props.test}/>
    }
		else if(section_title.match(INSTRUCTIONS_REGEX))
		{
			return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={this.hideGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
		}
		else if(section_title.match(BEGIN_PAGE_REGEX))
		{
			return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
		}
		else if(section_title.match(PRACTICE_REGEX))
		{
			return <MotorPraxisTrials trials={this.props.practice_trials} content={timeline_object.content} practice={true} onTrialsComplete={this.onPracticeComplete}/>
		}
		else if(section_title.match(TEST_REGEX))
		{
			return <MotorPraxisTrials trials={this.props.test_trials} content={timeline_object.content} onTrialsComplete={this.onComplete}/>
		}
		else
		{
			return <p>Error: Unknown object type {timeline_object.type} : {section_title} at {index}</p>
		}
  }
}
