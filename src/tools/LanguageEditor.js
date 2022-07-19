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

export default class LanguageEditor extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      languages: [],
      language: null,
      view: "view"
    }
    this.addLanguage = this.addLanguage.bind(this);
    this.loadLanguages = this.loadLanguages.bind(this);
    this.viewLanguage = this.viewLanguage.bind(this);
    this.deleteLanguage = this.deleteLanguage.bind(this);
    this.updateLanguage = this.updateLanguage.bind(this);
  }

  componentDidMount()
  {
    this.loadLanguages();
  }

  componentWillUnmount()
  {

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

  viewLanguage(language)
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
  }

  render()
  {

    return (
    <>

    </>
  )

  }
}
