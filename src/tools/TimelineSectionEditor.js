import React, {useEffect, useState} from 'react';
import axios from 'axios';
const FormData = require('form-data');
//const fs = require('fs');

/****const LANGUAGES = [{"option": "", "text":"Please select language"}, {"option": "he_IL", "text": "Hebrew"}, {"option": "bg_BG", "text": "Bulgarian"},
{"option": "nl_NL", "text": "Dutch (Netherlands)"}, {"option": "ar_EG", "text": "Arabic (Egypt)"}, {"option": "zh_CN", "text": "Simplified Chinese"},
{"option": "it_IT", "text": "Italian"}, {"option": "po_BR", "text": "What is po_BR language?"}, {"option": "de_DE", "text": "German"}, {"option": "es_ES", "text": "Spanish (Spain)"},
{"option": "fr_CA", "text": "French (Canada)"}, {"option": "pt_BR", "text": "Portuguese (Brazil)"}, {"option": "es_MX", "text": "Spanish (Mexico)"},
{"option": "hi_MK", "text": "What is hi_MK language?"}, {"option": "ja_JA", "text": "Japanese"}, {"option": "ru_MK", "text": "What language is ru_MK"},
{"option": "xh_SA", "text": "IsiXhosa"}, {"option": "tn_BW", "text": "Setswana (Botswana)"}, {"option": "pt_MZ", "text": "What is pt_MZ language?"},
{"option": "zn_CN", "text": "What is zn_CN language?"}];*/

//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TimelineSectionEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      data: null,
      language: props.language || null,
      languages: null
    }

    this.loadLanguages = this.loadLanguages.bind(this);
    this.viewSectionTranslation = this.viewSectionTranslation.bind(this);
    this.onTranslate = this.onTranslate.bind(this);
    this.saveSectionTranslation = this.saveSectionTranslation.bind(this);
    this.onLanguageSelected = this.onLanguageSelected.bind(this);
    this.onTranslationFileInput = this.onTranslationFileInput.bind(this);
  }

  componentDidMount()
  {
    this.viewSectionTranslation();
    this.loadLanguages();
  }

  componentWillUnmount()
  {
    this.state = {
      data:null
    };
  }

  loadLanguages()
  {
    axios.post(this.props.base_url + 'languages.pl', {'op': 'view'})
    .then(response => {
      console.log('response ', response.data.languages);
      this.setState((prevState, props) => {
        return {languages: response.data.languages}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  viewSectionTranslation()
  {
    const language = this.state.language;
    if(!language)
    {
      return;
    }
    this.props.updateLanguage(language);
    const id = this.props.id;
    axios.post(this.props.base_url + 'translate.pl', {'op': 'view', 'id': id, 'language': language ? language : 'en_US'})
    .then(response => {
      //console.log('response ', JSON.parse(response.data.section_text[0].content));
      //let content = response.data.section_data.length > 0 ? JSON.parse(response.data.section_data[0].content) : new Array();
      const section_data = response.data.section_data;
      let content = [];


      if(section_data.length > 0)
      {
        content = JSON.parse(section_data[0].content);
        console.log('Translated content be ', section_data[0].content);
      }
      let diff = this.props.count - content.length;
      while(diff > 0)
      {
        content.push("");
        diff--;
      }
      this.setData(content);

    })
    .catch(error => {console.log('Error ', error)});
  }

  saveSectionTranslation()
  {
    //const translation = this.state.translation_data;
    //console.log('loading section ', section, ' via api');
    const id = this.props.id;
    const language = this.props.language;
    const translation = this.state.data;
    axios.post(this.props.base_url + 'translate.pl', {'op': 'save', 'id': id, 'language': language, 'section_number': this.props.section_number, "translation": translation})
    .then(response => {
      console.log('response ', response.data);
    })
    .catch(error => {console.log('Error ', error)});

  }

  setData(data)
  {
    this.setState((prevState, props) => {
      return {data: data}
    });
  }

  onLanguageSelected(evt)
  {
    const language = evt.target.value;
    this.setState((prevState, props) => {
        return {language: language}
    }, this.viewSectionTranslation);
  }

  onTranslate(evt, index)
  {
    let updated_data = this.state.data;
    const value = evt.target.value;

    updated_data[index] = value;
    this.setData(updated_data);
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
      //this.viewSectionTranslation();
    })
    .catch(error => {
      console.log("File upload failed ", error);
    });
  }

  render()
  {
    const data = this.state.data;
    const selected_language = this.state.language ? this.state.language : "";
    let langue_selection = [];
    if(this.state.languages)
    {
      langue_selection = this.state.languages.map((language, index) => {
        return <option key={language.iso_code} value={language.title}>{language.text + ' ' + language.iso_code}</option>
      });
    }

    return data ?
    (
      <>
      <div><p>{this.props.title.replaceAll("_", " ")}</p></div>
      <select value={selected_language} onChange = {(e) => {this.onLanguageSelected(e);}}>{langue_selection}</select>
      {selected_language && <div><p>Upload translation <input type="file" onChange={this.onTranslationFileInput}/></p></div> }
      <table className="translate right">
      <tbody>
      {data.map((item, index) => {
        return <tr key={index}><td><textarea placeholder="Please enter translation." value={item} onChange={(e) => this.onTranslate(e, index)}></textarea></td></tr>
      })}
      </tbody>
      </table>
      <div><button onClick={this.saveSectionTranslation}>Save</button></div>
      </>
    )
    :
    <>
    <select onChange = {(e) => {this.onLanguageSelected(e);}}>{langue_selection}</select>
    {selected_language && <div><p>Upload translation <input type="file" onChange={this.onTranslationFileInput}/></p></div> }
    {this.state.language && <p>Loading ...</p>}
    {!this.state.language && <p>Please select a language to get started</p>}
    </>
  }
}
