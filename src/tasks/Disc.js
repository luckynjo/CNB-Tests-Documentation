import React from 'react';
import '../styles/disc.css';
import {DiscTrials} from '../trials/DiscTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import TitlePage from '../components/TitlePage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import SubmitPage from '../components/SubmitPage.js';
import ddisc_banner from '../assets/ddisc/ddisc_banner.png';
import rdisc_banner from '../assets/rdisc/rdisc_banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

export default class Disc extends React.Component {
  constructor(props){
    super(props);
    this.state={
      index: 0,
      starttime: new Date(),
      assessment_complete: false,
      responses: [],
      skipped: 0
    };

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];
    this.hint = content[2];
    this.orWord = content[3];
    this.responses = [];

    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.next = this.next.bind(this);
    this.hideGoBack = this.hideGoBack.bind(this);
    this.back = this.back.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
  }

  componentWillUnmount()
  {
    window.removeEventListener("keydown", this.skipListener, false);
  }

  componentDidMount()
  {
    window.addEventListener("keydown", this.skipListener, false);
  }

  onPracticeComplete()
  {
    const index = this.state.index + 1;
    this.setState((prevState, props) => {
      return {index: index};
    });
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

  onComplete(responses)
  {
		let current_responses = this.state.responses;
    const updated_responses = current_responses.concat(responses);
		this.setState((prevState, props) => {
			return {responses: updated_responses}
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
    let found = false;

    if(current_index > -1){
      // Specifically for the back button shown after completing the practice.
      if(this.props.timeline[current_index].section_title.match(PRACTICE_REGEX))
      {
        current_index = current_index - 1;
      }

      this.setState((prevState, props) => {
        return {index: current_index}
      });
    }
  }

  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    //this.faces = images;
    this.next();
  }

  render(){
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
      <AssetLoader base_url={this.props.base_url} stimulus_dir={this.props.test.test.includes("ddisc") ? "ddisc" : "rdisc"} test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={this.props.test.test.includes("ddisc") ? ddisc_banner : rdisc_banner} theme={"light"} content={JSON.parse(timeline_object.content)} onClick={this.next} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} {...this.props.test}/>
    }
		else if(section_title.match(INSTRUCTIONS_REGEX))
		{
			return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={this.hideGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
		}
		else if(section_title.match(BEGIN_PAGE_REGEX))
		{
			return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
		}
		else if(section_title.match(PRACTICE_REGEX))
		{
			return <DiscTrials stimuli={JSON.parse(timeline_object.content)} hint={this.hint} orWord={this.orWord} proc={"practice"} content={timeline_object.content} practice={true} onTrialsComplete={this.onPracticeComplete}/>
		}
		else if(section_title.match(TEST_REGEX))
		{
			return <DiscTrials stimuli={JSON.parse(timeline_object.content)} hint={this.hint} orWord={this.orWord} content={timeline_object.content} onTrialsComplete={this.onComplete}/>
		}
		else
		{
			return <p>Error: Unknown object type {timeline_object.type} : {section_title} at {index}</p>
		}
  }

}
