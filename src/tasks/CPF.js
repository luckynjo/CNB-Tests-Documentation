import React from 'react';
import '../styles/cpf.css';
import {FaceMemoryTrials} from '../trials/FaceMemoryTrials.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {CPFDemoInstructions} from '../instructions/CPFDemoInstructions.js';
import TitlePage from '../components/TitlePage.js';
import {BeginPage} from '../components/BeginPage.js';
import AssetLoader from '../loaders/AssetLoader.js';
import {ImageSlideshow} from '../components/ImageSlideshow.js';
import SubmitPage from '../components/SubmitPage.js';
import cpf_banner from '../assets/cpf/banner.png';


const DEMO_INSTRUCTIONS_REGEX = /Demo[_ ]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice|Slideshow)/ig;
const SLIDESHOW_REGEX = /Slideshow/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;

/***
 CPF block that runs the entire CPF task.
 Takes timeline, trials, and test as props.
*/
export default class CPF extends React.Component
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

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[1];
    this.back_button_text = content[2];

    this.faces = [];
    this.next = this.next.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
  }

  // Store the task images once they have been loaded by the AssetLoader.
  onAssetsLoadComplete(images)
  {
    this.faces = images;
    this.next();
  }

  // Task is completed, submit responses.
  onTrialsComplete(responses)
  {
    this.setState((prevState, props) => {
      return {assessment_complete: true, responses: responses};
    });
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
      return <div className="container center">
      <AssetLoader stimulus_dir="cpf" test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} />
      </div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={cpf_banner} continue_button_text={this.continue_button_text} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(DEMO_INSTRUCTIONS_REGEX))
    {
      return <CPFDemoInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
      return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(section_title.match(SLIDESHOW_REGEX))
    {
      return <div className="container center"><ImageSlideshow trials={this.props.slideshow} images={this.faces}  onSlideShowComplete={this.next}/></div>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <div className="container"><FaceMemoryTrials buttons={JSON.parse(timeline_object.content)} trials={this.props.test_trials} images={this.faces} onTrialsComplete={this.onTrialsComplete}/></div>
    }
    else
    {
      return <div className="container center"><p>Unkown CPF section {section_title}</p></div>
    }
  }
}
