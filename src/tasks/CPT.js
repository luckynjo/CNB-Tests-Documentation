import React from 'react';
import '../styles/cpt.css';
import {CPTTrials} from '../trials/CPTTrials.js';
import {SimpleKeyboardInstructions} from '../instructions/SimpleKeyboardInstructions.js';
import AssetLoader from '../loaders/AssetLoader.js';
import TitlePage from '../components/TitlePage.js';
import {CPTCountdownInstructions} from '../instructions/CPTCountdownInstructions.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {CPTNumberInstructions} from '../instructions/CPTNumberInstructions.js';
import {CPTFalsePositiveInstructions} from '../instructions/CPTFalsePositiveInstructions.js';
import {CPTFalseNegativeInstructions} from '../instructions/CPTFalseNegativeInstructions.js';
import {CPTNumberTestInstructions} from '../instructions/CPTNumberTestInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import motor_praxis_banner from '../assets/cpt/banner.png';

const TEST_INSTRUCTIONS_REGEX = /Number[ _]Test[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FALSE_POSITIVE_REGEX = /False[ _]Positive/ig;
const FALSE_NEGATIVE_REGEX = /False[ _]Negative/ig;

export default class CPT extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      image_urls: [],
      feedback: null,
      responses: [],
      assessment_complete: false,
      skipped: 0,
      starttime: new Date()
    }
    this.images = [];
    this.image_urls = [];
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onPracticeFailed = this.onPracticeFailed.bind(this);
    this.restartPractice = this.restartPractice.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0] || 'CLICK HERE TO CONTINUE';
    this.back_button_text = content[1] || 'GO BACK';
    this.spacebar_text = content[2] || 'Press the spacebar to continue';
    this.skipListener = this.skipListener.bind(this);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
  }

  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    this.images = images;
    this.next();
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

  canGoBack()
  {
    const index = this.state.index - 1;
    return index > 0;
  }

  back(e, goTo)
  {
    let index = this.state.index - 1;
    if(goTo)
    {
      let found = false;
      while(!found && index > 1)
      {
        if(this.props.timeline[index].section_title.match(goTo))
        {
          found = true;
          continue;
        }
        else
        {
          index = index - 1;
        }
      }
    }

    this.setState((prevState, props) => {
      return {index: index};
    });
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
      this.setState((prevState, props) => {
        return {index: next};
      });
    }
  }

  onPracticeComplete()
  {
    const index = this.state.index + 4;
    this.setState((prevState, props) => {
      return {index: index};
    });
  }

  onTrialsComplete(responses)
  {
    let updated_responses = this.state.responses.concat(responses);
    this.setState((prevState, props) => {
      return {responses: updated_responses}
    }, this.next);
  }

  onPracticeFailed(reason)
  {
    let index = this.state.index;
    let found = -1;
    while(found < 0 && index < this.props.timeline.length)
    {
      const timeline_object = this.props.timeline[index];
      const section_title = timeline_object.section_title;
      if(section_title.includes(reason))
      {
        found = index;
      }
      index = index + 1;
    }

    // feedback has been found, now we render the feedback.

    if(found > -1)
    {
      const feedback = this.props.timeline[found];
      this.setState((prevState, props) => {
        return {feedback: feedback}
      });
    }
  }

  restartPractice()
  {
    const index = this.state.index;
    this.setState((prevState, props) => {
      return {index: index-1, feedback: null}
    });
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
    const feedback = this.state.feedback;

    if(feedback)
    {
      return <div>
      {feedback.section_title.match(FALSE_POSITIVE_REGEX) && <CPTFalsePositiveInstructions test={this.props.test.test} response_device={this.props.response_device} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} spacebar_text={this.spacebar_text} continue_button_text={this.continue_button_text} />}
      {feedback.section_title.match(FALSE_NEGATIVE_REGEX) && <CPTFalseNegativeInstructions test={this.props.test.test} response_device={this.props.response_device} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} spacebar_text={this.spacebar_text} continue_button_text={this.continue_button_text}/>}
      </div>
    }
    else if(index === 0)
    {
      /// Also set the text for continue, go back etc.
      return <div className="container center"><AssetLoader base_url={this.props.base_url} stimulus_dir="cpt" practice_trials={this.props.practice_trials} test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} /></div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={motor_praxis_banner} content={JSON.parse(timeline_object.content)} onClick={this.next} continue_button_text={this.continue_button_text} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(TEST_INSTRUCTIONS_REGEX))
    {
      return <CPTNumberTestInstructions  instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={(e) => this.back(e, BEGIN_PAGE_REGEX)} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.includes("Number_Instructions"))
    {
      return <CPTNumberInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.includes("_Countdown"))
    {
      return <CPTCountdownInstructions seconds={5} instructions={JSON.parse(timeline_object.content)} callback={this.next} response_device={this.props.response_device} />
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      return <CPTTrials base_url={this.props.base_url} test={this.props.test.test} images={this.images} trials={this.props.practice_trials} practice={true} onPracticeComplete={this.onPracticeComplete} onPracticeFailed={this.onPracticeFailed}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <CPTTrials base_url={this.props.base_url} test={this.props.test.test} images={this.images} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete}/>
    }
    else
    {
      return <div className="container center">Error: Unkown CPT section {section_title} in part {this.state.index}</div>
    }
  }
}
