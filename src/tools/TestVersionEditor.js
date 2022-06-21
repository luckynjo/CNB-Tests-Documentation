import React, {useEffect, useState} from 'react';
import {TimelineSection} from './TimelineSection.js';
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

// Add comment box for admin notes.
// Save the file as well affter adding translations to database.
const BASE_URL = "http://localhost/"; // "https://penncnp-dev.pmacs.upenn.edu/";

export class TestVersionEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      test_version: props.id || null,
      short_name: props.short_name || '',
      title: props.title || '',
      form: '',
      version_major: props.version_major || 1,
      version_minor: props.version_minor || 0,
      timeline: null,
      saving: null,
    };

    this.viewTimeline = this.viewTimeline.bind(this);
    this.updateAbbreviation = this.updateAbbreviation.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateTestForm = this.updateTestForm.bind(this);
    this.updateMajorVersion = this.updateMajorVersion.bind(this);
    this.updateMinorVersion = this.updateMinorVersion.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount()
  {
    console.log('given props ', this.props);
    //this.viewTimeline();
    //this.sectionOptionsRef.current.addEventListener('change', this.setSection);
    //this.addSectionRef.current.addEventListener('click', this.addSection);
  }

  viewTimeline()
  {
    if(this.props.id)
    {
      axios.post(BASE_URL + 'tests.pl', {'op': 'timeline', 'id': this.props.id})
      .then(response => {
        console.log('response ', response.data.timeline);
        this.setState((prevState, props) => {
          return {timeline: response.data.timeline}
        });
      })
      .catch(error => {console.log('Error ', error)});
    }
  }

  componentWillUnmount()
  {
    //this.sectionOptionsRef.current.removeEventListener('change', this.setSection);
    //this.addSectionRef.current.addEventListener('click', this.addSection);
  }

  updateAbbreviation(evt)
  {
    this.setState((prevState, props) => {
      return {short_name: evt.target.value}
    });
  }

  updateTitle(evt)
  {
    this.setState((prevState, props) => {
      return {title: evt.target.value}
    });
  }

  updateTestForm(evt)
  {
    this.setState((prevState, props) => {
      return {form: evt.target.value}
    });
  }

  updateMajorVersion(evt)
  {
    this.setState((prevState, props) => {
      return {version_major: evt.target.value}
    });
  }

  updateMinorVersion(evt)
  {
    this.setState((prevState, props) => {
      return {version_minor: evt.target.value}
    });
  }

  save()
  {
    const action = this.state.id ? "update" : "save";

    console.log('saving /updating test ', this.state.short_name, ' via api');
    axios.post(BASE_URL + 'tests.pl', {'op':  action, 'id': this.state.id, short_name: this.state.short_name, title: this.state.title,
    version_major: this.state.version_major, version_minor: this.state.version_minor, 'form': this.state.form})
    .then(response => {
      console.log('saved ', response);
    })
    .catch(error => {console.log('Error ', error)});
  }

  render()
  {
    const data =this.state.test_version;
    const timeline = this.state.timeline;
    const name = this.state.short_name;

    return (
      <>
      <table className="test_version-editor">
      <tbody>
      <tr>
      <td><input type="text" placeholder="Test abbreviation ie cpf, cpfd, k-cpw" value={this.state.short_name} onChange={this.updateAbbreviation}/></td>
      </tr>
      <tr>
      <td><input type="text" placeholder="Test title as it appears to users" value={this.state.title} onChange={this.updateTitle}/></td>
      </tr>
      <tr>
      <td><input type="text" placeholder="Test form ie a, b, c" value={this.state.form} onChange={this.updateTestForm}/></td>
      </tr>
      <tr>
      <td><input type="number" placeholder="Test main version" value={this.state.version_major} onChange={this.updateMajorVersion}/></td>
      </tr>
      <tr>
      <td><input type="number" placeholder="Test minor version" value={this.state.version_minor} onChange={this.updateMinorVersion}/></td>
      </tr>
      <tr>
      <td><input type="submit" value="Save" onClick={this.save}/></td>
      </tr>
      </tbody>
      </table>
      </>
    )
  }
}
