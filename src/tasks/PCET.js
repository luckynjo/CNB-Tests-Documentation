import React from "react";
import '../styles/pcet.css';
import TitlePage from '../components/TitlePage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import SubmitPage from '../components/SubmitPage.js';
import {PCETTestTrials} from '../trials/PCETTestTrials.js';
import {BeginPage} from '../components/BeginPage.js';

import banner from '../assets/pcet/thickStar.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FEEDBACK_CORRECT_REGEX = /Feedback[ _]Correct/ig;
const FEEDBACK_INCORRECT_REGEX = /Feedback[ _]Incorrect/ig;

export default class PCET extends React.Component {
  constructor(props){
    super(props);
    this.state={
      index: 0,
      assessment_complete: false,
      responses: [],
      skipped: 0,
      starttime: new Date()
    }

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0] || 'CLICK HERE TO CONTINUE';
    this.back_button_text = content[1] || 'GO BACK';

    this.images=[];
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.canGoBack = this.canGoBack.bind(this);
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
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} stimulus_dir={"pcet"} test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
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
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} hideGoBack={this.canGoBack()} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(TEST_REGEX))
    {
      const trialsText = JSON.parse(this.props.timeline[this.state.index].content)[1];
      const feedback_correct = JSON.parse(this.props.timeline[this.state.index+1].content)[0];
      const feedback_incorrect = JSON.parse(this.props.timeline[this.state.index+2].content)[0];
      return <PCETTestTrials base_url={this.props.base_url} buttons={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.images} onTrialsComplete={this.onTrialsComplete} feedback_correct={feedback_correct} feedback_incorrect={feedback_incorrect} trialsText={trialsText}/>
    }
    else
    {
      return <div className="container center"><p>Unkown SVOLT section {section_title}</p></div>
    }
  }

}
