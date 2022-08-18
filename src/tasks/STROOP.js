import React from 'react';
import '../styles/stroop.css';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {STROOPDemoHandInstructions} from '../instructions/STROOPDemoHandInstructions.js';
import {STROOPDemoKeyInstructions} from '../instructions/STROOPDemoKeyInstructions.js';
import {STROOPCrosshair} from '../instructions/STROOPCrosshair.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import SubmitPage from '../components/SubmitPage.js';
import {STROOPTrials} from '../trials/STROOPTrials.js';
import stroop_banner from '../assets/stroop/banner.png';

const DEMO_HAND_INSTRUCTIONS_REGEX = /Demo[_ ]Hand[_ ]Instructions/ig;
const DEMO_KEY_INSTRUCTIONS_REGEX = /Demo[_ ]Key[_ ]Instructions/ig;
const CROSSHAIR_REGEX = /Crosshair/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const SLIDESHOW_REGEX = /Slideshow/ig
const PRACTICE_1_REGEX = /1-Practice/ig
const PRACTICE_2_REGEX = /2-Practice/ig
const PRACTICE_3_REGEX = /3-Practice/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FEEDBACK_CORRECT_REGEX = /Feedback[ _]Correct/ig;
const FEEDBACK_INCORRECT_REGEX = /Feedback[ _]Incorrect/ig;

export default class STROOP extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      skipped: 0,
      starttime: new Date(),
      feedback: null
    }

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];

    //this.faces = [];
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.onPracticeFeedback = this.onPracticeFeedback.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.skipListener, false);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
  }

  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    //this.faces = images;
    this.next();
  }


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


  onPracticeFeedback(reason){
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

  onTrialsComplete(responses)
  {
    this.setState((prevState, props) => {
      return {assessment_complete: true, responses: responses};
    });
  }

  onPracticeComplete()
  {
    const index = this.state.index + 3;
    this.setState((prevState, props) => {
      return {index: index};
    });
  }

  restartPractice()
  {
    const index = this.state.index;
    this.setState((prevState, props) => {
      return {index: index, feedback: null}
    });
  }

  canGoBack()
  {
    return this.state.index > 1;
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

  back()
  {
    const next = this.state.index - 1;
    if(next > 0)
    {
      this.setState((prevState, props) => {
        return {index: next};
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

    if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir="stroop" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={stroop_banner} content={JSON.parse(timeline_object.content)} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test} />
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} hideGoBack={false} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_HAND_INSTRUCTIONS_REGEX))
    {
      return <STROOPDemoHandInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_KEY_INSTRUCTIONS_REGEX))
    {
      return <STROOPDemoKeyInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(CROSSHAIR_REGEX))
    {
      return <STROOPCrosshair onContinue={this.next}/>
    }
    else if(section_title.match(PRACTICE_1_REGEX))
    {
      return <STROOPTrials proc={"practice"} base_url={this.props.base_url} trials={this.props.practice_trials} onTrialsComplete={this.onTrialsComplete} onContinue={this.next} instructions={JSON.parse(timeline_object.content)}/>
    }
    else if(section_title.match(PRACTICE_2_REGEX))
    {
      return <STROOPTrials proc={"practice"} base_url={this.props.base_url} trials={this.props.practice_trials} onTrialsComplete={this.onTrialsComplete} onContinue={this.next} instructions={JSON.parse(timeline_object.content)}/>
    }
    else if(section_title.match(PRACTICE_3_REGEX))
    {
      return <STROOPTrials proc={"practice"} base_url={this.props.base_url} trials={this.props.practice_trials} onTrialsComplete={this.onTrialsComplete} onContinue={this.next} instructions={JSON.parse(timeline_object.content)}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <STROOPTrials proc={"test"} base_url={this.props.base_url} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete} onContinue={this.next} instructions={JSON.parse(timeline_object.content)}/>
    }
    else
    {
      return <div className="container center"><p>Unkown STROOP section {section_title}</p></div>
    }
  }
}
