import React from 'react';
import '../styles/medf.css';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {MEDFPracticeTrials} from "../trials/MEDFPracticeTrials.js";
import {MEDFTrials} from "../trials/MEDFTrials.js";

import medf_banner from '../assets/medf/banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const PRACTICE_REGEX = /Practice/ig
const TEST_REGEX = /Test$/ig;
const FEEDBACK_CORRECT_REGEX = /Feedback[ _]Correct/ig;
const FEEDBACK_INCORRECT_REGEX = /Feedback[ _]Incorrect/ig;

export default class MEDF extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      starttime: new Date(),
      skipped: 0,
      feedback: null
    }

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];
    this.this_face_text = content[2];
    this.equal_text = content[3];

    this.faces = []; // MEDF has faces
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.canGoBack = this.canGoBack.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    //this.addIncorrectPracticeCnt = this.addIncorrectPracticeCnt.bind(this);
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.skipListener, false);
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
    this.faces = images;
    this.next();
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

  back()
  {
    let next;
    if(this.state.index < 6){
      next = this.state.index - 2;
    } else {
      next = this.state.index - 1;
    }
    if(next > 0)
    {
      this.setState((prevState, props) => {
        return {index: next};
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

    // if(feedback)
    // {
    //   return <div>
    //   {feedback.section_title.match(FEEDBACK_CORRECT_REGEX) && <MEDFPracticeTrials trial={this.props.practice_trials} incorrect_response={false} instructions={JSON.parse(feedback.content)} onContinue={this.onPracticeComplete} continue_button_text={this.continue_button_text} />}
    //   {feedback.section_title.match(FEEDBACK_INCORRECT_REGEX) && <MEDFPracticeTrials incorrect_response={true} trial={this.props.practice_trials} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} continue_button_text={this.continue_button_text}/>}
    //   </div>
    // }
    if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} task="medf" stimulus_dir="medf" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={medf_banner} content={JSON.parse(timeline_object.content)} banner_width={312} theme={"light"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test} />
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} hideGoBack={this.canGoBack()} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      const buttons = ["\u2191 " + this.this_face_text, this.equal_text, this.this_face_text + " \u2191"];
      const feedback_correct = JSON.parse(this.props.timeline[this.state.index+1].content)[0];
      const feedback_incorrect = JSON.parse(this.props.timeline[this.state.index+2].content)[0];
      return <div className="container"><MEDFPracticeTrials base_url={this.props.base_url} continue_button_text={this.continue_button_text} content={JSON.parse(timeline_object.content)} buttons={buttons} trials={this.props.practice_trials} feedback_correct={feedback_correct} feedback_incorrect={feedback_incorrect} images={this.faces} onPracticeComplete={this.onPracticeComplete}/></div>
    }
    else if(section_title.match(TEST_REGEX))
    {
      const buttons = ["\u2191 " + this.this_face_text, this.equal_text, this.this_face_text + " \u2191"];
      return <div className="container"><MEDFTrials base_url={this.props.base_url} content={JSON.parse(timeline_object.content)} buttons={buttons} trials={this.props.test_trials} images={this.faces} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown MEDF section {section_title}</p></div>
    }
  }
}
