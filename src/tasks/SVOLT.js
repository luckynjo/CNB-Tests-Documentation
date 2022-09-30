import React from 'react';
import '../styles/svolt.css';
import {ShapeMemoryTrials} from '../trials/ShapeMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {SVOLTDemoInstructions} from '../instructions/SVOLTDemoInstructions.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {ImageSlideshow} from '../components/ImageSlideshow.js';
import SubmitPage from '../components/SubmitPage.js';
import svolt_banner from '../assets/svolt/banner.png';

const DEMO_INSTRUCTIONS_REGEX = /Demo[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const SLIDESHOW_REGEX = /Slideshow/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

export default class SVOLT extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      skipped: 0,
      starttime: new Date()
    }

    const content = JSON.parse(this.props.timeline[0].content);
    const test_name = props.test.test;
    const test_parts = test_name.split('-');
    const test_form = test_parts.filter(x => x.match(/^[abc]$/ig));
    this.test_form = test_form[0];
    this.continue_button_text = content[0];
    this.back_button_text = content[1];

    this.shapes = []; // SVOLT has shapes
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


  onAssetsLoadComplete(images)
  {
    window.addEventListener("keydown", this.skipListener, false);
    this.shapes = images;
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
      <AssetLoader base_url={this.props.base_url} stimulus_dir="svolt" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={svolt_banner} content={JSON.parse(timeline_object.content)} banner_width={136} theme={"light"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <SVOLTDemoInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} hideGoBack={this.canGoBack()} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(SLIDESHOW_REGEX))
    {
      return <div className="container center"><ImageSlideshow stimulus_dir={this.test_form === "b" ? "svolt_b" : "svolt"} base_url={this.props.base_url} trials={this.props.slideshow} images={this.shapes} classList={"svolt"} onSlideShowComplete={this.next}/></div>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <div className="container"><ShapeMemoryTrials stimulus_dir={this.test_form === "b" ? "svolt_b" : "svolt"} base_url={this.props.base_url} buttons={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.shapes} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown SVOLT section {section_title}</p></div>
    }
  }
}
