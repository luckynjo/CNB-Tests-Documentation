import React from "react";
import '../styles/vsplot.css';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {VSPLOTInstructions} from '../instructions/VSPLOTInstructions.js';
import PlotCanvasTrials from "../trials/PlotCanvasTrials.js";
import AssetLoader from '../loaders/AssetLoader.js';

import vsplot_banner from "../assets/vsplot/escher_relativity_med.png";
import parallel_demo from "../assets/vsplot/parallel_demo.png";
import not_parallel_demo from "../assets/vsplot/not_parallel_demo.png";
import buttons_demo from "../assets/vsplot/buttons_demo.png";

const INSTRUCTIONS_REGEX = /Instructions/ig;
const DEMO_INSTRUCTIONS_REGEX = /Demo[ _]Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const PRACTICE_REGEX = /Practice/ig
const TEST_REGEX = /Test$/ig;

export default class VSPLOT extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      assessment_complete: false,
      responses: [],
      starttime: new Date(),
      skipped: 0,
      feedback: null
    };

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0];
    this.back_button_text = content[1];
    this.hintLeft = content[2];
    this.hintRight = content[3];
    this.finished_text = content[4];

    this.faces = [];
    this.skipListener = this.skipListener.bind(this);
    this.skipTest = this.skipTest.bind(this);
    this.onAssetsLoadComplete = this.onAssetsLoadComplete.bind(this);
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.canGoBack = this.canGoBack.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
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
    const index = this.state.index + 4;
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

    if(index === 0)
    {
      return <div className="container center">
      <AssetLoader base_url={this.props.base_url} task="vsplot" stimulus_dir="vsplot" test_trials={this.props.test_trials} practice_trials={this.props.practice_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={vsplot_banner} content={JSON.parse(timeline_object.content)} banner_width={312} theme={"dark"} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test} />
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      let page;
      let images = [];
      if(section_title.includes("Page_2")){
        page = 2;
        images.push(parallel_demo);
        images.push(not_parallel_demo);
      } else if(section_title.includes("Page_3")){
        page = 3;
        images.push(buttons_demo);
      }
      return <VSPLOTInstructions instructions={JSON.parse(timeline_object.content)} images={images} page={page} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} hideGoBack={this.canGoBack()} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} hideGoBack={this.canGoBack()} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      const hint = JSON.parse(timeline_object.content)[0];
      const feedback_correct_first = JSON.parse(this.props.timeline[this.state.index+1].content)[0];
      const feedback_correct_second = JSON.parse(this.props.timeline[this.state.index+1].content)[1];
      const feedback_correct_third = JSON.parse(this.props.timeline[this.state.index+1].content)[2];
      const feedback_incorrect_first = JSON.parse(this.props.timeline[this.state.index+2].content)[0];
      const feedback_incorrect_second = JSON.parse(this.props.timeline[this.state.index+3].content)[0];

      const feedback_array = [
        {content: [<p className="text--center">{hint}</p>]},
        {content: [<p className="text--center">{feedback_incorrect_first}</p>]},
        {content: [<p className="text--center">{feedback_incorrect_second}</p>]},
        {content: [<p className="text--center">{feedback_correct_first}</p>]},
        {content: [<p className="text--center">{feedback_correct_second}</p>]},
        {content: [<p className="text--center">{feedback_correct_third}</p>]}
      ];

      const responses_obj = {
        items:
        	<table className="canvas--responses">
        	<tbody>
        	<tr>
        	<td className="inst"><p className="plot-instructions-text--small tip">{this.hintLeft}</p></td>
        	<td><button value={-1} className="button plot--response-button plot--left center--horizontal"> </button></td>
        	<td><button value={1} className="button plot--response-button plot--right center--horizontal"> </button></td>
        	<td className="inst"><p className="plot-instructions-text--small tip">{this.hintRight}</p></td>
        	</tr>
        	<tr>
        	<td colSpan={4}><button value="FINISHED" className='button plot--response-button center--horizontal plot--finished'>{this.finished_text}</button></td>
        	</tr>
        </tbody>
        </table>
      };
      const content={
        proc: "practice",
        obj: "plot",
        response_style: "canvas--responses",
        randomize: false,
        trials: this.props.practice_trials,
        responses: responses_obj,
        feedback: feedback_array
      };
      return <PlotCanvasTrials content={content} instructions={JSON.parse(timeline_object.content)} feedback={feedback_array} trials={this.props.practice_trials} base_url={this.props.base_url} onComplete={this.onPracticeComplete}  onContinue={this.onPracticeComplete} />
    }
    else if(section_title.match(TEST_REGEX))
    {
      const responses_obj = {
        items:
        	<table className="canvas--responses">
        	<tbody>
        	<tr>
        	<td className="inst"><p className="plot-instructions-text--small tip">{this.hintLeft}</p></td>
        	<td><button value={-1} className="button plot--response-button plot--left center--horizontal"> </button></td>
        	<td><button value={1} className="button plot--response-button plot--right center--horizontal"> </button></td>
        	<td className="inst"><p className="plot-instructions-text--small tip">{this.hintRight}</p></td>
        	</tr>
        	<tr>
        	<td colSpan={4}><button value="FINISHED" className='button plot--response-button center--horizontal plot--finished'>{this.finished_text}</button></td>
        	</tr>
        </tbody>
        </table>
      };
      const content={
        proc: "test",
        obj: "plot",
        response_style: "canvas--responses",
        randomize: false,
        trials: this.props.test_trials,
        responses: responses_obj
      };
      return <PlotCanvasTrials content={content} instructions={JSON.parse(timeline_object.content)} trials={this.props.test_trials} base_url={this.props.base_url} onComplete={this.onTrialsComplete}  onContinue={this.onTrialsComplete} />
    }
    else
    {
      return <div className="container center"><p>Unkown VSPLOT section {section_title}</p></div>
    }
  }
}
