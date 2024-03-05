import React from 'react';
import '../styles/tap.css';
import {TapTrials} from '../trials/TapTrials.js';
import {TapTrialsWithCount} from '../trials/TapTrialsWithCount.js';
import {TapHandednessTrial} from '../trials/TapHandednessTrial.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {TapCountdownInstructions} from '../instructions/TapCountdownInstructions.js';
import {TapTestCountdownInstructions} from '../instructions/TapTestCountdownInstructions.js';
import {TAPHandPositionInstructions} from '../instructions/TAPHandPositionInstructions.js';
import SubmitPage from '../components/SubmitPage.js';
import motor_praxis_banner from '../assets/tap/banner.png';

const HAND_POSITION_DEMO_INSTRUCTIONS_REGEX = /Demo[_ ]Instructions/g;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const HANDEDNESS_REGEX = /Handedness/ig;
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const COUNTDOWN_REGEX = /Countdown/ig;
const FALSE_NEGATIVE_REGEX = /False[ _]Negative/ig;


export default class TAP extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      index: 1,
      practice_trial: 0,
      test_trial: 0,
      practice: false,
      responses: [],
      assessment_complete: false,
      skipped: 0,
      starttime: new Date()
    }

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0] || 'CLICK HERE TO CONTINUE';
    this.back_button_text = content[1] || 'GO BACK';
    this.spacebar_text = content[2] || 'Press the spacebar to continue';
    this.go_text = content[2] || "GO!";
    this.stop_text = content[3] || "STOP!";

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.skipListener = this.skipListener.bind(this);
    this.backToHandednessTrial = this.backToHandednessTrial.bind(this);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.skipListener, false);
  }

  /***
  * Handler for overral key presses.
  * Specifically checks for skip command.
  * TO DO: Add beep for invalid key presses.
  */
  skipListener(e)
  {
    // Check for skip command for cnb tests cmd . on mac or ctrl . on others.
    if((e.metaKey || e.ctrlKey) && e.keyCode === 190)
    {
      console.log("skip task", new Date());
      e.stopPropagation();
      this.skipTest();
    }
  }

  skipTest()
  {
    this.setState((prevState, props) => {
      return {assessment_complete: true, skipped: 1};
    });
  }

  backToHandednessTrial()
  {
    const next = this.state.index - 1;
    this.setState((prevState, props) => {
      return {index: next, test_trial: 0, responses: []};
    });
  }

  back()
  {
    let next = this.state.index - 1;
    if(next > 0)
    {
      const timeline_object = this.props.timeline[next + 1];
      const section_title = timeline_object.section_title;
      let restart_practice = false;
      let practice_trial = this.state.practice_trial;
      // The begin test page goes back to begin practice page.
      if(section_title.match(BEGIN_PAGE_REGEX) && section_title.match(TEST_REGEX))
      {
        next = next - 2;
        practice_trial = 0;
        restart_practice = true;
      }
      this.setState((prevState, props) => {
        return {index: next, practice_trial: practice_trial, practice: true};
      });
    }
  }

  next()
  {
    const next = this.state.index + 1;
    if(next >= this.props.timeline.length)
    {
      this.setState((prevState, props) => {
        return {assessment_complete: true};
      });
    }
    else
    {
      const timeline_object = this.props.timeline[next];
      const section_title = timeline_object.section_title;
      let practice = this.state.practice;
      if(section_title.match(PRACTICE_REGEX))
      {
        practice = true;
      }
      else if(section_title.match(TEST_REGEX))
      {
        practice = false;
      }

      this.setState((prevState, props) => {
        return {index: next, practice: practice};
      });
    }
  }

  onPracticeComplete()
  {
    const next_trial = this.state.practice_trial + 1;
    if(next_trial >= this.props.practice_trials.length)
    {
      this.next();
    }
    else
    {
      const go_to = this.state.index - 1;
      this.setState((prevState, props) => {
        return {index: go_to, practice_trial: next_trial, practice: true};
      });
    }
  }

  onTrialsComplete(responses)
  {
    const next_trial = this.state.test_trial + 1;
    const updated_responses = this.state.responses.concat(responses);
    //console.log('Task completed with responses ', updated_responses);
    const go_to = this.state.index - 1;
    if(this.state.test_trial === 0)
    {
      this.setState((prevState, props) => {
        return {responses: responses, test_trial: next_trial}
      }, this.next)
    }
    else if(next_trial < this.props.test_trials.length)
    {
      this.setState((prevState, props) => {
        return {responses: updated_responses, test_trial: next_trial, index: go_to}
      });
    }
    else
    {
      this.setState((prevState, props) => {
        return {responses: updated_responses, assessment_complete: true}
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
      return <TitlePage banner={motor_praxis_banner} content={JSON.parse(timeline_object.content)} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(HANDEDNESS_REGEX))
    {
      return <TapHandednessTrial instructions={JSON.parse(timeline_object.content)} onTrialsComplete={this.onTrialsComplete}/>
    }
    else if(section_title.match(HAND_POSITION_DEMO_INSTRUCTIONS_REGEX))
    {
      return <TAPHandPositionInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.backToHandednessTrial} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(COUNTDOWN_REGEX) && this.state.practice)
    {

      return <TapCountdownInstructions practice={this.state.practice} spacebar_text={this.spacebar_text} instructions={JSON.parse(timeline_object.content)} trial={this.state.practice ? this.state.practice_trial + 1 : this.state.test_trial} handedness={this.state.practice ? this.props.practice_trials[this.state.practice_trial].stimulus : this.props.test_trials[this.state.test_trial].stimulus} onContinue={this.next}/>
    }
    else if(section_title.match(COUNTDOWN_REGEX))
    {
      return <TapTestCountdownInstructions spacebar_text={this.spacebar_text} instructions={JSON.parse(timeline_object.content)} trial={this.state.practice ? this.state.practice_trial + 1 : this.state.test_trial} handedness={this.state.practice ? this.props.practice_trials[this.state.practice_trial].stimulus : this.props.test_trials[this.state.test_trial].stimulus} onContinue={this.next}/>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      if(this.props.version && this.props.version === "3.00"){
        return <TapTrialsWithCount key={10 + this.state.practice_trial + 1} trials={this.props.practice_trials} practice={true}  index={this.state.practice_trial} goText={JSON.parse(timeline_object.content)[0]} stopText={JSON.parse(timeline_object.content)[1]} onPracticeComplete={this.onPracticeComplete}/>
      } else {
        return <TapTrials key={10 + this.state.practice_trial + 1} trials={this.props.practice_trials} practice={true}  index={this.state.practice_trial} goText={JSON.parse(timeline_object.content)[0]} stopText={JSON.parse(timeline_object.content)[1]} onPracticeComplete={this.onPracticeComplete}/>
      }
    }
    else if(section_title.match(TEST_REGEX))
    {
      if(this.props.version && this.props.version === "3.00"){
        return <TapTrialsWithCount key={10 + this.state.test_trial + 1} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete} index={this.state.test_trial} goText={JSON.parse(timeline_object.content)[0]} stopText={JSON.parse(timeline_object.content)[1]}/>
      } else {
        return <TapTrials key={10 + this.state.test_trial + 1} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete} index={this.state.test_trial} goText={JSON.parse(timeline_object.content)[0]} stopText={JSON.parse(timeline_object.content)[1]}/>
      }
    }
    else
    {
      return <div className="container center">Error: Unkown CPT section {section_title} in part {this.state.index}</div>
    }
  }
}
