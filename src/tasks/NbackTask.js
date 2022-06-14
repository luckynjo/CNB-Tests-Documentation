import React from 'react';
import '../styles/cpt.css';
import {NBackTrials} from '../trials/NBackTrials.js';
import {SimpleKeyboardInstructions} from '../instructions/SimpleKeyboardInstructions.js';
import AssetLoader from '../components/AssetLoader.js';
import TitlePage from '../components/TitlePage.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import motor_praxis_banner from '../assets/cpt/banner.png';

const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FALSE_POSITIVE_REGEX = /False[ _]Positive/ig;
const FALSE_NEGATIVE_REGEX = /False[ _]Negative/ig;

export default class NbackTask extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      index: 0,
      image_urls: [],
      feedback: null,
      responses: [],
      assessment_complete: false,
      skipped: 0,
      starttime: new Date()
    }
    this.images = [];
    this.image_urls = [];
    this.next = this.next.bind(this);
    this.onPracticeFailed = this.onPracticeFailed.bind(this);
    this.restartPractice = this.restartPractice.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
  }

  onAssetsLoadComplete(images)
  {
    this.images = images;
    console.log('Loaded les images ', images);
    this.next();
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
    console.log('Practe complete');
    const index = this.state.index;
    let found = false;
    while(!found && index < this.props.timeline.length)
    {
      const timeline_object = this.props.timeline[index];
      if(timeline_object.title.match(INSTRUCTIONS_REGEX))
      {
        found = true;
      }
      else
      {
        index = index + 1;
      }
    }
    this.setState((prevState, props) => {
      return {index: index};
    });
  }

  onTrialsComplete(responses)
  {
    let updated_responses = this.state.responses.concat(responses);
    this.setState((prevState, props) => {
      return {responses: updated_responses}
    }, this.next);
  }

  onPracticeFailed(reason)
  {
    console.log('Practice failed because ', reason);
    let index = this.state.index;
    let found = false;
    while(!found && index < this.props.timeline.length)
    {
      const timeline_object = this.props.timeline[index];
      const section_title = timeline_object.section_title;
      //console.log('Checking feedback from ', section_title);
      if(section_title.includes(reason))
      {
        found = true;
        //console.log('Feedback found as ', section_title);
      }
      else
      {
        index = index + 1;
      }
    }

    // feedback has been found, now we render the feedback.

    if(found)
    {
      const feedback = this.props.timeline[found];
      //console.log('Feedback is ', feedback, ' rerenderinf');
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
    /***console.log('Next section has title ', section_title);
    console.log('images be ', this.state.image_urls);
    console.log('Feedback now is ', feedback);*/

    /***
    {feedback.section_title.match(FALSE_POSITIVE_REGEX) && <CPTFalsePositiveInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} />}
    {feedback.section_title.match(FALSE_NEGATIVE_REGEX) && <CPTFalseNegativeInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} />}
    */

    if(feedback)
    {
      return <div>
      Show feedback here!
      </div>
    }
    else if(index === 0)
    {
      /// Also set the text for continue, go back etc.
      return <div className="container center"><AssetLoader stimulus_dir="flnb" practice_trials={this.props.practice_trials} test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} /></div>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage banner={motor_praxis_banner} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} onContinue={this.next} onGoBack={this.back}/>
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      return <NBackTrials images={this.images} trials={this.props.practice_trials} practice={true} onPracticeComplete={this.onPracticeComplete} onPracticeFailed={this.onPracticeFailed}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <NBackTrials images={this.images} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete}/>
    }
    else
    {
      return <div className="container center">Error: Unkown NbackTask section {section_title} in part {this.state.index}</div>
    }
  }
}
