import React, {useEffect, useState} from 'react';
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
//const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";
//const BASE_URL = "http://localhost/";
const SECTION_TYPES = [{"option": "", "text": "Select section to add then press +"}, {"option": "Title_Page", "text": "Test title page."}, {"option": "Simple_Instructions", "text": "Simple instructions in text format."}, {"option": "Complex_Instructions", "text":"Complex instructions with tables or lists."}, {"option": "Header_Text", "text": "Header text like 'Begin Test'"}, {"option": "Practice", "text": "Practice text."}, {"option": "Test", "text": "Test text"}];

const SECTIONS = [];
export class TaskTimelineEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      original_sections: props.sections || [],
      sections: props.sections || [],
      section: null,
      section_data: null
    }
    this.sectionOptionsRef = React.createRef();
    this.addSectionRef = React.createRef();
    this.sections = [];

    this.addSection = this.addSection.bind(this);
    this.setSection = this.setSection.bind(this);
    this.onSectionUpdate = this.onSectionUpdate.bind(this);
    this.onSectionClick = this.onSectionClick.bind(this);
    this.saveTimeline = this.saveTimeline.bind(this);
    this.resetTimeline = this.resetTimeline.bind(this);
    this.viewTimelineSection = this.viewTimelineSection.bind(this);
  }

  componentDidMount()
  {
    this.loadTimeline();
    //this.sectionOptionsRef.current.addEventListener('change', this.setSection);
    //this.addSectionRef.current.addEventListener('click', this.addSection);
    //this.saveTimelineSection();
  }

  componentWillUnmount()
  {
    //this.sectionOptionsRef.current.removeEventListener('change', this.setSection);
    //this.addSectionRef.current.addEventListener('click', this.addSection);
  }

  resetTimeline()
  {
    const original_sections = this.state.original_sections;
    this.setState((prevState, props) => {
      return {sections: original_sections}
    });
  }

  loadTimeline()
  {
    axios.post(this.props.base_url + 'timeline.pl', {'op': 'view', 'id': 1})
    .then(response => {
      console.log('response ', response.data.timeline);
      this.setState((prevState, props) => {
        return {sections: response.data.timeline, original_sections: response.data.timeline}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  saveTimeline()
  {
    const timeline = this.state.sections;
    axios.post(this.props.base_url + 'timeline.pl', {'op': 'save', 'id': 1, 'timeline':timeline})
    .then(response => {console.log('response ', response)})
    .catch(error => {console.log('Error ', error)});
  }

  setSection()
  {

  }

  addSection()
  {
    const value = this.sectionOptionsRef.current.value;
    if(value === "")
    {
      return;
    }
    console.log("add a section here");
    let sections = this.state.sections;
    sections.push(value);
    console.log("update sections ", sections);
    //this.sections.push("section");
    this.setState((prevState, props) => {
      return {sections: sections}
    });
  }

  onSectionClick(evt, index)
  {
    //let sections = this.state.sections;
    console.log('clicked on section ', this.state.sections[index]);
    const selected_section = this.state.sections[index];
    const section = this.state.section;
    if(selected_section === section)
    {
      return;
    }

  this.setState((prevState, props) => {
      return {section: selected_section}
    }, () => {this.viewTimelineSection(selected_section);});

  }

  saveTimelineSection()
  {
    const data = {'type': 'Paragraph', 'text': 'Click on the green box to continue'};
    const id = 6;
    const section_id = 6;

    console.log('updating section via api');
    axios.post(this.props.base_url + 'timeline.pl', {'op': 'ust', 'id': id, 'language': 'en_US', 'sid': section_id, "text": data})
    .then(response => {
      console.log('update response ', response);
    })
    .catch(error => {console.log('Error ', error)});

  }
  viewTimelineSection(section)
  {
    console.log('loading section ', section, ' via api');
    axios.post(this.props.base_url + 'timeline.pl', {'op': 'vst', 'id': section.id, 'language': 'en_US', 'section_number': section.section_number})
    .then(response => {
      console.log('response ', response.data.section_text[0]);
      this.setState((prevState, props) => {
        return {section_data: response.data.section_text[0]}
      });
    })
    .catch(error => {console.log('Error ', error)});
  }

  onSectionUpdate(evt, index)
  {
    let sections = this.state.sections;
    sections[index] = evt.target.value;
    console.log("Section changing ", evt.target.value, " index ", index);
    this.setState((prevState, props) => {
      return {sections: sections}
    });
  }

  render()
  {
    let editables = null;
    let section_title = null;
    const section_data = this.state.section_data;

    if(section_data)
    {
      const content = JSON.parse(section_data.content);
      if(Array.isArray(content))
      {
        editables = content.map((item, index) => {
          return <tr><td><textarea key={index} value={item.text} placeholder="This is how we do!"></textarea></td></tr>
        });
      }
      else {
        editables = <tr><td><textarea value={content.text} placeholder="This is how we do!"></textarea></td></tr>
      }

      section_title = <p>{this.state.section.title.replace("_", " ")}</p>
    }
    const section_select = SECTION_TYPES.map((section, index) => {
      return <option value={section.option} key={index}>{section.text}</option>
    });

    const sections = this.state.sections;
    return (
    <div className="timeline-sections container">

    <div className="task-editor timeline-editor">
    <table className="edit-table">
    <tbody>
    {
      sections.map((item, index) => {
        return <tr key={index + 1} >
        <td>
        <p className="edit-text section-link" key={index + 1} onClick={(e) => this.onSectionClick(e, index)}>{item.title.replace("_", " ")}</p>
        </td>
        </tr>
      })
    }
    </tbody>
    </table>
    </div>

    <div className="task-editor section-editor">
    {section_title}
    <table>
    <tbody>
    {editables}
    </tbody>
    </table>
    </div>

    </div>
  )

  }
}
