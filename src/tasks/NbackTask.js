import React from 'react';
import '../styles/flnb.css';
//import {NBackTrials} from '../trials/NBackTrials.js';
import {SimpleKeyboardInstructions} from '../instructions/SimpleKeyboardInstructions.js';
import {NBackWelcomeInstructions} from '../instructions/NBackWelcomeInstructions.js';
import AssetLoader from '../loaders/AssetLoader.js';import TitlePage from '../components/TitlePage.js';
import {SimpleInstructions} from '../instructions/SimpleInstructions.js';
import {ZeroBackInstructions} from '../instructions/ZeroBackInstructions.js';
import {OneBackInstructions} from '../instructions/OneBackInstructions.js';
import {TwoBackInstructions} from '../instructions/TwoBackInstructions.js';
import {NBackCountdownInstructions} from '../instructions/NBackCountdownInstructions.js';
import {NBackPracticeFailedInstructions} from '../instructions/NBackPracticeFailedInstructions.js';
import {BeginPage} from '../components/BeginPage.js';
import SubmitPage from '../components/SubmitPage.js';
import NBackTrials from '../trials/NBackTrials.js';
import LNBDemo from '../demos/LNBDemo.js';
import motor_praxis_banner from '../assets/flnb/banner.png';
import arrow from '../assets/flnb/arrow.png';
import arrow_head from '../assets/flnb/arrow_head.png';
import green_arrow from '../assets/flnb/green_arrow.png';
import twoback_arrow from '../assets/flnb/twoback_arrow.png';
import threeback_arrow from '../assets/flnb/three_back_arrow.png';

