import React from 'react';
import '../styles/cptChild.css';
import {CPTChildTrials} from '../trials/CPTChildTrials.js';
import AssetLoader from '../loaders/AssetLoader.js';
import TitlePage from '../components/TitlePage.js';
import {CPTChildCountdownInstructions} from '../instructions/CPTChildCountdownInstructions.js';
import {ShapeInstructions} from '../instructions/ShapeInstructions.js';
import {CPTFalsePositiveInstructions} from '../instructions/CPTFalsePositiveInstructions.js';
import {CPTFalseNegativeInstructions} from '../instructions/CPTFalseNegativeInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import cpt_child_banner from '../assets/cpt/banner.png';

const SHAPE_INSTRUCTIONS_REGEX = /Shape[ _]Instructions/ig;
const TEST_COUNTDOWN_REGEX = /Test[ _]Count/ig;
const SECOND_COUNTDOWN_REGEX = /Ready[ _]Test/ig;
const SHAPE_INSTRUCTIONS_2_REGEX = /Shape[ _]Instructions[ _]2/ig;
const SHAPE_INSTRUCTIONS_3_REGEX = /Shape[ _]Instructions[ _]3/ig;
const SHAPE_INSTRUCTIONS_4_REGEX = /Shape[ _]Instructions[ _]4/ig;
const SHAPE_INSTRUCTIONS_5_REGEX = /Shape[ _]Instructions[ _]5/ig;
const SHAPE_INSTRUCTIONS_6_REGEX = /Shape[ _]Instructions[ _]6/ig;
const DEMO_INSTRUCTIONS_REGEX = /Demo[ _]Instructions/ig;
const STAR_INSTRUCTIONS_REGEX = /Star[ _]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig;
const TEST_REGEX = /Test$/ig;
const Last_TEST_REGEX = /Last[ _]Test/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FALSE_POSITIVE_REGEX = /False[ _]Positive/ig;
const FALSE_NEGATIVE_REGEX = /False[ _]Negative/ig;

export default class CPTChild extends React.Component{
  constructor(props){
    super(props);

    this.trials = [{question_number: 1, stimulus: "Circle_1.png"}, {question_number: 2, stimulus: "Square_1.png"}, {question_number: 3, stimulus: "Triangle_1.png"},
                {question_number: 4, stimulus: "Star_1.png"}, {question_number: 5, stimulus: "Diamond_1.png"}, {question_number: 6, stimulus: "Rectangle_1.png"}];

    this.state = {
      index: 0,
      image_urls: [],
      feedback: null,
      responses: [],
      set_complete: 0,
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

  onTrialsComplete(responses, set)
  {
    let updated_responses = this.state.responses.concat(responses);
    this.setState((prevState, props) => {
      return {responses: updated_responses, set_complete:set}
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
      return {index: index, feedback: null}
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
      {feedback.section_title.match(FALSE_POSITIVE_REGEX) && <CPTFalsePositiveInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} spacebar_text={this.spacebar_text} continue_button_text={this.continue_button_text} />}
      {feedback.section_title.match(FALSE_NEGATIVE_REGEX) && <CPTFalseNegativeInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} spacebar_text={this.spacebar_text} continue_button_text={this.continue_button_text}/>}
      </div>
    }
    else if(index === 0)
    {
      /// Also set the text for continue, go back etc.
      return <div className="container center"><AssetLoader base_url={this.props.base_url} stimulus_dir="cptChild" practice_trials={this.props.practice_trials} test_trials={this.trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} /></div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={cpt_child_banner} content={JSON.parse(timeline_object.content)} onClick={this.next} continue_button_text={this.continue_button_text} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_6_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"diamond-rectangle"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_5_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"star"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_4_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"square"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_3_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"triangle"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_2_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"square-triangle"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(STAR_INSTRUCTIONS_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={true} type={"star-2"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={true} type={"circle-2"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(SHAPE_INSTRUCTIONS_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"circle"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <ShapeInstructions form={this.props.form} instructions={JSON.parse(timeline_object.content)} keyMode={false} type={"instr"} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      return <CPTChildTrials form={this.props.form} base_url={this.props.base_url} images={this.images} trials={this.props.practice_trials} practice={true} onPracticeComplete={this.onPracticeComplete} onPracticeFailed={this.onPracticeFailed}/>
    }
    else if(section_title.match(SECOND_COUNTDOWN_REGEX))
    {
      return <CPTChildCountdownInstructions seconds={5} instructions={JSON.parse(timeline_object.content)} callback={this.next}/>
    }
    else if(section_title.match(TEST_COUNTDOWN_REGEX))
    {
      return <CPTChildCountdownInstructions seconds={5} instructions={JSON.parse(timeline_object.content)} callback={this.next}/>
    }
    else if(section_title.match(Last_TEST_REGEX))
    {
      const test_trials = [{question_number: 4, stimulus: JSON.stringify("Star_1.png")}, {question_number: 5, stimulus: JSON.stringify("Diamond_1.png")}, {question_number: 6, stimulus: JSON.stringify("Rectangle_1.png")}];
      return <CPTChildTrials form={this.props.form} test={true} set={2} responses={this.state.responses} base_url={this.props.base_url} images={this.images} trials={test_trials} onTrialsComplete={this.onTrialsComplete}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      const test_trials = [{question_number: 1, stimulus: JSON.stringify("Circle_1.png")}, {question_number: 2, stimulus: JSON.stringify("Square_1.png")}, {question_number: 3, stimulus: JSON.stringify("Triangle_1.png")}];
      return <CPTChildTrials form={this.props.form} test={true} set={1} base_url={this.props.base_url} images={this.images} trials={test_trials} onTrialsComplete={this.onTrialsComplete}/>
    }
    else
    {
      return <div className="container center">Error: Unkown CPT section {section_title} in part {this.state.index}</div>
    }
  }
}
