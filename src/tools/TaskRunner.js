import React, {useState, useEffect} from 'react';
import '../styles/common.css';
import MotorPraxisTask from '../tasks/MotorPraxisTask.js';
import CPT from '../tasks/CPT.js';
import TAP from '../tasks/TAP.js';
import CPF from '../tasks/CPF.js';
import SVOLT from '../tasks/SVOLT.js';
import ER40 from '../tasks/ER40.js';
import NbackTask from '../tasks/NbackTask.js';
import Digsym from '../tasks/Digsym.js';
import PLLT from '../tasks/PLLT.js';
import {TestLoader} from '../loaders/TestLoader.js';

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

  render()
  {
    const task = this.state.task;
    const test = this.state.test;
    const timeline = this.state.timeline;
    const trials = this.state.trials;

    if(task === "")
    {
      return <TestLoader base_url={this.props.base_url} onLoad={(e) => {this.onTaskLoaded(e);}} onError={(e) => {this.onTaskLoadError(e);}} />
    }
    else if(task === "timeline" && test.test.includes("praxis"))
    {
      return <div className="container-8-by-6  dark frame">
      <MotorPraxisTask base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} test_trials={this.state.test_trials} />
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
      return <div className="container-8-by-6  dark frame">
      <PLLT base_url={this.props.base_url} timeline={timeline} test={test} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("svolt"))
    {
      return <div className="container-8-by-6  light frame">
      <SVOLT base_url={this.props.base_url} timeline={timeline} test={test} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline" && test.test.includes("er40"))
    {
      return <div className="container-8-by-6  light frame">
      <ER40 base_url={this.props.base_url} timeline={timeline} test={test} practice_trials={this.state.practice_trials} slideshow={this.state.slideshow} test_trials={this.state.test_trials} />
      </div>
    }
    else if(task === "timeline")
    {
      return <div className="container-8-by-6  dark frame">
      <h2>Unkown test {test.test} with title {test.title}</h2>
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
