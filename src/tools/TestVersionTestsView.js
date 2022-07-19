import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {TimelineSection} from './TimelineSection.js';
//const fs = require('fs');


//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
/****const LANGUAGES = [{"option": "", "text":"Please select language (defaults to English)"},  {"option": "da_DA", "text": "Danish"}, {"option": "he_IL", "text": "Hebrew"}, {"option": "bg_BG", "text": "Bulgarian"},
{"option": "nl_NL", "text": "Dutch (Netherlands)"}, {"option": "ar_EG", "text": "Arabic (Egypt)"}, {"option": "zh_CN", "text": "Simplified Chinese"},
{"option": "it_IT", "text": "Italian"}, {"option": "po_BR", "text": "What is po_BR language?"}, {"option": "de_DE", "text": "German"}, {"option": "es_ES", "text": "Spanish (Spain)"},
{"option": "fr_CA", "text": "French (Canada)"}, {"option": "pt_BR", "text": "Portuguese (Brazil)"}, {"option": "es_MX", "text": "Spanish (Mexico)"},
{"option": "hi_MK", "text": "What is hi_MK language?"}, {"option": "ja_JA", "text": "Japanese"}, {"option": "ru_MK", "text": "What language is ru_MK"},
{"option": "xh_SA", "text": "IsiXhosa"}, {"option": "tn_BW", "text": "Setswana (Botswana)"}, {"option": "pt_MZ", "text": "What is pt_MZ language?"},
{"option": "zn_CN", "text": "What is zn_CN language?"}, {"option": "kr_KR", "text": "Korean"}];*/

/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TestVersionTestsView extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      id: props.id || null,
      short_name: props.short_name,
      tests: null,
      possible_tests: [],
      languages: [],
      message: null,
      error_message: null
    }
    this.loadTests.bind(this);
    this.loadLanguages = this.loadLanguages.bind(this);
    this.loadPossibleTests = this.loadPossibleTests.bind(this);
    this.removeTestVersionTest = this.removeTestVersionTest.bind(this);
  }

  componentDidMount()
  {
    console.log('given props ', this.props);
    this.loadTests();
    this.loadLanguages();
  }

  loadTests()
  {
    axios.post(this.props.base_url + 'tests.pl', {'op': 'view_tests', 'id': this.props.id})
    .then(response => {
      console.log('response ', response.data.tests);
      this.setData(response.data);
    })
    .catch(error => {
      console.log('Error ', error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to load test version tests because " + error, message: null}
      });
      // No timeline found for this test.
      this.setData([]);
    });
  }

  removeTestVersionTest(e, test)
  {
    axios.post(this.props.base_url + 'tests.pl', {'op': 'remove_test_version_test', 'short_name': test})
    .then(response => {
      console.log('response ', response.data.message);
      this.setState((prevState, props) => {
        return {message: response.data.message, error_message: null}
      }, this.loadTests);
    })
    .catch(error => {
      console.log('Error ', error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to load possible test version tests because " + error}
      });
      // No timeline found for this test.
      //this.setData([]);

    });
  }

  loadPossibleTests()
  {
    axios.post(this.props.base_url + 'tests.pl', {'op': 'view_possible_tests', 'short_name': this.props.short_name})
    .then(response => {
      console.log('possible_tests ', response.data.tests);
      this.setState((prevState, props) => {
        return {possible_tests: response.data.tests}
      });
    })
    .catch(error => {
      console.log('Error ', error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to load possible test version tests because " + error, message: null}
      });
      // No timeline found for this test.
      //this.setData([]);

    });
  }

  loadLanguages()
  {
    axios.post(this.props.base_url + 'languages.pl', {'op': 'view'})
    .then(response => {
      console.log('response ', response.data.timeline);
      this.setState((prevState, props) => {
        return {languages: response.data.languages}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  setData(data)
  {
    this.setState((prevState, props) => {
      return {tests: data.tests}
    }, this.loadPossibleTests);
  }

  render()
  {
    const tests = this.state.tests;
    const possible_tests = this.state.possible_tests;
    const languages = this.state.languages;

    const add_tests_content = (
      <>
      <p>Please select test and language to associate test with current test definition.</p>
      <table>
      <tbody>
      <tr>
      <td>
      <span>Click </span> <button> + </button> <span> to add </span>
      <select>
      {possible_tests.map((item, index) => {
          console.log('Given possible_test ', item);
        return (<option>{item.title + ' (' + item.test + ')'}</option>)
       })}
       </select>
       <span> test in </span>
       <select>
       {languages.map((item, index) => {
           console.log('Given possible_test ', item);
         return (<option>{item.title || item.iso_code}</option>)
        })}
       </select>
       <span> language</span>
       </td>
       <td>

       </td>
       </tr>
      </tbody>
      </table>
      </>
    )

    return (
      tests && tests.length > 0 ?

      <>
      <p className="red">{this.state.error_message && this.state.error_message}</p>
      <p className="info">{this.state.message && this.state.message}</p>
      {add_tests_content}
      <table className="translation-view">
      <tbody>
      <tr>
      <td>Title</td>
      <td>Test code</td>
      <td>Language</td>
      <td></td>
      </tr>
      {tests.map((item, index) => {
          //console.log('Given test ', item);
        return (<>
          <tr>
            <td>{item.title}</td>
            <td>{item.test}</td>
            <td>{item.lang}</td>
            <td><button className="button" onClick={(e) => this.removeTestVersionTest(e, item.test)}>Remove</button></td>
          </tr>
          </>)
       })}
      </tbody>
      </table>
      </>

      :

      tests && tests.length < 1 ?
      <>
      <p>This test version does not have any tests associated with it.</p>
      {add_tests_content}
      </>

      :
      <p>Loading test version tests, please wait ....</p>

    )
  }
}
