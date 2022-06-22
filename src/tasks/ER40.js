import React from 'react';
import '../styles/er40.css';
import {FaceMemoryTrials} from '../trials/FaceMemoryTrials.js';
import {ShapeMemoryTrials} from '../trials/ShapeMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {ER40DemoInstructions} from '../instructions/ER40DemoInstructions.js';
//import {ER40IncorrectInstructions} from '../instructions/ER40IncorrectInstructions.js';
//import {ER40CorrectInstructions} from '../instructions/ER40CorrectInstructions.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {ImageSlideshow} from '../components/ImageSlideshow.js';
import SubmitPage from '../components/SubmitPage.js';
import {ER40PracticeTrial} from "../trials/ER40PracticeTrial.js";
import {ER40Trials} from '../trials/ER40Trials.js';
import er40_banner from '../assets/er40/er40_banner.png';

const DEMO_INSTRUCTIONS_REGEX = /Demo[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const SLIDESHOW_REGEX = /Slideshow/ig
const PRACTICE_REGEX = /Practice/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FEEDBACK_CORRECT_REGEX = /Feedback[ _]Correct/ig;
const FEEDBACK_INCORRECT_REGEX = /Feedback[ _]Incorrect/ig;

export default class ER40 extends React.Component {
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

    this.faces = []; // ER40 has faces
    this.next = this.next.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.onPracticeFeedback = this.onPracticeFeedback.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
  }

  onAssetsLoadComplete(images)
  {
    this.faces = images;
    console.log(this.faces);
    this.next();
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
      {feedback.section_title.match(FEEDBACK_CORRECT_REGEX) && <ER40PracticeTrial trial={this.props.practice_trials} incorrect_response={false} instructions={JSON.parse(feedback.content)} onContinue={this.onPracticeComplete} continue_button_text={this.continue_button_text} />}
      {feedback.section_title.match(FEEDBACK_INCORRECT_REGEX) && <ER40PracticeTrial incorrect_response={true} trial={this.props.practice_trials} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} continue_button_text={this.continue_button_text}/>}
      </div>
    }
    else if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir="er40" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={er40_banner} banner_width={312} theme={"light"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test} description={"Form D"} />
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <ER40DemoInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(SLIDESHOW_REGEX))
    {
      return <div className="container center"><ImageSlideshow base_url={this.props.base_url} trials={this.props.slideshow} images={this.faces} classList={"er40"} onSlideShowComplete={this.next}/></div>
    }

    else if(section_title.match(TEST_REGEX))
    {
      return <div className="container"><ER40Trials base_url={this.props.base_url} buttons={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.faces} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      console.log(this.faces);
      const feedback_correct = JSON.parse(this.props.timeline[this.state.index+1].content)[0];
      const feedback_incorrect = JSON.parse(this.props.timeline[this.state.index+2].content)[0];
      return <div className="container"><ER40PracticeTrial base_url={this.props.base_url} buttons={JSON.parse(timeline_object.content)} trials={this.props.practice_trials} feedback_correct={feedback_correct} feedback_incorrect={feedback_incorrect} images={this.faces} onPracticeComplete={this.onPracticeComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown ER40 section {section_title}</p></div>
    }
  }
}