const ZEROBACK_INSTRUCTIONS_REGEX = /0-Back[ _]Instructions/ig;
const ONEBACK_INSTRUCTIONS_REGEX = /1-Back[ _]Instructions/ig;
const TWOBACK_INSTRUCTIONS_REGEX = /2-Back[ _]Instructions/ig;
const INSTRUCTIONS_REGEX = /Instructions/ig;
const BEGIN_PAGE_REGEX = /Begin[ _](Test|Practice)/ig;
const PRACTICE_REGEX = /Practice$/ig
const TEST_REGEX = /Test$/ig;
const TITLE_PAGE_REGEX = /Title/ig;
const FALSE_POSITIVE_REGEX = /False[ _]Positive/ig;
const FALSE_NEGATIVE_REGEX = /False[ _]Negative/ig;
const COUNTDOWN_REGEX = /Countdown/ig;

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
      starttime: new Date(),
      practice_failed_count: 0
    }
    this.images = [];
    this.image_urls = [];
    this.next = this.next.bind(this);
    this.back = this.back.bind(this);
    this.onPracticeFailed = this.onPracticeFailed.bind(this);
    this.restartPractice = this.restartPractice.bind(this);
    this.finishDemo = this.finishDemo.bind(this);
    this.onPracticeComplete = this.onPracticeComplete.bind(this);
    this.onTrialsComplete = this.onTrialsComplete.bind(this);
    this.skipListener = this.skipListener.bind(this);

    const content = JSON.parse(this.props.timeline[0].content);
    this.continue_button_text = content[0] || 'CLICK HERE TO CONTINUE';
    this.back_button_text = content[1] || 'GO BACK';
    this.spacebar_text = content[2] || 'Press the spacebar to continue';
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
    this.images = images;
    //console.log('Loaded les images ', images);
    this.next();
    /***this.setState((prevState, props) => {
      return {index: 10};
    });*/
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

  canGoBack()
  {
    const index = this.state.index - 1;
    return index > 1 && !this.props.timeline[index].section_title.includes('Demo');;

  }

  back()
  {
    const index = this.state.index - 1;
    if(index > 0)
    {
      this.setState((prevState, props) => {
        return {index: index};
      });
    }
  }

  onPracticeComplete()
  {
    let index = this.state.index;
    let found = false;
    while(!found && index < this.props.timeline.length)
    {
      const timeline_object = this.props.timeline[index];
      if(timeline_object.section_title.match(INSTRUCTIONS_REGEX))
      {
        found = true;
        continue;
      }
      else
      {
        index = index + 1;
      }
    }
    this.setState((prevState, props) => {
      return {index: index, practice_failed_count: 0, feedback: null, practice_type: null};
    });
  }

  onTrialsComplete(responses)
  {
    let updated_responses = this.state.responses.concat(responses);
    this.setState((prevState, props) => {
      return {responses: updated_responses}
    }, this.next);
  }

  onPracticeFailed(reason, practice_type)
  {
    const practice_failed_count = this.state.practice_failed_count + 1;
    if(practice_failed_count >= 3)
    {
      this.onPracticeComplete();
    }
    else
    {
      let index = this.state.index;
      let found = false;
      while(!found && index < this.props.timeline.length)
      {
        const timeline_object = this.props.timeline[index];
        const section_title = timeline_object.section_title;
        if(section_title.includes(reason))
        {
          found = true;
          continue;
        }
        else
        {
          index = index + 1;
        }
      }

      // feedback has been found, now we render the feedback.

      if(found)
      {
        // TO DO: End task after 4 failed practices!

        const feedback = this.props.timeline[index];
        this.setState((prevState, props) => {
          return {feedback: feedback, "practice_type": practice_type, practice_failed_count: practice_failed_count}
        });
      }
    }
  }

  finishDemo()
  {
    let index = this.state.index;
    let found = false;
    while(!found && index > 0)
    {
      const timeline_object = this.props.timeline[index];
      if(timeline_object.section_title.match(BEGIN_PAGE_REGEX))
      {
        found = true;
        continue;
      }
      else
      {
        index = index - 1;
      }
    }
    this.demo = null;
    this.setState((prevState, props) => {
      return {index: index, feedback: null, demo: null, "practice_type": null};
    });
  }

  restartPractice()
  {
    /***const index = this.state.index;
    this.setState((prevState, props) => {
      return {index: index, feedback: null}
    });*/
    // Show demo for NBack.
    const index = this.state.index;
    const timeline_object = this.props.timeline[index];
    const practice_type = this.state.practice_type;
    if(practice_type.includes("1") || practice_type.includes("2"))
    {
      const demo_content_timeline_object = this.props.timeline[index + 3];
      const demo_settings = JSON.parse(demo_content_timeline_object.content);
      //const welcome_timeline_object = ;
      //console.log('Welcome object ', welcome_timeline_object);
      const section_1 = JSON.parse(this.props.timeline[index + 4].content);
      const section_2 = JSON.parse(this.props.timeline[index + 5].content);
      const section_3 = JSON.parse(this.props.timeline[index + 6].content);
      const section_4 = JSON.parse(this.props.timeline[index + 7].content);
      const back_button_text = this.back_button_text;
      const verbose_title = JSON.parse(this.props.timeline[index - 1].content)[0];
      let demo_items = practice_type.includes("1") ? ["Br.png", "Cr.png", "Fr.png", "Gr.png", "Gr.png", "Tr.png", "Mr.png", "Mr.png", "Lr.png", "Nr.png"] : [ "Br.png", "Gr.png", "Fr.png", "Gr.png", "Mr.png", "Tr.png", "Mr.png", "Lr.png", "Mr.png", "Cr.png"];
      if(this.props.test.test.includes("lnb"))
      {
          demo_items = practice_type.includes("1") ? ["B", "C", "F", "G", "G", "T", "M", "M", "L", "N"] : ["B", "G", "F", "G", "M", "T", "M", "L", "M", "C"];
      }
      const base_url = this.props.base_url;
      const demo_object = {
        arrowTitle: 'Image',
        firstArrow: demo_settings[0] || '1st Image',
        lastArrow: demo_settings[1] || 'Last Image',
        press: demo_settings[2] || 'PRESS',
        quit: back_button_text,
        quitMessage: demo_settings[4] || 'Skip training movie and return to practice',
        //quit: demo_settings[3] || ('Skip ' + (practice_type.includes("1") ? '1-Back' : '2-Back') + ' Movie'),
        pressArrow: green_arrow,
        nbackArrow: practice_type.includes("1") ? arrow_head : twoback_arrow,
        arrow: arrow,
        title: practice_type.includes("1") ? '1-BACK' : '2-BACK',
        verbose_title: verbose_title ? verbose_title : (practice_type.includes("1") ? '1-BACK' : '2-BACK'),
        base_url: base_url,
        items: demo_items,
        answers:practice_type.includes("1") ?[ 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0] : [ 0,  0,   0,   1,   0,   0,   1 ,  0,   1,  0],
        next: 'continue',
        welcome: section_1,
        duringTheDemo: section_2,
        window: section_3,
        finish: section_4
      }
      this.demo = demo_object;
      this.setState((prevState, props) => {
        return {demo: true}
      });
    }
    else {
      const index = this.state.index - 2;
      this.setState((prevState, props) => {
        return {demo: false, feedback: null, index: index, practice_type: null}
      });
    }
  }

  /***console.log('Next section has title ', section_title);
  console.log('images be ', this.state.image_urls);
  console.log('Feedback now is ', feedback);*/

  /***
  {feedback.section_title.match(FALSE_POSITIVE_REGEX) && <CPTFalsePositiveInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} />}
  {feedback.section_title.match(FALSE_NEGATIVE_REGEX) && <CPTFalseNegativeInstructions instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} />}


  /***else if(section_title.match(PRACTICE_REGEX))
  {
    return <NBackTrials images={this.images} trials={this.props.practice_trials} practice={true} onPracticeComplete={this.onPracticeComplete} onPracticeFailed={this.onPracticeFailed}/>
  }
  else if(section_title.match(TEST_REGEX))
  {
    return <NBackTrials images={this.images} trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete}/>
  }
  */


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
      const test = this.props.test;
    if(this.state.demo)
    {
      return <LNBDemo test={test.test} response_device={test.response_device || 'keyboard'} base_url={this.props.base_url} onContinue={this.finishDemo} skipPractice={this.finishDemo} content={this.demo} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(feedback)
    {
        return <NBackPracticeFailedInstructions test={test.test} response_device={test.response_device} instructions={JSON.parse(feedback.content)} onContinue={this.restartPractice} practice_type={this.state.practice_type} spacebar_text={this.spacebar_text} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} />
    }
    else if(index === 0)
    {
      /// Also set the text for continue, go back etc.
      return <div className="container center"><AssetLoader base_url={this.props.base_url} stimulus_dir="flnb" practice_trials={this.props.practice_trials} test_trials={this.props.test_trials} onAssetsLoadComplete={(e) => this.onAssetsLoadComplete(e)} /></div>
    }
    else if(index === 2)
    {
      return <NBackWelcomeInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next}  continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(TITLE_PAGE_REGEX))
    {
      return <TitlePage content={JSON.parse(timeline_object.content)} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} banner={motor_praxis_banner} onClick={this.next} {...this.props.test}/>
    }
    else if(section_title.match(BEGIN_PAGE_REGEX))
    {
      return <BeginPage title={JSON.parse(timeline_object.content)[0]} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} onContinue={this.next} onGoBack={this.back}/>
    }
    else if(section_title.match(ZEROBACK_INSTRUCTIONS_REGEX))
    {
      return <ZeroBackInstructions test={test.test} instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(ONEBACK_INSTRUCTIONS_REGEX))
    {
      return <OneBackInstructions test={test.test} instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(TWOBACK_INSTRUCTIONS_REGEX))
    {
      return <TwoBackInstructions test={test.test} instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text}/>
    }
    else if(section_title.match(INSTRUCTIONS_REGEX))
    {
        return <SimpleInstructions instructions={JSON.parse(timeline_object.content)} onContinue={this.next} onGoBack={this.back} hideGoBack={!this.canGoBack()} continue_button_text={this.continue_button_text} back_button_text={this.back_button_text} instructions_class="instructions-text--small"/>
    }
    else if(section_title.match(COUNTDOWN_REGEX))
    {
      return <NBackCountdownInstructions seconds={6} response_device={test.response_device || 'keyboard'} callback={this.next} title={section_title} test={test.test} instructions={JSON.parse(timeline_object.content)} />
    }
    else if(section_title.match(PRACTICE_REGEX))
    {
      return <NBackTrials test={test.test} id={Math.floor(10000*Math.random())} base_url={this.props.base_url} images={this.images} section_type={JSON.parse(timeline_object.content)[0]} trials={this.props.practice_trials} practice={true} onPracticeComplete={this.onPracticeComplete} onPracticeFailed={this.onPracticeFailed}/>
    }
    else if(section_title.match(TEST_REGEX))
    {
      return <NBackTrials test={test.test} base_url={this.props.base_url} images={this.images} section_type={JSON.parse(timeline_object.content)[0]}  trials={this.props.test_trials} onTrialsComplete={this.onTrialsComplete}/>
    }
    else
    {
      return <div className="container center">Error: Unkown NbackTask section {section_title} in part {this.state.index}</div>
    }
  }
}
