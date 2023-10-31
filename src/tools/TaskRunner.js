import React, {useState, useEffect} from 'react';
import '../styles/common.css';
import MotorPraxisTask from '../tasks/MotorPraxisTask.js';
import CPT from '../tasks/CPT.js';
import CPTChild from '../tasks/CPTChild.js';
import TAP from '../tasks/TAP.js';
import CPF from '../tasks/CPF.js';
import SVOLT from '../tasks/SVOLT.js';
import ER40 from '../tasks/ER40.js';
import Disc from '../tasks/Disc.js';
import ER40Child from '../tasks/ER40Child.js';
import NbackTask from '../tasks/NbackTask.js';
import Digsym from '../tasks/Digsym.js';
import CPW from '../tasks/CPW.js';
import PLLT from '../tasks/PLLT.js';
import STROOP from '../tasks/STROOP.js';
import PCET from '../tasks/PCET.js';
import PMAT from '../tasks/PMAT.js';
import GNG from '../tasks/GNG.js';
import ADT from '../tasks/ADT.js';
import MEDF from '../tasks/MEDF.js';
import VSPLOT from '../tasks/VSPLOT.js';
import {TestLoader} from '../loaders/TestLoader.js';
import SubmitPage from '../components/SubmitPage.js';

export default class TaskRunner extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      task: "",
      message: "",
      test: null,
      timeline: null,
      trials: null,
      slideshow: null
    }
    this.timeline = [];
    this.test_info = null;
      document.body.classList.add('dark');
      this.skipListener = this.skipListener.bind(this);
  }
    /***
* Handler for overral key presses.
* Specifically checks for skip command.
* TO DO: Add beep for invalid key presses.
*/
    skipListener(e) {
        // Check for skip command for cnb tests cmd . on mac or ctrl . on others.
        if ((e.metaKey || e.ctrlKey) && e.keyCode === 190) {
            console.log("skip task", new Date());
            e.stopPropagation();
            this.skipTest();
        }
    }

    skipTest() {
        this.setState((prevState, props) => {
            return { assessment_complete: true, skipped: 1 };
        });
    }

  onTaskLoaded(data)
  {
    const timeline = data.timeline;
    //console.log('Loaded timeline ', timeline);
    const test = data.test;
    //console.log('Loaded test ', test);
    const practice_trials = data.practice_trials;
    const test_trials = data.test_trials;
    //console.log('Loaded practice_trials ', practice_trials);
    //console.log('Loaded test_trials ', test_trials);
    this.setState((prevState, props) => {
      return {task: "timeline", test: test, timeline: timeline, practice_trials: practice_trials, test_trials: test_trials, slideshow: data.slideshow}
    });
  }

  onTaskLoadError(e)
  {
    this.setState((prevState, props) => {
      return {task: "error", message: e}
    });
  }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.skipListener, false);
    }

    componentDidMount() {
        window.addEventListener("keydown", this.skipListener, false);
    }

  render()
  {
    const task = this.state.task;
    const test = this.state.test;
    const timeline = this.state.timeline;
    const trials = this.state.trials;
      if (this.state.assessment_complete) {
          return <SubmitPage test={test.test} skipped={1} starttime={new Date()}/>
     }
    else if(task === "")
    {
      return <TestLoader base_url={this.props.base_url} assessment_url={this.props.assessment_url} onLoad={(e) => {this.onTaskLoaded(e);}} onError={(e) => {this.onTaskLoadError(e);}} />
    }
    else if(task === "timeline" && test.test.includes("praxis"))
    {
      return <div className="container-8-by-6  dark frame">
      <MotorPraxisTask base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("cpt-preschool-b"))
    {
      return <div className="container-8-by-6  dark frame">
      <CPTChild form={"b"} base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("cpt-preschool"))
    {
      return <div className="container-8-by-6  dark frame">
      <CPTChild form={"a"} base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("cpt"))
    {
      return <div className="container-8-by-6  dark frame">
      <CPT base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("tap"))
    {
      return <div className="container-8-by-6  dark frame">
      <TAP base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("cpf"))
    {
      return <div className="container-8-by-6  dark frame">
      <CPF base_url={this.props.base_url} timeline={timeline} test={test} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("sfnb"))
    {
      return <div className="container-8-by-6  dark frame">
      <NbackTask base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("digsym"))
    {
      return <div className="container-8-by-6  dark frame">
      <Digsym base_url={this.props.base_url} timeline={timeline} test={test} slideshow={this.state.slideshow} test_trials={this.state.test_trials} practice_trials={this.state.practice_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("pllt"))
    {
      let form = null;
      let language = null;
      if(test.test.includes("de_DE") && test.test.includes("pllt-c")){
        form = "c";
        language = "de_DE";
      }
      return <div className="container-8-by-6  dark frame">
      <PLLT base_url={this.props.base_url} form={form} language={language} timeline={timeline} test={test} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("svolt"))
    {
      return <div className="container-8-by-6  light frame">
      <SVOLT base_url={this.props.base_url} timeline={timeline} test={test} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("er40-d-preschool"))
    {
      return <div className="container-8-by-6  light frame">
      <ER40Child base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("er40"))
    {
      return <div className="container-8-by-6  light frame">
      <ER40 base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("disc"))
    {
      return <div className="container-8-by-6  light frame">
      <Disc base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("cpw"))
    {
      return <div className="container-8-by-6  dark frame">
      <CPW base_url={this.props.base_url} timeline={timeline} test={test} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("stroop"))
    {
      return <div className="container-8-by-6  dark frame">
      <STROOP base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("k-pcet"))
    {
      return <div className="container-8-by-6  dark frame">
      <PCET base_url={this.props.base_url} timeline={timeline} test={test} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("pmat24"))
    {
      return <div className="container-8-by-6  light frame">
      <PMAT base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("gng150"))
    {
      return <div className="container-8-by-6  dark frame">
      <GNG base_url={this.props.base_url} timeline={timeline} test={test} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("adt36-a"))
    {
      return <div className="container-8-by-6  light frame">
      <ADT base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("medf36-a"))
    {
      return <div className="container-8-by-6  light frame">
      <MEDF base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("vsplot24"))
    {
      return <div className="container-8-by-6  dark frame">
      <VSPLOT base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline")
    {
      return <div className="container-8-by-6  dark frame">
          <h2>{test.test} is not supported in this version.</h2>
          <p>Please skip the test to continue.</p>
      </div>
    }
    else if(task === "error")
    {
      return <p>{this.state.message}</p>;
    }
    else if(task.match("praxis"))
    {
      return <MotorPraxisTask timeline={this.timeline} test_info={this.test_info} />
    }
    else
    {
      return <p>Load a task here</p>;
    }
  }
}
