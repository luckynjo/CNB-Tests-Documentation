import React from 'react';
import '../styles/pllt.css';
import TitlePage from '../components/TitlePage.js';
import SubmitPage from '../components/SubmitPage.js';
import {PLLTInstructions} from '../instructions/PLLTInstructions.js';
import {PLLTSlideshow} from '../components/PLLTSlideshow.js';
import {PLLTTrials} from '../trials/PLLTTrials.js';
import banner from '../assets/pllt/banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const SLIDESHOW_REGEX = /Slideshow/ig;
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

export default class PLLT extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      index: 1,
			timeline: props.timeline,
			responses: [],
      assessment_complete: false,
      skipped: 0,
      trial: 0,
      starttime: new Date()
    };

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];
    this.other_button_text = content[2];
    this.next_trial_button_text = content[3];

    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.slideshowWords = this.slideshowWords.bind(this);
    this.trialWords = this.trialWords.bind(this);
    document.body.classList.add('dark');
    this.skipListener = this.skipListener.bind(this);
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

  // Record practice responses, also override existing practice responses.

  onTrialsComplete(responses)
  {
    const next_trial = this.state.trial + 1;
		let current_responses = this.state.responses;
    const updated_responses = current_responses.concat(responses);
		this.setState((prevState, props) => {
			return {responses: updated_responses, trial: next_trial}
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
    this.setState((prevState, props) => {
      return {index: current_index}
    });
  }

  slideshowWords(content)
  {
    if(content.length > 1)
    {
      this.slides = content.slice(1);
    }
    return this.slides;
  }

  trialWords(content)
  {
    if(content.length > 1)
    {
      this.trials = content.slice(1);
    }
    return this.trials;
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
      return <TitlePage banner={banner} content={JSON.parse(timeline_object.content)} onClick={this.next} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} {...this.props.test}/>
    }
		else if(section_title.match(INSTRUCTIONS_REGEX))
		{
			return <PLLTInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={this.hideGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
		}
		else if(section_title.match(SLIDESHOW_REGEX))
		{
			return <PLLTSlideshow words={this.slideshowWords(JSON.parse(timeline_object.content))} onSlideShowComplete={this.next}/>
		}
    else if(section_title.match(TEST_REGEX))
    {
      return <PLLTTrials trials={this.props.test_trials} trial={this.state.trial} words={this.trialWords(JSON.parse(timeline_object.content))} next_trial_button_text={this.next_trial_button_text} other_button_text={this.other_button_text} onTrialsComplete={(e) => this.onTrialsComplete(e)} />
    }
		else
		{
			return <p>Error: Unknown PLLT object type {timeline_object.type} : {section_title} at {index}</p>
		}
  }
}
