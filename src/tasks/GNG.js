import React from "react";
import '../styles/gng.css';
import TitlePage from '../components/TitlePage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {GNGDemoInstructions} from '../instructions/GNGDemoInstructions.js';
import {SimpleCountdownInstructions} from '../instructions/SimpleCountdownInstructions.js';
import {GNGFeedbackInstructions} from '../instructions/GNGFeedbackInstructions.js';
import SubmitPage from '../components/SubmitPage.js';
import {GNGPracticeTrials} from '../trials/GNGPracticeTrials.js';
import {GNGTestTrials} from '../trials/GNGTestTrials.js';
import {BeginPage} from '../components/BeginPage.js';
import banner from '../assets/gng/banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const DEMO_INSTRUCTIONS_REGEX = /Demo[ _]Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const TEST_REGEX = /Test$/ig;
const PRACTICE_REGEX = /Practice$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FEEDBACK_FALSE_NEG_REGEX = /Feedback[ _]False[ _]Negative/ig;
const FEEDBACK_FALSE_POS_Y_REGEX = /Feedback[ _]False[ _]Positive[ _]Y/ig;
const FEEDBACK_FALSE_POS_X_REGEX = /Feedback[ _]False[ _]Positive[ _]X/ig;

export default class GNG extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      skipped: 0,
      starttime: new Date(),
      incorrect_practice_cnt: 0
    };

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0] || 'CLICK HERE TO CONTINUE';
    this.back_button_text = content[1] || 'GO BACK';
    this.press = content[2];
    this.dont_press = content[3];
    this.stimText1 = content[4];
    this.stimText2 = content[5];
    this.spacebar_text = content[6];

    this.images = [];
    //this. = 0;
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.canGoBack = this.canGoBack.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.onPracticeGoBack = this.onPracticeGoBack.bind(this);
    this.addIncorrectPracticeCnt = this.addIncorrectPracticeCnt.bind(this);
  }


  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
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


  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    this.images = images;
    this.next();
  }


  onTrialsComplete(responses)
  {
    this.setState((prevState, props) => {
      return {assessment_complete: true, responses: responses};
    });
  }

  onPracticeGoBack(n){
    const next = this.state.index - n;
    if(next > 0)
    {
      this.setState((prevState, props) => {
        return {index: next};
      });
    }
  }


  canGoBack()
  {
    return this.state.index > 1;
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

  addIncorrectPracticeCnt(){
    const incorrect_practice_cnt = this.state.incorrect_practice_cnt;
    this.setState({
      incorrect_practice_cnt: incorrect_practice_cnt + 1
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
    const next = this.state.index + 4;
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


  render(){
    if(this.state.assessment_complete)
    {
      return  <SubmitPage test={this.props.test.test} skipped={this.state.skipped} starttime={this.state.starttime} responses={this.state.responses} />
    }

    const index = this.state.index;
    const timeline_object = this.props.timeline[index];
    const section_title = timeline_object.section_title;
    const feedback = this.state.feedback;

    if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir={"gng"} test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={banner} content={JSON.parse(timeline_object.content)} banner_width={312} theme={"dark"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <GNGDemoInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} hideGoBack={false} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} hideGoBack={this.canGoBack()} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.includes("_Countdown"))
    {
      return <SimpleCountdownInstructions seconds={3} instructions={JSON.parse(timeline_object.content)} callback={this.next}/>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      const feedback_false_neg = JSON.parse(this.props.timeline[this.state.index+1].content);
      const feedback_false_pos_y = JSON.parse(this.props.timeline[this.state.index+2].content);
      const feedback_false_pos_x = JSON.parse(this.props.timeline[this.state.index+3].content);
      return <GNGPracticeTrials base_url={this.props.base_url} section="practice" trials={JSON.parse(timeline_object.content)} onTrialsComplete={this.onPracticeComplete} feedback_false_neg={feedback_false_neg} feedback_false_pos_y={feedback_false_pos_y} feedback_false_pos_x={feedback_false_pos_x} back={this.back} incorrect_practice_cnt={this.state.incorrect_practice_cnt} addIncorrectPracticeCnt={this.addIncorrectPracticeCnt} spacebar_text={this.spacebar_text}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <GNGTestTrials base_url={this.props.base_url} section="test" trials={JSON.parse(timeline_object.content)} onTrialsComplete={this.onTrialsComplete}/>
    }
    else
    {
      return <div className="container center"><p>Unkown GNG section {section_title}</p></div>
    }
  }
}
