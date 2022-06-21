import '../App.css';
import '../Admin.css';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {TestVersionEditor} from './TestVersionEditor.js';
import {TimelineView} from './TimelineView.js';
import {TranslationView} from './TranslationView.js';
import TaskTranslator from './TaskTranslator.js';
import {TestTrialsEditor} from './TestTrialsEditor.js';
const FormData = require('form-data');

/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
const BASE_URL = "http://localhost/"; // "https://penncnp-dev.pmacs.upenn.edu/";
export class TestVersionsEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: null,
      selected_test_version: null,
      current_view: null,
    }

    this.onTestVersionSelected = this.onTestVersionSelected.bind(this);
    this.loadTimeline = this.loadTimeline.bind(this);
    this.newTestVersion = this.newTestVersion.bind(this);
    this.loadTrials = this.loadTrials.bind(this);
  }

  componentDidMount()
  {
    document.title = `CNB Test Versions Manager.`;
    this.viewTestVersions();
  }

  componentWillUnmount()
  {
    this.state = {
      data:null
    };
  }

  viewTestVersions()
  {
    axios.post(BASE_URL + 'tests.pl', {'op': 'vtv'})
    .then(response => {
      //console.log('response ', JSON.parse(response.data.section_text[0].content));
      //let content = response.data.section_data.length > 0 ? JSON.parse(response.data.section_data[0].content) : new Array();
      const test_versions_data = response.data.test_versions_data;
      this.setData(test_versions_data);

    })
    .catch(error => {console.log('Error ', error)});
  }

  onTestVersionSelected(evt, selected_id)
  {
    const test_versions = this.state.data;

    const test_version = test_versions.find( ({ id }) => id === selected_id);
    console.log('search for ', selected_id, ' returned ', test_version);
    this.setTestVersion(test_version);

  }

  setData(data)
  {
    this.setState((prevState, props) => {
      return {data: data}
    });
  }

  setTestVersion(test_version)
  {
    this.setState((prevState, props) => {
      return {selected_test_version: test_version, current_view: "test"}
    });
  }

  newTestVersion()
  {
    this.setState((prevState, props) => {
      return {selected_test_version: {id: null, short_name: '', title: '', form: ''}, current_view: "test"}
    });
  }

  loadTimeline(event)
  {
    this.setState((prevState, props) => {
      return {current_view: "timeline"}
    });
  }

  loadTranslator(event)
  {
    this.setState((prevState, props) => {
      return {current_view: "translate"}
    });
  }

  loadTrials(event)
  {
    this.setState((prevState, props) => {
      return {current_view: "trials"}
    });
  }

  render()
  {

    const data = this.state.data;
////{current_view === "translate" && <TaskTranslator id={content.id} />}
    const menu = data ? data.map((test_version, index) => {
      return <li key={index + 200} className="menu-item" onClick={(e) => this.onTestVersionSelected(e, test_version.id)}><a href="#">{test_version.title}</a></li>
    }) : null;
    const content = this.state.selected_test_version;
    const current_view  = this.state.current_view;
    return (
      <>
      <nav className="menu">
    <header>Current test versions</header>
    <ul>
    {menu}
    </ul>
    </nav>

      <div className="admin-area">
      <div className="header">
      <header>Test Versions Admin {content && ' : ' + content.title}</header>
      <div className="submenu">
      <button onClick={this.newTestVersion}>New test version</button>
      <button onClick={(e) => this.loadTrials(e)}>Trials</button>
      <button onClick={(e) => this.loadTimeline(e)}>Timeline</button>
      <button onClick={(e) => this.loadTranslator(e)}>Translations</button>
      </div>
      </div>

      <div className="main">

      <div className="nav left">
      <nav>

      </nav>
      </div>

      <div className="main-content">

      <div className="test_version-editor">
        {!current_view && <p>Please select a test version to get started.</p>}
        {current_view === "test" && content && <TestVersionEditor {...content} key={Math.round(1000*Math.random())}/>}
        {current_view === "timeline" && <TimelineView id={content.id} />}

        {current_view === "translate" && content && <TranslationView id={content.id} />}
        {current_view === "trials" && content && <TestTrialsEditor id={content.id} />}
        </div>
      </div>

      </div>

      </div>
      </>
    )
  }
}
