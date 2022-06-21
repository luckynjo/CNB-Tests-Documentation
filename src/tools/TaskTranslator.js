import React, {useEffect, useState} from 'react';
import {TimelineSection} from './TimelineSection.js';
import {TimelineSectionEditor} from './TimelineSectionEditor.js';
//import SectionBuilder from '../tools/SectionBuilder.js';
import axios from 'axios';

// Builds a section of a test.
// A section of a test is defined as follows:
// title for the section each predefined by developers [Simple instructions, complex instructions, header page (begin practice, begin slideshow, etc), practice page, test page, demo page, feedback page]
// section_number which defines the order of the section during task administration
// test_id which defines the parent test to which the section belongs.
// Each section is composed of one or more JSON objects.
// A test has sections
// Each section has components

//const SECTION_TYPES = [{"option": "", "text": "Select section to add then press +"}, {"option": "Title_Page", "text": "Test title page."}, {"option": "Simple_Instructions", "text": "Simple instructions in text format."}, {"option": "Complex_Instructions", "text":"Complex instructions with tables or lists."}, {"option": "Header_Text", "text": "Header text like 'Begin Test'"}, {"option": "Practice", "text": "Practice text."}, {"option": "Test", "text": "Test text"}];
//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
const LANGUAGES = [{"option": "", "text":"Please select language"}, {"option": "he_IL", "text": "Henrew"}, {"option": "bg_BG", "text": "Bulgarian"},
{"option": "it_IT", "text": "Italian"}, {"option": "nl_NL", "text": "Dutch"},
{"option": "ar_EG", "text": "Arabic (Egypt)"}, {"option": "zh_CN", "text": "Simplified Chinese"}, {"option": "po_BR", "text": "Portuguese"}, {"option": "de_DE"}, {"option": "es_ES"}, {"option": "fr_CA"}, {"option": "pt_BR"}, {"option": "es_MX"}, {"option": "hi_MK"}, {"option": "ja_JA"}, {"option": "ru_MK"}, {"option": "xh_SA"}, {"option": "tn_BW"}, {"option": "pt_MZ"}, {"option": "zn_CN"}];
export default class TaskTranslator extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      original_sections: props.sections || [],
      sections: props.sections || [],
      section: null,
      section_data: null,
      language: null
    }

    this.onSectionClick = this.onSectionClick.bind(this);
    this.loadTimeline = this.loadTimeline.bind(this);
    this.viewTimelineSection = this.viewTimelineSection.bind(this);
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount()
  {
    this.loadTimeline();
  }

  componentWillUnmount()
  {
  }

  loadTimeline()
  {
    axios.post(this.props.base_url + 'timeline.pl', {'op': 'view', 'id': this.props.id})
    .then(response => {
      console.log('response ', response.data.timeline);
      this.setState((prevState, props) => {
        return {sections: response.data.timeline, original_sections: response.data.timeline}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  onSectionClick(evt)
  {
    const index = evt.target.value;
    const selected_section = this.state.sections[index];
    const section = this.state.section;
    if(selected_section === section)
    {
      return;
    }

  this.setState((prevState, props) => {
      return {section: selected_section}
  }, this.viewTimelineSection(selected_section));

  }

  viewTimelineSection(section)
  {
    console.log('loading section ', section, ' via api');
    axios.post(this.props.base_url + 'translate.pl', {'op': 'view', 'id': section.id, 'language': 'en_US'})
    .then(response => {
      const content = response.data.section_data[0];
      this.setState((prevState, props) => {
        return {section_data: content}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  updateLanguage(lang)
  {
    console.log('Updating language to ', lang);
    this.setState((prevState, props) => {
        return {language: lang}
    });
  }

  render()
  {
    let source = null;
    let destination = null;
    let section_title = null;

    section_title = <p>{this.state.section ? this.state.section.title.replaceAll("_", " ") : ""}</p>
    const sections = this.state.sections;
    const section = this.state.section;
    const section_data = this.state.section_data;

    let count = 0;
    if(section_data)
    {
      count = JSON.parse(section_data.content).length;
    }



    return (
    <div>
    {section_title}
    <select onChange={this.onSectionClick}>
    {
      sections.map((item, index) => {
        return <option value={index} key={index + 1}>{item.title.replaceAll("_", " ")}</option>
      })
    }
    </select>

    <div className="timeline-sections container">
    <div className="task-editor section-editor">
    {section_data && <TimelineSection base_url={this.props.base_url} language="en_US" {...section_data} key={this.state.section.id}/>}
    </div>

    <div className="task-editor section-editor">
    <div>{section_data && <TimelineSectionEditor base_url={this.props.base_url} updateLanguage={(e) => this.updateLanguage(e)} language={this.state.language} count={count} {...this.state.section} key={this.state.section.id + 100} />}</div>
    </div>

    </div>
    </div>
  )

  }
}
