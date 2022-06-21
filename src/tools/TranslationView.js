import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {TimelineSection} from './TimelineSection.js';
//const fs = require('fs');


//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
const LANGUAGES = [{"option": "", "text":"Please select language (defaults to English)"}, {"option": "he_IL", "text": "Hebrew"}, {"option": "bg_BG", "text": "Bulgarian"},
{"option": "nl_NL", "text": "Dutch (Netherlands)"}, {"option": "ar_EG", "text": "Arabic (Egypt)"}, {"option": "zh_CN", "text": "Simplified Chinese"},
{"option": "it_IT", "text": "Italian"}, {"option": "po_BR", "text": "What is po_BR language?"}, {"option": "de_DE", "text": "German"}, {"option": "es_ES", "text": "Spanish (Spain)"},
{"option": "fr_CA", "text": "French (Canada)"}, {"option": "pt_BR", "text": "Portuguese (Brazil)"}, {"option": "es_MX", "text": "Spanish (Mexico)"},
{"option": "hi_MK", "text": "What is hi_MK language?"}, {"option": "ja_JA", "text": "Japanese"}, {"option": "ru_MK", "text": "What language is ru_MK"},
{"option": "xh_SA", "text": "IsiXhosa"}, {"option": "tn_BW", "text": "Setswana (Botswana)"}, {"option": "pt_MZ", "text": "What is pt_MZ language?"},
{"option": "zn_CN", "text": "What is zn_CN language?"}, {"option": "kr_KR", "text": "Korean"}];

/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TranslationView extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      timeline: null,
      language: props.language || "en_US",
      translation: null
    }
    this.viewTimeline = this.viewTimeline.bind(this);
    this.viewTranslation = this.viewTranslation.bind(this);
    this.onTranslationFileInput = this.onTranslationFileInput.bind(this);


  }

  componentDidMount()
  {
    console.log('given props ', this.props);
    this.viewTimeline();
  }

  viewTimeline()
  {
    axios.post(this.props.base_url + 'tests.pl', {'op': 'timeline', 'id': this.props.id})
    .then(response => {
      console.log('response ', response.data.timeline);
      this.setData(response.data);
    })
    .catch(error => {
      console.log('Error ', error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to load timeline because " + error}
      });
      // No timeline found for this test.
      this.setData([]);
    });
  }

  viewTranslation()
  {
    axios.post(this.props.base_url + 'tests.pl', {'op': 'timeline', 'id': this.props.id, 'language': this.state.language})
    .then(response => {
      console.log('translation response ', response.data.timeline);
      this.setTranslationData(response.data);
    })
    .catch(error => {
      console.log('Error ', error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to load translation because " + error}
      });
      // No timeline found for this test.
      this.setTranslationData([]);
    });
  }

  componentWillUnmount()
  {
  }

  setData(data)
  {
    this.setState((prevState, props) => {
      return {timeline: data.timeline}
    });
  }

  setTranslationData(data)
  {
    this.setState((prevState, props) => {
      return {translation: data.timeline}
    });
  }

  onLanguageSelected(evt)
  {
    const language = evt.target.value;
    this.setState((prevState, props) => {
        return {language: language}
    }, this.viewTranslation);
  }

  onTranslationFileInput(evt)
  {
    const file = evt.target.files[0];
    console.log('given translation file ', file);
    const data = new FormData();
    data.append('op', 'upload_timeline');
    data.append('id', this.props.id);
    data.append('language', this.state.language);
    data.append('file', file);
    console.log('sending file ', data);
    axios.post(this.props.base_url + "translate.pl", data)
    .then(response => {
      console.log("Response is ", response);
      this.viewTranslation();
    })
    .catch(error => {
      console.log("File upload failed ", error);
      this.setState((prevState, props) => {
        return {error_message: "Failed to upload file because " + error}
      });
    });
  }

  render()
  {
    const timeline = this.state.timeline;
    const translation = this.state.translation;

    const selected_language = this.state.language ? this.state.language : "";
    const langue_selection = LANGUAGES.map((language, index) => {
      return <option key={language.option} value={language.option}>{language.text}</option>
    });

    console.log('timeline rendering ', timeline);

    return (
      timeline && timeline.length > 0 ?

      <>
      <p>{this.state.error_message && this.state.error_message}</p>
      {translation && translation.length < 1  && <p>This task has no translations in the given language. Please upload translations. <input type="file" onChange={this.onTranslationFileInput}/></p>}
      <table className="translation-view">
      <tbody>
      <tr>
      <td>English</td>
      <td><select className="language-select" value={selected_language} onChange = {(e) => {this.onLanguageSelected(e);}}>{langue_selection}</select></td>
      </tr>
      {timeline.map((item, index) => {
          console.log('Item be ', item);
          const content = JSON.parse(item.content);
          const translation_content = translation && translation.length > 0 ? JSON.parse(translation[index].content) : [];
        return (<>
          <tr key={index*10 + 1}><td colSpan={2}><h4 className="text--center">{item.section_title.replaceAll('_', ' ')}</h4></td></tr>
          <tr>
            <td>{content.map((x, i) => {return <p key={index*1000 + 1 + i}>{x}</p>})}</td>
            <td>{translation_content && translation_content.map((x, i) => {return <p key={index*2000 + 1 + i}>{x}</p>})}</td>
          </tr>
          </>)
       })}
      </tbody>
      </table>
      </>

      :

      timeline && timeline.length < 1 ?
      <>
      <p>This test does not have a timeline.</p>
      <p>Please upload timeline before adding translations.</p>
      </>

      :
      <p>Loading translations, please wait ....</p>

    )
  }
}
