import React from 'react';
import '../styles/er40Child.css';
import {FaceMemoryTrials} from '../trials/FaceMemoryTrials.js';
import {ShapeMemoryTrials} from '../trials/ShapeMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import SlideInstructions from '../instructions/SlideInstructions.js';
import ER40ChildDemoInstructions from '../instructions/ER40ChildDemoInstructions.js';
//import {ER40IncorrectInstructions} from '../instructions/ER40IncorrectInstructions.js';
//import {ER40CorrectInstructions} from '../instructions/ER40CorrectInstructions.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {ImageSlideshow} from '../components/ImageSlideshow.js';
import SubmitPage from '../components/SubmitPage.js';
import {ER40ChildPracticeTrial} from "../trials/ER40ChildPracticeTrial.js";
import {ER40ChildTrials} from '../trials/ER40ChildTrials.js';
import er40_banner from '../assets/er40Child/er40_banner.png';

const SLIDE_INSTRUCTIONS_REGEX = /Slide[_ ]Instructions/ig;
const DEMO_INSTRUCTIONS_REGEX = /Demo[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const SLIDESHOW_REGEX = /Slideshow/ig
const PRACTICE_REGEX = /Practice/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FEEDBACK_CORRECT_REGEX = /Feedback[ _]Correct/ig;
const FEEDBACK_INCORRECT_REGEX = /Feedback[ _]Incorrect/ig;

export default class ER40Child extends React.Component {
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
    this.next_button_text = content[2];
    this.play_button_text = content[3];

    this.faces = []; // ER40 has faces
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.canGoBack = this.canGoBack.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.onPracticeFeedback = this.onPracticeFeedback.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
    this.nextPractice = this.nextPractice.bind(this);
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
    const index = this.state.index + 15;
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

  nextPractice(num){
    const next = this.state.index + num;
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
      {feedback.section_title.match(FEEDBACK_CORRECT_REGEX) && <ER40ChildPracticeTrial trial={this.props.practice_trials} incorrect_response={false} instructions={JSON.parse(feedback.content)} onContinue={this.onPracticeComplete} continue_button_text={this.continue_button_text} />}
      {feedback.section_title.match(FEEDBACK_INCORRECT_REGEX) && <ER40ChildPracticeTrial incorrect_response={true} trial={this.props.practice_trials} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} continue_button_text={this.continue_button_text}/>}
      </div>
    }
    else if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir="er40_preschool" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={er40_banner} content={JSON.parse(timeline_object.content)} banner_width={312} theme={"light"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test} description={"Form D"} />
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SLIDE_INSTRUCTIONS_REGEX))
    {
      return <SlideInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} hideGoBack={false} back_button_text={this.back_button_text} next_button_text={this.next_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <ER40ChildDemoInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} play_button_text={this.play_button_text} />
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} hideGoBack={this.canGoBack()} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(SLIDESHOW_REGEX))
    {
      return <div className="container center"><ImageSlideshow base_url={this.props.base_url} trials={this.props.slideshow} images={this.faces} classList={"er40"} onSlideShowComplete={this.next}/></div>
    }

    else if(section_title.match(TEST_REGEX))
    {
      return <div className="container"><ER40ChildTrials base_url={this.props.base_url} buttons={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.faces} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      const feedback_correct = JSON.parse(this.props.timeline[this.state.index+1].content)[0];
      const feedback_incorrect = JSON.parse(this.props.timeline[this.state.index+2].content)[0];
      return <div className="container"><ER40ChildPracticeTrial base_url={this.props.base_url} nextPractice={this.nextPractice} continue_button_text={this.continue_button_text} buttons={JSON.parse(timeline_object.content)} trials={this.props.practice_trials} feedback_correct={feedback_correct} feedback_incorrect={feedback_incorrect} images={this.faces} onPracticeComplete={this.onPracticeComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown ER40 section {section_title}</p></div>
    }
  }
}
