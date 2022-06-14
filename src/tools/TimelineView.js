import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {TimelineSection} from './TimelineSection.js';
//const fs = require('fs');

const BASE_URL = "https://penncnp-dev.pmacs.upenn.edu/";

/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TimelineView extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      timeline: null,
      language: props.language || "en_US",
    }
    this.viewTimeline = this.viewTimeline.bind(this);
    this.onTimelineFileInput = this.onTimelineFileInput.bind(this);
  }

  componentDidMount()
  {
    console.log('given props ', this.props);
    this.viewTimeline();
  }

  viewTimeline()
  {
    axios.post(BASE_URL + 'tests.pl', {'op': 'timeline', 'id': this.props.id})
    .then(response => {
      console.log('response ', response.data.timeline);
      this.setData(response.data);
    })
    .catch(error => {
      console.log('Error ', error);
      // No timeline found for this test.
      this.setData([]);
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

  onTimelineFileInput(evt)
  {
    const file = evt.target.files[0];
    console.log('given translation file ', file);
    const data = new FormData();
    data.append('op', 'upload_timeline');
    data.append('id', this.props.id);
    data.append('file', file);
    console.log('sending file ', data);
    axios.post(BASE_URL + "tests.pl", data)
    .then(response => {
      console.log("Response is ", response)
    })
    .catch(error => {
      console.log("File upload failed ", error);
    });
  }

  render()
  {
    const timeline = this.state.timeline;
    console.log('timeline rendering ', timeline);

    return (
      timeline && timeline.length > 0 ?

      <>
      {timeline.map((item, index) => {
        return <div>
        <h4>{item.section_title.replaceAll('_', ' ')}</h4><TimelineSection language="en_US" {...item} />
        </div>
      })}
      </>

      :

      timeline && timeline.length < 1 ?
      <>
      <p>This test does not have a timeline.</p>
      <p>Upload timeline <input type="file" onChange={this.onTimelineFileInput}/></p>
      </>

      :
      <p>Loading timeline, please wait ....</p>

    )
  }
}
