import React, {useEffect, useState} from 'react';
import axios from 'axios';
const FormData = require('form-data');
//const fs = require('fs');

//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//c//onst BASE_URL = "http://localhost/";
const LANGUAGES = [{"option": "", "text":"Please select language"}, {"option": "he_IL", "text": "Hebrew"}, {"option": "bg_BG", "text": "Bulgarian"},
{"option": "nl_NL", "text": "Dutch (Netherlands)"}, {"option": "ar_EG", "text": "Arabic (Egypt)"}, {"option": "zh_CN", "text": "Simplified Chinese"},
{"option": "po_BR", "text": "What is po_BR language?"}, {"option": "de_DE", "text": "German"}, {"option": "es_ES", "text": "Spanish (Spain)"},
{"option": "fr_CA", "text": "French (Canada)"}, {"option": "pt_BR", "text": "Portuguese (Brazil)"}, {"option": "es_MX", "text": "Spanish (Mexico)"},
{"option": "hi_MK", "text": "What is hi_MK language?"}, {"option": "ja_JA", "text": "Japanese"}, {"option": "ru_MK", "text": "What language is ru_MK"},
{"option": "xh_SA", "text": "IsiXhosa"}, {"option": "tn_BW", "text": "Setswana (Botswana)"}, {"option": "pt_MZ", "text": "What is pt_MZ language?"},
{"option": "zn_CN", "text": "What is zn_CN language?"}];


/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TestTrialsEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: null,
    }

    this.viewTrials = this.viewTrials.bind(this);
    this.onTrialsFileInput = this.onTrialsFileInput.bind(this);
  }

  componentDidMount()
  {
    this.viewTrials();
  }

  componentWillUnmount()
  {
    this.state = {
      data:null
    };
  }

  viewTrials()
  {
    // view_trials
    const id = this.props.id;
    axios.post(this.props.base_url + 'tests.pl', {'op': 'view_trials', 'id': id})
    .then(response => {
      //console.log('response ', JSON.parse(response.data.section_text[0].content));
      console.log('response ', response.data);
      //let content = response.data.trial_data.length > 0 ? JSON.parse(response.data.trial_data[0].content) : new Array();
      const trial_data = response.data.trials;
      this.setData(trial_data);

    })
    .catch(error => {console.log('Error ', error)});
  }

  setData(data)
  {
    this.setState((prevState, props) => {
      return {data: data}
    });
  }

  onTrialsFileInput(evt)
  {
    const file = evt.target.files[0];
    console.log('given translation file ', file);
    const data = new FormData();
    data.append('op', 'upload_trials');
    data.append('id', this.props.id);
    data.append('file', file);
    console.log('sending file ', data);
    axios.post(this.props.base_url + "tests.pl", data)
    .then(response => {
      console.log("Response is ", response);
      this.viewTrials();
    })
    .catch(error => {
      console.log("File upload failed ", error);
    });
  }

  render()
  {
    const data = this.state.data;
    return data && data.length > 0?
    (
      <>
      <table className="trials-view">
      <thead>
      <tr>
      <td>Question number</td>
      <td>Stimulus</td>
      <td>Trial type</td>
      <td>Responses (if any)</td>
      </tr>
      </thead>
      <tbody>
      {data.map((trial, index) => {
        return <tr key={index + 200}>
        <td>{trial.question_number}</td>
        <td>{trial.stimulus}</td>
        <td>{trial.trial_type}</td>
        <td>{trial.responses}</td>
        </tr>
      })}
      </tbody>
      </table>
      </>
    )
    :
    <>
    <p>This test version has no trials. Please upload test trials.</p>
    <input type="file" onChange={this.onTrialsFileInput} />
    </>
  }
}
