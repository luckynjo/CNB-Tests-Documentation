import React from 'react';
import '../styles/digsym.css';
import {DigsymMatchingTrials} from '../trials/DigsymMatchingTrials.js';
import {DigsymMemoryTrials} from '../trials/DigsymMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {DigsymInstructions} from '../instructions/DigsymInstructions.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import SubmitPage from '../components/SubmitPage.js';
import digsym_a_banner from '../assets/digsym/digsym_a_banner.png';


const DEMO_INSTRUCTIONS_REGEX = /Digsym[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const PRACTICE_REGEX = /Practice/ig;
const MEMORY_TEST_REGEX = /Memory[ _]Test/ig;
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

/***
 CPF block that runs the entire CPF task.
 Takes timeline, trials, and test as props.
*/
export default class Digsym extends React.Component
{
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      skipped: 0,
      starttime: new Date()
    }
    const content = JSON.parse(props.timeline[0].content);
    const test_name = props.test.test;
    const test_parts = test_name.split('-');
    //let test_type = 'a';
    const test_form = test_parts.filter(x => x.match(/^[abc]$/ig));
    this.test_form = test_form[0];
    this.continue_button_text = content[0];
    this.back_button_text = content[1];

    const buttons_content = JSON.parse(props.timeline[4].content);
    this.same_text = buttons_content[0];
    this.different_text = buttons_content[1];

    this.digit_symbols = [];
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.skipListener = this.skipListener.bind(this);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
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

  // Store the task images once they have been loaded by the AssetLoader.
  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    this.digit_symbols = images;
    this.next();
  }

  // Task is completed, submit responses.
  onTrialsComplete(responses)
  {
    const updated_responses = this.state.responses.concat(responses);
    const next_index = this.state.index + 1;
    if(next_index >= this.props.timeline.length)
    {
      this.setState((prevState, props) => {
        return {assessment_complete: true, responses: updated_responses};
      });
    }
    else
    {
      this.setState((prevState, props) => {
        return {responses: updated_responses};
      }, this.next);
    }
  }

  // Loads the next task section.
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

    if(index === 0)
    {
      // Get digits and symbols to load via AssetLoader.
      const valid_image_trials = this.props.test_trials.filter(item => item.trial_section === "<matching>");
      const digit_images = valid_image_trials.map((item) => {return {"stimulus" : JSON.parse(item.stimulus).digit}});
      const symbol_images = valid_image_trials.map((item) => {return {"stimulus": JSON.parse(item.stimulus).symbol}});
      const images = digit_images.concat(symbol_images);
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir="digsym" test_trials={images} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={digsym_a_banner} content={JSON.parse(timeline_object.content)} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <DigsymInstructions test_form={this.test_form} instructions={JSON.parse(timeline_object.content)} onContinue={this.next} same_text={this.same_text} different_text={this.different_text} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      return <div className="container"><DigsymMatchingTrials base_url={this.props.base_url} test_form={this.test_form} same_text={this.same_text} different_text={this.different_text} practice={true} content={JSON.parse(timeline_object.content)} trials={this.props.practice_trials} images={this.digit_symbols} onTrialsComplete={this.next}/></div>
    }
    else if(section_title.match(MEMORY_TEST_REGEX))
    {
      return <div className="container"><DigsymMemoryTrials base_url={this.props.base_url} test_form={this.test_form} content={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.digit_symbols} onTrialsComplete={this.onTrialsComplete}/></div>

    }
    else if(section_title.match(TEST_REGEX))
    {
      return <div className="container"><DigsymMatchingTrials base_url={this.props.base_url} test_form={this.test_form} same_text={this.same_text} different_text={this.different_text} content={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.digit_symbols} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown CPF section {section_title}</p></div>
    }
  }
}
