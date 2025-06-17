//new imports 
import { IoSearch } from "react-icons/io5";

import React, { useState, useEffect } from 'react';
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

// All Dummy DATA
const adtDummyData = [
  {"question_number": 1, "trial_type" : "practice", "stimulus": ["019_053_CAF_01.png", "019_053_CAF_10.png"], "correct_response": 2},
  {"question_number": 2, "trial_type" : "practice", "stimulus": ["103_028_CAM_09.png", "103_028_CAM_01.png"], "correct_response": 1},
  {"question_number": 3, "trial_type" : "practice", "stimulus": ["105_044_AAM_07.png", "105_044_AAM_07.png"], "correct_response": 3},
  {"question_number": 1, "trial_type" : "test", "stimulus": ["136_009_CAM_02.png", "136_009_CAM_03.png"], "correct_response": 1},
  {"question_number": 2, "trial_type" : "test", "stimulus": ["136_009_CAM_09.png", "136_009_CAM_07.png"]},
  {"question_number": 3, "trial_type" : "test", "stimulus": ["136_009_CAM_05.png", "136_009_CAM_08.png"]},
  {"question_number": 4, "trial_type" : "test", "stimulus": ["136_009_CAM_07.png", "136_009_CAM_01.png"]},
  {"question_number": 5, "trial_type" : "test", "stimulus": ["103_028_CAM_06.png", "103_028_CAM_04.png"]},
  {"question_number": 6, "trial_type" : "test", "stimulus": ["103_028_CAM_02.png", "103_028_CAM_02.png"]},
  {"question_number": 7, "trial_type" : "test", "stimulus": ["019_053_CAF_05.png", "019_053_CAF_06.png"]},
  {"question_number": 8, "trial_type" : "test", "stimulus": ["019_053_CAF_04.png", "019_053_CAF_02.png"]},
  {"question_number": 9, "trial_type" : "test", "stimulus": ["019_053_CAF_11.png", "019_053_CAF_08.png"]},
  {"question_number": 10, "trial_type" : "test", "stimulus": ["138_027_CAF_01.png", "138_027_CAF_02.png"]},
  {"question_number": 11, "trial_type" : "test", "stimulus": ["138_027_CAF_05.png", "138_027_CAF_03.png"]},
  {"question_number": 12, "trial_type" : "test", "stimulus": ["017_225_AAF_06.png", "017_225_AAF_05.png"]},
  {"question_number": 13, "trial_type" : "test", "stimulus": ["017_225_AAF_11.png", "017_225_AAF_09.png"]},
  {"question_number": 14, "trial_type" : "test", "stimulus": ["017_225_AAF_07.png", "017_225_AAF_10.png"]},
  {"question_number": 15, "trial_type" : "test", "stimulus": ["017_225_AAF_08.png", "017_225_AAF_04.png"]},
  {"question_number": 16, "trial_type" : "test", "stimulus": ["017_225_AAF_02.png", "017_225_AAF_07.png"]},
  {"question_number": 17, "trial_type" : "test", "stimulus": ["017_225_AAF_05.png", "017_225_AAF_05.png"]},
  {"question_number": 18, "trial_type" : "test", "stimulus": ["147_137_ASM_10.png", "147_137_ASM_11.png"]},
  {"question_number": 19, "trial_type" : "test", "stimulus": ["147_137_ASM_05.png", "147_137_ASM_07.png"]},
  {"question_number": 20, "trial_type" : "test", "stimulus": ["147_137_ASM_04.png", "147_137_ASM_08.png"]},
  {"question_number": 21, "trial_type" : "test", "stimulus": ["147_137_ASM_10.png", "147_137_ASM_04.png"]},
  {"question_number": 22, "trial_type" : "test", "stimulus": ["212_020_HIF_03.png", "212_020_HIF_04.png"]},
  {"question_number": 23, "trial_type" : "test", "stimulus": ["212_020_HIF_07.png", "212_020_HIF_05.png"]},
  {"question_number": 24, "trial_type" : "test", "stimulus": ["212_020_HIF_09.png", "212_020_HIF_05.png"]},
  {"question_number": 25, "trial_type" : "test", "stimulus": ["212_020_HIF_09.png", "212_020_HIF_03.png"]},
  {"question_number": 26, "trial_type" : "test", "stimulus": ["105_044_AAM_05.png", "105_044_AAM_07.png"]},
  {"question_number": 27, "trial_type" : "test", "stimulus": ["105_044_AAM_11.png", "105_044_AAM_08.png"]},
  {"question_number": 28, "trial_type" : "test", "stimulus": ["105_044_AAM_09.png", "105_044_AAM_05.png"]},
  {"question_number": 29, "trial_type" : "test", "stimulus": ["105_044_AAM_01.png", "105_044_AAM_06.png"]},
  {"question_number": 30, "trial_type" : "test", "stimulus": ["105_044_AAM_10.png", "105_044_AAM_10.png"]},
  {"question_number": 31, "trial_type" : "test", "stimulus": ["103_028_CAM_01.png", "103_028_CAM_01.png"]},
  {"question_number": 32, "trial_type" : "test", "stimulus": ["103_028_CAM_08.png", "103_028_CAM_11.png"]},
  {"question_number": 33, "trial_type" : "test", "stimulus": ["103_028_CAM_07.png", "103_028_CAM_03.png"]},
  {"question_number": 34, "trial_type" : "test", "stimulus": ["019_053_CAF_11.png", "019_053_CAF_07.png"]},
  {"question_number": 35, "trial_type" : "test", "stimulus": ["138_027_CAF_08.png", "138_027_CAF_11.png"]},
  {"question_number": 36, "trial_type" : "test", "stimulus": ["138_027_CAF_03.png", "138_027_CAF_07.png"]}
]
//////////////////////////////////
const medfDuummyData = [
  {"question_number": 1, "trial_type" : "practice", "stimulus": ["117_angry_03.png","117_angry_10.png"]},
  {"question_number": 2, "trial_type" : "practice", "stimulus": ["222_happy_07.png","222_happy_01.png"]},
  {"question_number": 3, "trial_type" : "practice", "stimulus": ["145_sad_04.png","145_sad_04.png"]},
  {"question_number": 1, "trial_type" : "test", "stimulus": ["024_happy_11.png","024_happy_10.png"]},
  {"question_number": 2, "trial_type" : "test", "stimulus": ["024_happy_01.png","024_happy_03.png"]},
  {"question_number": 3, "trial_type" : "test", "stimulus": ["024_happy_08.png","024_happy_11.png"]},
  {"question_number": 4, "trial_type" : "test", "stimulus": ["024_happy_02.png","024_happy_06.png"]},
  {"question_number": 5, "trial_type" : "test", "stimulus": ["024_happy_07.png","024_happy_02.png"]},
  {"question_number": 6, "trial_type" : "test", "stimulus": ["222_happy_02.png","222_happy_01.png"]},
  {"question_number": 7, "trial_type" : "test", "stimulus": ["222_happy_10.png","222_happy_07.png"]},
  {"question_number": 8, "trial_type" : "test", "stimulus": ["222_happy_10.png","222_happy_06.png"]},
  {"question_number": 9, "trial_type" : "test", "stimulus": ["222_happy_11.png","222_happy_11.png"]},
  {"question_number": 10, "trial_type" : "test", "stimulus": ["117_angry_08.png","117_angry_11.png"]},
  {"question_number": 11, "trial_type" : "test", "stimulus": ["117_angry_10.png","117_angry_06.png"]},
  {"question_number": 12, "trial_type" : "test", "stimulus": ["117_angry_02.png","117_angry_07.png"]},
  {"question_number": 13, "trial_type" : "test", "stimulus": ["117_angry_07.png","117_angry_07.png"]},
  {"question_number": 14, "trial_type" : "test", "stimulus": ["022_angry_10.png","022_angry_09.png"]},
  {"question_number": 15, "trial_type" : "test", "stimulus": ["022_angry_09.png","022_angry_11.png"]},
  {"question_number": 16, "trial_type" : "test", "stimulus": ["022_angry_07.png","022_angry_10.png"]},
  {"question_number": 17, "trial_type" : "test", "stimulus": ["022_angry_06.png","022_angry_02.png"]},
  {"question_number": 18, "trial_type" : "test", "stimulus": ["016_fear_10.png","016_fear_11.png"]},
  {"question_number": 19, "trial_type" : "test", "stimulus": ["016_fear_09.png","016_fear_07.png"]},
  {"question_number": 20, "trial_type" : "test", "stimulus": ["016_fear_06.png","016_fear_09.png"]},
  {"question_number": 21, "trial_type" : "test", "stimulus": ["016_fear_08.png","016_fear_08.png"]},
  {"question_number": 22, "trial_type" : "test", "stimulus": ["016_fear_08.png","016_fear_03.png"]},
  {"question_number": 23, "trial_type" : "test", "stimulus": ["125_fear_08.png","125_fear_09.png"]},
  {"question_number": 24, "trial_type" : "test", "stimulus": ["125_fear_11.png","125_fear_09.png"]},
  {"question_number": 25, "trial_type" : "test", "stimulus": ["125_fear_07.png","125_fear_10.png"]},
  {"question_number": 26, "trial_type" : "test", "stimulus": ["125_fear_07.png","125_fear_03.png"]},
  {"question_number": 27, "trial_type" : "test", "stimulus": ["041_sad_02.png","041_sad_05.png"]},
  {"question_number": 28, "trial_type" : "test", "stimulus": ["041_sad_11.png","041_sad_07.png"]},
  {"question_number": 29, "trial_type" : "test", "stimulus": ["041_sad_09.png","041_sad_04.png"]},
  {"question_number": 30, "trial_type" : "test", "stimulus": ["041_sad_08.png","041_sad_02.png"]},
  {"question_number": 31, "trial_type" : "test", "stimulus": ["145_sad_11.png","145_sad_09.png"]},
  {"question_number": 32, "trial_type" : "test", "stimulus": ["145_sad_01.png","145_sad_04.png"]},
  {"question_number": 33, "trial_type" : "test", "stimulus": ["145_sad_10.png","145_sad_06.png"]},
  {"question_number": 34, "trial_type" : "test", "stimulus": ["145_sad_03.png","145_sad_08.png"]},
  {"question_number": 35, "trial_type" : "test", "stimulus": ["022_angry_02.png","022_angry_08.png"]},
  {"question_number": 36, "trial_type" : "test", "stimulus": ["138_027_CAF_03.png", "138_027_CAF_07.png"]}
]

const adtDummyData2 = [
  {"question_number": 1, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_05.png", "019_053_CAF_10.png"], "gender": "Female", "low_morph": 5, "high_morph": 10, "mean": 7.5, "correct_response": 2, "percent_difference": 50},
  {"question_number": 2, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_09.png", "105_044_AAM_05.png"], "gender": "Male", "low_morph": 5, "high_morph": 9, "mean": 7, "correct_response": 1, "percent_difference": 40},
  {"question_number": 3, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_10.png", "105_044_AAM_10.png"], "gender": "Male", "low_morph": 10, "high_morph": 10, "mean": 10, "correct_response": 3, "percent_difference": 0},
  {"question_number": 4, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["138_027_CAF_08.png", "138_027_CAF_11.png"], "gender": "Female", "low_morph": 8, "high_morph": 11, "mean": 9.5, "correct_response": 2, "percent_difference": 30},
  {"question_number": 5, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_10.png", "103_028_CAM_04.png"], "gender": "Male", "low_morph": 4, "high_morph": 10, "mean": 7, "correct_response": 1, "percent_difference": 60},
  {"question_number": 6, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["136_009_CAM_06.png", "136_009_CAM_10.png"], "gender": "Male", "low_morph": 6, "high_morph": 10, "mean": 8, "correct_response": 2, "percent_difference": 40},
  {"question_number": 7, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["138_027_CAF_10.png", "138_027_CAF_04.png"], "gender": "Female", "low_morph": 4, "high_morph": 10, "mean": 7, "correct_response": 1, "percent_difference": 60},
  {"question_number": 8, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_02.png", "105_044_AAM_02.png"], "gender": "Male", "low_morph": 2, "high_morph": 2, "mean": 2, "correct_response": 3, "percent_difference": 0},
  {"question_number": 9, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_05.png", "103_028_CAM_10.png"], "gender": "Male", "low_morph": 5, "high_morph": 10, "mean": 7.5, "correct_response": 2, "percent_difference": 50},
  {"question_number": 10, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_01.png", "019_053_CAF_01.png"], "gender": "Female", "low_morph": 1, "high_morph": 1, "mean": 1, "correct_response": 3, "percent_difference": 0},
  {"question_number": 11, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_05.png", "019_053_CAF_06.png"], "gender": "Female", "low_morph": 5, "high_morph": 6, "mean": 5.5, "correct_response": 2, "percent_difference": 10},
  {"question_number": 12, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_07.png", "103_028_CAM_03.png"], "gender": "Male", "low_morph": 3, "high_morph": 7, "mean": 5, "correct_response": 1, "percent_difference": 40},
  {"question_number": 13, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["017_225_AAF_07.png", "017_225_AAF_10.png"], "gender": "Female", "low_morph": 7, "high_morph": 10, "mean": 8.5, "correct_response": 2, "percent_difference": 30},
  {"question_number": 14, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_04.png", "019_053_CAF_02.png"], "gender": "Female", "low_morph": 2, "high_morph": 4, "mean": 3, "correct_response": 1, "percent_difference": 20},
  {"question_number": 15, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_05.png", "105_044_AAM_07.png"], "gender": "Male", "low_morph": 5, "high_morph": 7, "mean": 6, "correct_response": 2, "percent_difference": 20},
  {"question_number": 16, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["147_137_ASM_05.png", "147_137_ASM_07.png"], "gender": "Male", "low_morph": 5, "high_morph": 7, "mean": 6, "correct_response": 2, "percent_difference": 20},
  {"question_number": 17, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_11.png", "105_044_AAM_08.png"], "gender": "Male", "low_morph": 8, "high_morph": 11, "mean": 9.5, "correct_response": 1, "percent_difference": 30},
  {"question_number": 18, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["017_225_AAF_05.png", "017_225_AAF_05.png"], "gender": "Female", "low_morph": 5, "high_morph": 5, "mean": 5, "correct_response": 3, "percent_difference": 0},
  {"question_number": 19, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["212_020_HIF_09.png", "212_020_HIF_03.png"], "gender": "Female", "low_morph": 3, "high_morph": 9, "mean": 6, "correct_response": 1, "percent_difference": 60},
  {"question_number": 20, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_11.png", "019_053_CAF_08.png"], "gender": "Female", "low_morph": 8, "high_morph": 11, "mean": 9.5, "correct_response": 1, "percent_difference": 30},
  {"question_number": 21, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_02.png", "103_028_CAM_02.png"], "gender": "Male", "low_morph": 2, "high_morph": 2, "mean": 2, "correct_response": 3, "percent_difference": 0},
  {"question_number": 22, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_02.png", "103_028_CAM_02.png"], "gender": "Female", "low_morph": 3, "high_morph": 7, "mean": 5, "correct_response": 1, "percent_difference": 40},
  {"question_number": 23, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_10.png", "105_044_AAM_10.png"], "gender": "Male", "low_morph": 3, "high_morph": 9, "mean": 6, "correct_response": 2, "percent_difference": 60},
  {"question_number": 24, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["138_027_CAF_08.png", "138_027_CAF_11.png"], "gender": "Female", "low_morph": 5, "high_morph": 9, "mean": 7, "correct_response": 2, "percent_difference": 40},
  {"question_number": 25, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_10.png", "103_028_CAM_04.png"], "gender": "Male", "low_morph": 4, "high_morph": 8, "mean": 6, "correct_response": 2, "percent_difference": 40},
  {"question_number": 26, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["136_009_CAM_06.png", "136_009_CAM_10.png"], "gender": "Male", "low_morph": 1, "high_morph": 6, "mean": 3.5, "correct_response": 2, "percent_difference": 50},
  {"question_number": 27, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["138_027_CAF_10.png", "138_027_CAF_04.png"], "gender": "Female", "low_morph": 4, "high_morph": 9, "mean": 6.5, "correct_response": 2, "percent_difference": 50},
  {"question_number": 28, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["105_044_AAM_02.png", "105_044_AAM_02.png"], "gender": "Male", "low_morph": 2, "high_morph": 2, "mean": 2, "correct_response": 3, "percent_difference": 0},
  {"question_number": 29, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["103_028_CAM_05.png", "103_028_CAM_10.png"], "gender": "Female", "low_morph": 8, "high_morph": 11, "mean": 9.5, "correct_response": 2, "percent_difference": 30},
  {"question_number": 30, "question": "Which Face Is Older?", "trial_type": "practice", "stimulus": ["019_053_CAF_01.png", "019_053_CAF_01.png"], "gender": "Male", "low_morph": 1, "high_morph": 9, "mean": 8, "correct_response": 1, "percent_difference": 20}
]

const trialsDummyData = adtDummyData2;
/****
This class manages the editing of timeline sections.
Given a section, and a language, use this class to edit section text.
Containing onbjects must implement updateLanguage which is called whenever the section language changes.
*/
export class TestTrialsEditor extends React.Component
{
  // Constructor
  constructor(props)
  {
    super(props);
    this.state = {
      data : null, 
      toggleDataView : false, 
      currentSlide: 0,
      slideTransition: "", 
      toggleDetailsView : false,
      newTableData: trialsDummyData, 
      searchInput: "",
      toggleResetSearch: false,
      showSearchKeyWords: false, 
      showMoreExamples: false, // remove
      searchToggleMode: false, // remove

      //new stuff
      toggleHelpSearch: false,
      toggleSearchMenu: false,
      toggleSearchMode: false

    }

    this.viewTrials = this.viewTrials.bind(this);
    this.onTrialsFileInput = this.onTrialsFileInput.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.setToggleDataView = this.setToggleDataView.bind(this);
    this.setCurrentSlide = this.setCurrentSlide.bind(this);
    this.setSlideTransition = this.setSlideTransition.bind(this);
    this.setToggleDetailsView = this.setToggleDetailsView.bind(this);
    this.setNewTableData = this.setNewTableData.bind(this);
    this.setSearchInput = this.setSearchInput.bind(this);
    this.setToggleResetSearch = this.setToggleResetSearch.bind(this);
    this.setshowSearchKeyWords = this.setshowSearchKeyWords.bind(this);
    this.setShowMoreExamples = this.setShowMoreExamples.bind(this);
    this.setSearchToggleMode = this.setSearchToggleMode.bind(this);
    

    // new stuff
    this.setToggleHelpSearch = this.setToggleHelpSearch.bind(this);
    this.setToggleSearchMenu = this.setToggleSearchMenu.bind(this);
    this.setToggleSearchMode = this.setToggleSearchMode.bind(this);
  }

  // Functions
  componentDidMount()
  {
    console.log("Component mounted – run once here.");
    this.viewTrials();
  }
  
  componentWillUnmount()
  {
    this.setState({
      data: null,
      toggleDataView: false,
      currentSlide: 0,
      slideTransition: "",
      toggleDetailsView: false,
      newTableData: trialsDummyData, 
      searchInput: "", 
      toggleResetSearch: false,
      showSearchKeyWords: false,
      showMoreExamples: false,
      searchToggleMode: false,

      // new stuff
      toggleHelpSearch: false,
      toggleSearchMenu: false,
      toggleSearchMode: false 
    });
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

  ////////////////////////////////////////////////////////// New functions ////////////////////////////////////////////////////////
  handleToggle = (e) => {
    // For toggling Table view and Slideshow view
    if(e.target.id == "toggleViewBtn"){
      this.setToggleDataView(!this.state.toggleDataView);
    }
    // For toggling Reset Search button
    else if(e.target.id == "toggleResetSearchBtn"){
      console.log("Resetting!");
      this.setNewTableData(trialsDummyData);
      this.setToggleResetSearch(false);
      // clearing the input search field
      this.setSearchInput("");
      let searchInputElm = e.target.parentElement.childNodes[1].childNodes[0].childNodes[1];
      // console.log(searchInputElm);
      if (searchInputElm){
        searchInputElm.value = '';
      }
    }
    // For toggling showing All Keywords
    else if(e.target.id == "allKeywordsBtn"){
      if(!this.state.showSearchKeyWords && !this.state.showMoreExamples && !this.state.searchToggleMode){
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
      }
      else if(this.state.showSearchKeyWords && !this.state.showMoreExamples && !this.state.searchToggleMode){
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
      }
      else if(!this.state.showSearchKeyWords && this.state.showMoreExamples && !this.state.searchToggleMode){
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
        this.setShowMoreExamples(!this.state.showMoreExamples);
      }
      else if(!this.state.showSearchKeyWords && !this.state.showMoreExamples && this.state.searchToggleMode){
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
        this.setSearchToggleMode(!this.state.searchToggleMode);
      }
    }
    // For toggling showing More Examples
    else if(e.target.id == "moreExamplesBtn"){
      if(!this.state.showMoreExamples && !this.state.showSearchKeyWords && !this.state.searchToggleMode){
        this.setShowMoreExamples(!this.state.showMoreExamples);
      }
      else if(this.state.showMoreExamples && !this.state.showSearchKeyWords && !this.state.searchToggleMode){
        this.setShowMoreExamples(!this.state.showMoreExamples);
      }
      else if(!this.state.showMoreExamples && this.state.showSearchKeyWords && !this.state.searchToggleMode){
        this.setShowMoreExamples(!this.state.showMoreExamples);
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
      }
      else if(!this.state.showMoreExamples && !this.state.showSearchKeyWords && this.state.searchToggleMode){
        this.setShowMoreExamples(!this.state.showMoreExamples);
        this.setSearchToggleMode(!this.state.searchToggleMode);
      }
    }
    // For toggling a different search mode | Two modes: Pick Search, Type Search (default)
    else if(e.target.id == "searchToggleModeBtn"){
      if(!this.state.searchToggleMode && !this.state.showMoreExamples && !this.state.showSearchKeyWords){
        this.setSearchToggleMode(!this.state.searchToggleMode);
      }
      else if(this.state.searchToggleMode && !this.state.showMoreExamples && !this.state.showSearchKeyWords){
        this.setSearchToggleMode(!this.state.searchToggleMode);
      }
      else if(!this.state.searchToggleMode && this.state.showMoreExamples && !this.state.showSearchKeyWords){
        this.setSearchToggleMode(!this.state.searchToggleMode);
        this.setShowMoreExamples(!this.state.showMoreExamples);
      }
      else if(!this.state.searchToggleMode && !this.state.showMoreExamples && this.state.showSearchKeyWords){
        this.setSearchToggleMode(!this.state.searchToggleMode);
        this.setshowSearchKeyWords(!this.state.showSearchKeyWords);
      }
    }
    // For toggling showing details or not (in slideshow view)
    else if(e.target.id == "toggleDetailsBtn"){
      this.setToggleDetailsView(!this.state.toggleDetailsView);
    }
    // For searching requests (3 ifs)
    else if(e.target.tagName == "path" && e.target.parentElement.parentElement.id == "searchbarContent"){
      const searchValue = e.target.parentElement.parentElement
      this.filterData(trialsDummyData, this.state.searchInput);
    }
    else if(e.target.tagName == "svg" && e.target.parentElement.id == "searchbarContent"){
      this.filterData(trialsDummyData, this.state.searchInput);
    }
    else if(e.key == "Enter"){
      e.preventDefault();
      this.filterData(trialsDummyData, this.state.searchInput);
    }
  }

  // fix all event handlers
  handleClick = (e) => {
    if(e.target.id == "helpSearchBtn"){
      console.log("Help Search Clicked!");
      this.setToggleHelpSearch(!this.state.toggleHelpSearch);
    }
    else if(e.target.id == "searchMenuBtn"){
      console.log("Toggle Search Menu!");
      this.setToggleSearchMenu(!this.state.toggleSearchMenu);
    }

    else if(e.target.id == "searchMode1Title"){
      this.setToggleSearchMode(false);
    }
    else if(e.target.id == "searchMode2Title"){
      this.setToggleSearchMode(true);
    }
  }

  handleChange = (e) => {
    this.setSearchInput(e.target.value);
    if(!e.target.value){
      console.log("HIDE!!");
      this.setToggleResetSearch(false);
      this.setNewTableData(trialsDummyData);
    }
  }

  handleSearchClick = (e) => {
    if(e.target.id == "addQuery"){
      console.log("HEEEHEHERHRHHR!!!");
      this.searchQueryAction(e, "add");
    }
    else if(e.target.id == "searchTable"){
      if(this.state.searchInput && this.state.searchInput != ""){
        this.filterData(trialsDummyData, this.state.searchInput);
      }
      else {
        this.searchQueryAction(e, "search");
      }
    }
    else if(e.target.id == "clearAll"){
      this.searchQueryAction(e, "clear");
    }
  }

  searchQueryAction(e, action){
    let parentElm = e.target.parentElement.parentElement.childNodes[0];
    let keywordOption = parentElm.childNodes[0].value;
    let operatorOption = parentElm.childNodes[1].value;
    let valueOption = parentElm.childNodes[2].value;
    console.log("AMERICAN BOT: ", this.state.searchInput,keywordOption, operatorOption, valueOption);
    if(keywordOption && operatorOption && valueOption && keywordOption != "" && operatorOption != "" && valueOption != ""){
      console.log("OK MAN!1");
      let combinedStr = keywordOption+" "+operatorOption+" "+valueOption;
      if(this.state.searchInput && this.state.searchInput != ""){
        this.setSearchInput(this.state.searchInput+" , "+combinedStr);
      }
      else{
        this.setSearchInput(combinedStr);
        // action if searchTableBtn was clicked
        if(action == "search"){
          console.log("here is a cookie");
          this.filterData(trialsDummyData, combinedStr);
        }
      }
    }
    if(action == "clear"){
      console.log("Clearing!");
      this.setNewTableData(trialsDummyData);
      this.setToggleResetSearch(false);
      this.setSearchInput("");
      parentElm.childNodes[0].selectedIndex = 0;
      parentElm.childNodes[1].selectedIndex = 0;
      parentElm.childNodes[2].value = '';
    }
  }


  setToggleDataView(newData)
  {
    this.setState((prevState, props) => {
      return {toggleDataView: newData}
    });
  }
  // Function to handle the next slide
  nextSlide = (dataLen) => {
    console.log("going front: ", dataLen);
    const slideCount = dataLen;
    console.log(slideCount);
    this.setCurrentSlide((this.state.currentSlide + 1) % slideCount);
    this.setSlideTransition("next")
  }
  
  // Function to handle the previous slide
  prevSlide = (dataLen) => {
    console.log("going back: ", dataLen);
    const slideCount = dataLen;
    console.log(slideCount);
    this.setCurrentSlide((this.state.currentSlide - 1 + slideCount) % slideCount);
    this.setSlideTransition("prev");
  }



  // --------------------- SET FUNCTIONS ----------------- //

  // new stuff
  setToggleHelpSearch(newData)
  {
    this.setState((prevState, props) => {
      return {toggleHelpSearch: newData}
    });
  }

  setToggleSearchMenu(newData)
  {
    this.setState((prevState, props) => {
      return {toggleSearchMenu: newData}
    });
  }

  setToggleSearchMode(newData)
  {
    this.setState((prevState, props) => {
      return {toggleSearchMode: newData}
    });
  }


  // new stuff end

  setCurrentSlide(newData)
  {
    this.setState((prevState, props) => {
      return {currentSlide: newData}
    });
  }

  setSlideTransition(newData)
  {
    this.setState((prevState, props) => {
      return {slideTransition: newData}
    });
  }

  setToggleDetailsView(newData)
  {
    this.setState((prevState, props) => {
      return {toggleDetailsView: newData}
    });
  }

  setNewTableData(newData)
  {
    this.setState((prevState, props) => {
      return {newTableData: newData}
    });
  }

  setSearchInput(newData)
  {
    this.setState((prevState, props) => {
      return {searchInput: newData}
    });
  }

  setToggleResetSearch(newData)
  {
    this.setState((prevState, props) => {
      return {toggleResetSearch: newData}
    });
  }

  setshowSearchKeyWords(newData)
  {
    this.setState((prevState, props) => {
      return {showSearchKeyWords: newData}
    });
  }

  setShowMoreExamples(newData)
  {
    this.setState((prevState, props) => {
      return {showMoreExamples: newData}
    });
  }

  setSearchToggleMode(newData)
  {
    this.setState((prevState, props) => {
      return {searchToggleMode: newData}
    });
  }

  filterData(data, currentSearchInput) {
    const inputValue = currentSearchInput;
    const query = inputValue.trim().toLowerCase();
    let filteredData = data;
    console.log("SEARCHING::: ");

    if (!query){
      console.log("Do Nothing");
      this.setToggleResetSearch(false);
      this.setNewTableData(trialsDummyData);
    }
    else{
      console.log("Filter Time");
      if(query.includes(',')){
        console.log("MORE!!!");
        let updatedDataList = filteredData;
        let filtersList = query.split(",");
        for(let filt of filtersList){
          console.log("Search More");
          // set reset button to show
          this.setToggleResetSearch(true);
          // Filter #1 (for searches like mean=5, correct response = 2, gender = male)
          if(filt.includes('=') && !filt.includes('!=')){
            console.log("Filter 1");
            let filters = filt.split("=");
            filters[0] = filters[0].trim();
            if(filters[0].includes(' ')){
              filters[0] = (filters[0].split(" ")).join("_");
            }
            filters[1] = filters[1].trim();
            updatedDataList = this.handleSearch(updatedDataList, filters, 'eq');
          }
          // Filter #2 (less than)
          else if(filt.includes('<')){
            console.log("Filter 2");
            let filters = filt.split("<");
            filters[0] = filters[0].trim();
            if(filters[0].includes(' ')){
              filters[0] = (filters[0].split(" ")).join("_");
            }
            filters[1] = filters[1].trim();
            updatedDataList = this.handleSearch(updatedDataList, filters, 'lt');
          }
          // Filter #3 (greater than)
          else if(filt.includes('>')){
            console.log("Filter 3");
            let filters = filt.split(">");
            filters[0] = filters[0].trim();
            if(filters[0].includes(' ')){
              filters[0] = (filters[0].split(" ")).join("_");
            }
            filters[1] = filters[1].trim();
            updatedDataList = this.handleSearch(updatedDataList, filters, 'gt');
          }
          // Filter #4 (not equal to)
          else if(filt.includes('!=')){
            console.log("Filter 4");
            let filters = filt.split("!=");
            filters[0] = filters[0].trim();
            if(filters[0].includes(' ')){
              filters[0] = (filters[0].split(" ")).join("_");
            }
            filters[1] = filters[1].trim();
            updatedDataList = this.handleSearch(updatedDataList, filters, 'neq');
          }
          //Filter #5 (for searches like keywords: female, question 3)
          else {
            console.log("Filter 5");
            // let filters = query.split(" ");
            // let filtersAdjusted = [];
            // // console.log("Change it up: ", filters);
            // for(let i=0; i < filters.length; i++){
            //   // console.log("Check: ", filters[i]);
            //   if(filters[i] != ""){
            //     // console.log("keep");
            //     filtersAdjusted.push(filters[i]);
            //   }
            // }
            // filters = filtersAdjusted;
            // this.handleSearch(filteredData, filters, 'normal');
          }
        }
        filteredData = updatedDataList;
      }
      else {
        console.log("Search Once");
        // set reset button to show
        this.setToggleResetSearch(true);
        // Filter #1 (for searches like mean=5, correct response = 2, gender = male)
        if(query.includes('=') && !query.includes('!=')){
          console.log("Filter 1");
          let filters = query.split("=");
          filters[0] = filters[0].trim();
          if(filters[0].includes(' ')){
            filters[0] = (filters[0].split(" ")).join("_");
          }
          filters[1] = filters[1].trim();
          filteredData = this.handleSearch(filteredData, filters, 'eq');
        }
        // Filter #2 (less than)
        else if(query.includes('<')){
          console.log("Filter 2");
          let filters = query.split("<");
          filters[0] = filters[0].trim();
          if(filters[0].includes(' ')){
            filters[0] = (filters[0].split(" ")).join("_");
          }
          filters[1] = filters[1].trim();
          filteredData = this.handleSearch(filteredData, filters, 'lt');
        }
        // Filter #3 (greater than)
        else if(query.includes('>')){
          console.log("Filter 3");
          let filters = query.split(">");
          filters[0] = filters[0].trim();
          if(filters[0].includes(' ')){
            filters[0] = (filters[0].split(" ")).join("_");
          }
          filters[1] = filters[1].trim();
          filteredData = this.handleSearch(filteredData, filters, 'gt');
        }
        // Filter #4 (not equal to)
        else if(query.includes('!=')){
          console.log("Filter 4");
          let filters = query.split("!=");
          filters[0] = filters[0].trim();
          if(filters[0].includes(' ')){
            filters[0] = (filters[0].split(" ")).join("_");
          }
          filters[1] = filters[1].trim();
          filteredData = this.handleSearch(filteredData, filters, 'neq');
        }
        //Filter #5 (for searches like keywords: female, question 3)
        else {
          console.log("Filter 5: Do Nothing");
          // let filters = query.split(" ");
          // let filtersAdjusted = [];
          // // console.log("Change it up: ", filters);
          // for(let i=0; i < filters.length; i++){
          //   // console.log("Check: ", filters[i]);
          //   if(filters[i] != ""){
          //     // console.log("keep");
          //     filtersAdjusted.push(filters[i]);
          //   }
          // }
          // filters = filtersAdjusted;
          // this.handleSearch(filteredData, filters, 'normal');
        }
      }
      this.setNewTableData(filteredData);
    }
  }
  
  handleSearch(filteredData, filters, filterType) {
    let changedData = [];
    console.log("Stuff: ", changedData, filters);
    if(filterType == "eq"){
      for(let dataObj of filteredData){
        console.log(dataObj);
        if(filters[0] in dataObj){
          console.log(filters[0], dataObj[filters[0]], filters[1]);
          if(typeof dataObj[filters[0]] == "string"){
            if(dataObj[filters[0]].toLowerCase() == filters[1]){
              changedData.push(dataObj);
            }
          }
          else {
            if(dataObj[filters[0]] == filters[1]){
              changedData.push(dataObj);
            }
          }
        }
      }
    }
    else if(filterType == "lt"){
      for(let dataObj of filteredData){
        console.log(dataObj);
        if(filters[0] in dataObj){
          console.log(filters[0], dataObj[filters[0]], filters[1]);
          if(typeof dataObj[filters[0]] == "string"){
            if(dataObj[filters[0]].toLowerCase() < filters[1]){
              changedData.push(dataObj);
            }
          }
          else {
            if(dataObj[filters[0]] < filters[1]){
              changedData.push(dataObj);
            }
          }
        }
      }
    }
    else if(filterType == "gt"){
      for(let dataObj of filteredData){
        console.log(dataObj);
        if(filters[0] in dataObj){
          console.log(filters[0], dataObj[filters[0]], filters[1]);
          if(typeof dataObj[filters[0]] == "string"){
            if(dataObj[filters[0]].toLowerCase() > filters[1]){
              changedData.push(dataObj);
            }
          }
          else {
            if(dataObj[filters[0]] > filters[1]){
              changedData.push(dataObj);
            }
          }
        }
      }
    }
    else if(filterType == "neq"){
      for(let dataObj of filteredData){
        console.log(dataObj);
        if(filters[0] in dataObj){
          console.log(filters[0], dataObj[filters[0]], filters[1]);
          if(typeof dataObj[filters[0]] == "string"){
            if(dataObj[filters[0]].toLowerCase() != filters[1]){
              changedData.push(dataObj);
            }
          }
          else {
            if(dataObj[filters[0]] != filters[1]){
              changedData.push(dataObj);
            }
          }
        }
      }
    }
    else {
      let matchedIndex = 0
      let filtersLen = filters.length;
      let targetMatch = filtersLen / 2;
      console.log(filtersLen, targetMatch);

      for(let dataObj of filteredData){
        let dataObjStr = (JSON.stringify(dataObj)).toLowerCase();
        console.log(dataObjStr);
        for(let i = 0; i < filtersLen; i++){
          if(dataObjStr.includes(filters[i])){
            console.log("YES!!!");
            matchedIndex++;
          }
        }
        if(matchedIndex == filtersLen){
          changedData.push(dataObj);
        }
      }
    }

    console.log("FINAL DATA: ", changedData);
    // this.setNewTableData(changedData);
    return changedData;
  }

  DataToSlideshow(props) {
    console.log("Propssssss: ", props);
    let data = props.props;
    // data = [data[data.length - 1],...data, data[0]]
    const slideCount = data.length;
    console.log("DATATAAATAT: ", data);
    const currentSlide = props.currentSlide;
    console.log("SLDIEDED: ", currentSlide);
    console.log("How many times:: ", props.slideTransition);
    let tempNextSlide = (currentSlide + 1) % slideCount;
    let tempPrevSlide = (currentSlide - 1 + slideCount) % slideCount;
    console.log(currentSlide, tempNextSlide, currentSlide - tempNextSlide);
    console.log(currentSlide, tempPrevSlide, tempPrevSlide - currentSlide);
    console.log(slideCount - 1);
    console.log((currentSlide - tempNextSlide) == (slideCount - 1) || (currentSlide - tempPrevSlide) == (slideCount - 1));

    return (data && data.length > 0)?
    <div id='slideshow-wrapper' style={{width : "100%", height : "610px", textAlign : "center", border : "2px solid black", overflow : 'hidden', padding : "30px 30px", position : "relative"}}>
      <div id='slides-container' style={{overflow : 'hidden', width : "100%", height : "100%"}}>
        <div id='slides' 
          style={{
            display: "flex", // Ensure slides are aligned horizontally
            flexDirection: "row", // Set the direction to horizontal
            width: `${100 * slideCount}%`, // Total width is proportional to the number of slides
            height: "100%",
            transition: ((props.slideTransition == "prev" && (currentSlide == 29 && tempNextSlide == 0)) || (props.slideTransition == "next" && (currentSlide == 0 && tempPrevSlide == 29)))? "transform 2s ease-in-out" : "transform 0.5s ease-in-out", // Smooth transition effect
            transform: `translateX(-${(100 / slideCount) * currentSlide}%)`, // Slide horizontally

        }}>
          {data.map((trial, index) => {
            return ( 
              <div key={index} id={`slide${index}`} style={{width : "100%", height : "100%", display : "flex", justifyContent : "start"}}>
                <div id='stimulus-wrapper' style={{display : "flex", flexDirection : "column", justifyContent : "space-around", gap: "10px", flex: 1}}>
                  <div style={{position: "relative"}}>
                    <p style={{fontSize: "35px", padding: 0, fontWeight: "bold", width: "fit-content", marginLeft: "auto", marginRight: "auto"}}>QUESTION #{trial.question_number} ({trial.trial_type})</p>
                    <button id="toggleDetailsBtn" style={{position: "absolute", top: "22%", right: 0, fontSize: "15px", height: "fit-content", alignSelf: "center", border: "none", background: "transparent", marginRight: (props.toggleDetailsView)? "0px" : "30px", padding: "5px", border: "2px solid black", borderRadius: "30px", transition: (props.toggleDetailsView)? "margin-right 0.1s 0.25s ease-in-out" : "margin-right 0.25s 0.5s ease-in-out"}} onClick={props.handleToggle}>{(props.toggleDetailsView)? "Show Less" : "Show More"}</button>
                  </div>
                  <h1 style={{fontSize: "30px", fontWeight: "normal", padding: 0, margin: 0}}>{trial.question}</h1>
                  <div style={{display: "flex", gap: "10px", width : "fit-content", border : "none", padding: 0, justifySelf: "center", marginLeft: "auto", marginRight: "auto"}}>
                    { (typeof trial.stimulus == "object") ? 
                    trial.stimulus.map((stim, ind) => {
                      // console.log("CHECK: ", stim, ":", ind);
                      return <img key={ind+200} height={400} src={require("../assets/stimuli/adt/"+stim)}></img>
                    }) 
                    : 
                    <p>{trial.stimulus}</p>}
                  </div>
                  <div style={{display: "flex", width : "100%", gap: "15px", border : "none", padding: 0, justifyContent: "center", alignSelf: "center", fontSize: "30px"}}>
                    <div style={{backgroundColor: ((trial.correct_response == 1)? "lightgreen" : "transparent" ), padding: "4px", border: "2px solid black"}}>LEFT</div>
                    <div style={{backgroundColor: ((trial.correct_response == 3)? "lightgreen" : "transparent" ), padding: "4px", border: "2px solid black"}}>SAME</div>
                    <div style={{backgroundColor: ((trial.correct_response == 2)? "lightgreen" : "transparent" ), padding: "4px", border: "2px solid black"}}>RIGHT</div>
                  </div>
                </div>
                <div id="detailsWrapper" style={{display: "flex", width: (props.toggleDetailsView)? "100%" : "0%", transition: "width 1s linear", marginLeft: "20px", overflow: "hidden"}}>
                  <div id='verticalLine' style={{width : "5px" , height : "auto", backgroundColor : "black"}}></div>
                  <div id='details' style={{display: "flex", flexDirection : "column", justifyContent : "space-evenly", gap: "10px", textAlign: "left", backgroundColor: "rgb(245,245,245)", padding: "15px", width: "100%"}}>
                    <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                      <div><p>Correct Response: {(trial.correct_response == 3)? "SAME" : (trial.correct_response == 2)? "RIGHT" : "LEFT"} ({trial.correct_response})</p></div>
                    </div>
                    <hr style={{ border: "1px solid black", width: "100%"}} />
                    <div style={{display: "grid", gridTemplateColumns: "auto", height: "100%"}}>
                      {/* <div><p>Gender: {(trial.gender == 'M')? "Male" : "Female"}</p></div> */}
                      <div><p>Gender: {trial.gender}</p></div>
                      <div><p>Low Morph: {trial.low_morph}</p></div>
                      <div><p>High Morph: {trial.high_morph}</p></div>
                      <div><p>Mean: {trial.mean}</p></div>
                      <div><p>Percent Difference: {trial.percent_difference}</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <button className='slideshowBtns' style={{border : "none", position : "absolute", top : "0%", left : "0", padding : "15px", width : "fit-content", height : "100%", backgroundColor : "lightgray", alignContent : "center", opacity : "0%", fontSize : "20px"}} onClick={() => props.prevSlide(slideCount)}>
        <h1 style={{border : "2px solid black rounded", padding : "5px"}}>
          &lt;
        </h1>
      </button>
      <button className='slideshowBtns' style={{border : "none", position : "absolute", top : "0%", right : "0", padding : "15px", width : "fit-content", height : "100%", backgroundColor : "lightgray", alignContent : "center", opacity : "0%", fontSize : "20px"}} onClick={() => props.nextSlide(slideCount)}>
        <h1 style={{border : "2px solid black rounded", padding : "5px"}}>
          &gt;
        </h1>
      </button>
    </div>

    :

    <div id='slideshow-wrapper' style={{width : "100%", height : "610px", textAlign : "center", border : "2px solid black", overflow : 'hidden', padding : "30px 30px", position : "relative"}}>
      <div id='slides-container' style={{overflow : 'hidden', width : "100%", height : "100%"}}>
          <div id='slides' 
            style={{
              display: "flex", // Ensure slides are aligned horizontally
              flexDirection: "row", // Set the direction to horizontal
              width: "100%", // Total width is full
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              transition: ((props.slideTransition == "prev" && (currentSlide == 29 && tempNextSlide == 0)) || (props.slideTransition == "next" && (currentSlide == 0 && tempPrevSlide == 29)))? "transform 2s ease-in-out" : "transform 0.5s ease-in-out", // Smooth transition effect
              transform: `translateX(-${(100 / slideCount) * currentSlide}%)`, // Slide horizontally
          }}>
            <h1 id="searchError" style={{fontSize: "75px", flex: 1, fontWeight: "normal"}}>No Search Results Found</h1>
          </div>
        </div>
      </div>
  }

  DataToTable(props) {
    console.log("TABLE TIME: ", props.props);
    const data = props.props;
    return (data && data.length > 0)?
    <table className="trials-view" style={{width : "100%", textAlign : "center", marginBottom: "100px"}}>
      <thead>
          <tr style={{fontSize: "30px", backgroundColor: "lightgray"}}>
            <th>STIMULUS</th>
            <th>DETAILS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((trial, index) => {
            return (
              <tr key={index + 200} style={{ borderLeft: "2px solid", borderRight: "2px solid", backgroundColor: (index % 2 == 0)? "white" : "lightgray" }}>
                <td style={{border : "none", padding: 0}}>
                  <div style={{display: "flex", flexDirection: "column", gap : "20px", width : "fit-content", border : "none", padding: "15px", justifySelf: "center"}}>
                    <h1 style={{fontSize: "30px", fontWeight: "normal", padding: 0, margin: 0}}>{trial.question}</h1>
                    <div style={{display: "flex", gap : "10px", width : "fit-content", border : "none", padding: 0, justifySelf: "center"}}>
                    { (typeof trial.stimulus == "object") ? 
                    trial.stimulus.map((stim, ind) => {
                      // console.log("CHECK: ", stim, ":", ind);
                      return <img key={ind+200} width={300} src={require("../assets/stimuli/adt/"+stim)}></img>
                    }) 
                    : 
                    <p>{trial.stimulus}</p>}
                    </div>
                    <div style={{display: "flex", width : "100%", gap: "15px", border : "none", padding: 0, justifyContent: "center", alignSelf: "center", fontSize: "25px"}}>
                      <div style={{backgroundColor: (trial.correct_response === 1)? "lightgreen" : "transparent", padding: "4px", border: "2px solid black"}}>LEFT</div>
                      <div style={{backgroundColor: (trial.correct_response === 3)? "lightgreen" : "transparent" , padding: "4px", border: "2px solid black"}}>SAME</div>
                      <div style={{backgroundColor: (trial.correct_response === 2)? "lightgreen" : "transparent", padding: "4px", border: "2px solid black"}}>RIGHT</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div id="detailsMiniTab" style={{display: "flex", flexDirection: "column", border: "2px solid black"}}>
                    <div style={{borderBottom: "2px solid black"}}>
                      <p style={{fontWeight: "bold"}}>QUESTION #{trial.question_number} ({trial.trial_type})</p>
                    </div>
                    <div style={{borderBottom: "2px solid black"}}>
                      <p>Correct Response: {(trial.correct_response == 3)? "SAME" : (trial.correct_response == 2)? "RIGHT" : "LEFT" } ({trial.correct_response})</p>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center"}}>
                        {/* <p>Gender: {(trial.gender == 'M')? "Male" : "Female"}</p> */}
                        <p>Gender: {trial.gender}</p>
                        <p>Low Morph: {trial.low_morph}</p>
                        <p>High Morph: {trial.high_morph}</p>
                        <p>Mean: {trial.mean}</p>
                        <p>Percent Difference: {trial.percent_difference}</p>
                    </div>
                  </div>
                </td>
              </tr>
            )
          })
          }
        </tbody>
    </table>

    :

    <>
      <table className="trials-view" style={{width : "100%", textAlign : "center", marginBottom: "100px"}}>
        <thead>
            <tr style={{fontSize: "30px", backgroundColor: "lightgray"}}>
              <th>STIMULUS</th>
              <th>DETAILS</th>
            </tr>
          </thead>
        <tbody></tbody>
      </table>
      <div id="searchError" style={{fontSize: "50px", textAlign: "center"}}>No Search Results Found</div>
    </>
  }

  render()
  {

    const currentData = trialsDummyData;
    const uniqueDataKeys = new Set();
    currentData.forEach(obj => {
      Object.keys(obj).forEach(key => {
        uniqueDataKeys.add(key);
      });
    });

    console.log("BROOO:: ", this.state.newTableData);
    return (currentData && currentData.length > 0)? 
    (
      <>
      <div id="toolsbar-wrapper" style={{marginBottom: '20px'}}>
      <div id="toolsbar" style={{display : 'flex', gap: '10px'}}>
          <button id="toggleViewBtn" 
            style={{
              padding: '12px 24px',
              fontSize: '20px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#2C3E50',
              borderRadius: '8px',
              cursor: 'pointer',
              border: 'none',
              fontFamily: 'Inter, sans-serif',
              boxSizing: 'border-box',
              transition: "transform 0.25s linear",
            }} 
            onClick={this.handleToggle}>{this.state.toggleDataView ? "SlideShow View" : "Table View"}
          </button>


          {/* Old Stuff Remove */}

          {/* <div id="searchContainer" style={{display: "flex", position: "relative"}}>
              <div id="searchbarContainer" style={{backgroundColor: "#2e3e51", display: (this.state.toggleDataView) ? "none" : "flex", 
                flex: 1, alignItems: "center", width: "310px", borderRadius: "8px", border: "1px solid black", 
                padding: "3px 10px 3px 10px", gap: "5px", cursor: 'pointer', transition: "transform 0.25s linear", position: "relative", 
                zIndex: 10}}>
                <IoSearch style={{padding: "3px", border: "1px dashed white"}} name="searchIcon" width={25} height={25} strokeWidth={25} stroke="white" fill="white" onClick={this.handleToggle}/>
                <input type="text" id="searchbar" name="searchbar" placeholder='Search Queries and Filter Table...' 
                      style={{width: "100%", border: "none", padding: "5px", background: "transparent", color: "white", fontSize: "18px"}}
                      onKeyDown={this.handleToggle}
                      onChange={this.handleChange}/>
              </div>

            <div id="searchDetailsWrapper">
              <div id="searchDetailsContainer" >
                <div style={{fontSize: "25px"}}>Your Search Queries: &nbsp;
                  <span style={{fontFamily:"serif", fontSize: "25px", textWrap:"wrap"}}>
                    {(this.state.searchInput)? this.state.searchInput : "None"}
                  </span>
                </div>
                <hr style={{width: "100%"}}></hr>
                <div style={{textDecoration: "underline", textAlign: "center"}}>Example of Valid Queries</div>
                <div>Single Query: <span style={{fontFamily:"serif", fontSize: "20px"}}>correct response = 2 OR percent difference &lt; 50</span></div>
                <div>Multiple Queries: <span style={{fontFamily:"serif", fontSize: "20px"}}>correct response = 2, percent difference &lt; 50, ...</span></div>
                <hr style={{width: "100%"}}></hr>
                <div style={{display: "flex", gap: "10px", justifyContent: "space-between", fontFamily:"monospace", fontSize: "15px", marginBottom: (this.state.showMoreExamples || this.state.searchToggleMode || this.state.showSearchKeyWords)? "20px" : 0}}>
                  <div id="moreExamplesBtn" style={{textDecoration: "underline", padding: "8px", borderRadius: "8px", backgroundColor: (this.state.showMoreExamples)? "#2e3e51" : "transparent"}} onClick={this.handleToggle}>How To Search</div>
                  <div id="searchToggleModeBtn" style={{textDecoration: "underline", padding: "8px", borderRadius: "8px", backgroundColor: (this.state.searchToggleMode)? "#2e3e51" : "transparent"}} onClick={this.handleToggle}>Try Easy Search Mode</div>
                  <div id="allKeywordsBtn" style={{textDecoration: "underline", padding: "8px", borderRadius: "8px", backgroundColor: (this.state.showSearchKeyWords)? "#2e3e51" : "transparent"}} onClick={this.handleToggle}>All Keywords</div>
                </div>


                <div id="searchKeywordsWrapper" style={{display: (this.state.showSearchKeyWords)? "block" : "none", maxHeight: (this.state.showSearchKeyWords)? "300px" : 0, padding: (this.state.showSearchKeyWords)? "15px" : 0, opacity: (this.state.showSearchKeyWords)? 1 : 0, transition: "max-height 0.5s, padding 0.3s, opacity 0.3s", overflow: "hidden", backgroundColor: "#2e3e51", boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", alignItems: "center", borderRadius: "8px", border: "1px solid black"}}>
                  <div id="searchKeywordsContainer" style={{display: "flex", flexDirection: "column", gap: "5px", cursor: 'pointer', color: "white", overflow: "auto", height: "100%"}}>
                    <div id="searchKeywordsTitle" style={{textAlign: "center", fontSize: "25px", textDecoration: "underline", marginBottom: "20px"}}>TYPES OF KEYWORDS</div>
                    <div id="keywordsDpdn" style={{display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"}}>
                      {[...uniqueDataKeys].map((item, index) => {
                        return (
                          <div key={index+1} id={`option${index}`} style={{fontFamily:"serif", fontSize: "20px", whiteSpace: "nowrap", textAlign: "center"}}> 
                            {(item.includes("_"))? (item.split("_")).join(" ") : item }
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>



                <div id="searchModeWrapper" style={{display: (this.state.searchToggleMode)? "block" : "none", maxHeight: (this.state.searchToggleMode)? "300px" : 0, padding: (this.state.searchToggleMode)? "15px" : 0, opacity: (this.state.searchToggleMode)? 1 : 0, transition: "max-height 0.5s, padding 0.3s, opacity 0.3s", overflow: "hidden", backgroundColor: "#2e3e51", boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", alignItems: "center", borderRadius: "8px", border: "1px solid black"}}>
                  <div id="searchModeContainer" style={{display: "flex", flexDirection: "column", gap: "10px", cursor: 'pointer', color: "white", overflow: "auto", height: "100%", padding: "10px 15px"}}>
                    <div id="searchModeTitle" style={{textAlign: "center", fontSize: "25px", textDecoration: "underline", marginBottom: "20px"}}>Easy Search Mode</div>
                    <div id="searchModeDetails" style={{display: "flex", gap: "15px", justifyContent: "space-between"}} >
                      <select name="search_kywd" id="search_kywd" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}>
                        <option disabled selected value="">Choose A Keyword</option>
                        {[...uniqueDataKeys].map((item, index) => {
                              return (
                                <option key={index+1} id={`option${index}`} value={(item.includes("_"))? (item.split("_")).join(" ") : item}> 
                                  {(item.includes("_"))? (item.split("_")).join(" ") : item}
                                </option>
                              )
                            })}
                      </select>
                      <select name="search_op" id="search_op" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}>
                        <option disabled selected value="">Choose An Operator</option>
                        <option value="=">=</option>
                        <option value="<">&lt;</option>
                        <option value=">">&gt;</option>
                        <option value="!=">!=</option>
                      </select>
                      <input type="text" name="search_val" id="search_val" placeholder="Type A Value" autoComplete="off" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}></input>
                    </div>
                    <div id="searchModeOptions" style={{display: "flex", gap: "10px", justifyContent: "space-between", marginTop: "20px"}}>
                      <div id="addQuery" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Add Query</div>
                      <div id="searchTable" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Search Table</div>
                      <div id="clearAll" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Clear All</div>
                    </div>
                  </div>
                </div>




                <div id="moreExampleWrapper" style={{display: (this.state.showMoreExamples)? "block" : "none", maxHeight: (this.state.showMoreExamples)? "300px" : 0, padding: (this.state.showMoreExamples)? "15px" : 0, opacity: (this.state.showMoreExamples)? 1 : 0, transition: "max-height 0.5s, padding 0.3s, opacity 0.3s", overflow: "hidden", backgroundColor: "#2e3e51", boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", alignItems: "center", borderRadius: "8px", border: "1px solid black"}}>
                  <div id="moreExampleContainer" style={{display: "flex", flexDirection: "column", gap: "10px", cursor: 'pointer', color: "white", overflow: "auto", height: "100%"}}>
                    <div id="moreExampleTitle" style={{textAlign: "center", fontSize: "25px", textDecoration: "underline", marginBottom: "20px"}}>Types Of Queries</div>
                    <div id="moreExampleSubTitle" style={{textAlign: "center", fontSize: "20px"}}>General Syntax:- &lt;keyword&gt; &lt;operator&gt; &lt;value&gt;</div>
                    <table id="moreExamples" style={{border: "2px solid white", padding: "10px 5px", width: "100%", borderCollapse: "collapse", tableLayout: "fixed"}}>
                      <thead>
                        <tr>
                          <th id="col1Title" style={{border: "1px solid white", padding: "8px", fontWeight: "bolder", textAlign: "center"}}>Operator</th>
                          <th id="col2Title" style={{border: "1px solid white", padding: "8px", fontWeight: "bolder", textAlign: "center"}}>Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td id="ex1Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"=" (Equals Sign)</td>
                          <td id="ex1Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>gender = female</td>
                        </tr>
                        <tr>
                          <td id="ex2Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"&lt;" (Less Than Sign)</td>
                          <td id="ex2Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>low morph &lt; 5</td>
                        </tr>
                        <tr>
                          <td id="ex3Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"&lt;" (Greater Than Sign)</td>
                          <td id="ex3Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>question number &gt; 20</td>
                        </tr>
                        <tr>
                          <td id="ex4Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"!=" (Not Equals Sign)</td>
                          <td id="ex4Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>mean != 10</td>
                        </tr>
                        <tr>
                          <td id="ex5Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"," (Comma Sign - to combine queries)</td>
                          <td id="ex5Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>gender = female, low morph &lt; 5, mean != 10, ...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div> */}





          {/* New Changes */}

          <div id="searchMenuWrapper" style={{display: "flex", position: "relative"}}>
            <button id="searchMenuBtn" 
              style={{
                padding: '12px 24px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#2C3E50',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                transition: "transform 0.25s linear",
              }} 
              onClick={this.handleClick}>
                Click To Search Table
            </button>
            <div id="searchMenuContainer" 
                 style={{
                  display: (this.state.toggleSearchMenu)? "block" : "none",
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 0,
                  zIndex: 1,
                  marginTop: "55px",
                  width: "700px",
                  backgroundColor: "#1d2734", 
                  boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", 
                  boxSizing: "border-box", 
                  padding: "30px 24px", 
                  borderRadius: "8px", 
                  // height: "500px",
                  overflow: "auto",
                  fontWeight: "500"
              }}>
                <div id="searchMenuModes" style={{display: "flex", flexDirection: "column", gap: "20px", cursor: 'pointer', color: "white", height: "100%"}}>
                  <div style={{fontSize: "25px"}}>Your Search Queries: &nbsp;
                    <span style={{fontFamily:"serif", fontSize: "25px", textWrap:"wrap"}}>
                      {(this.state.searchInput)? this.state.searchInput : "None"}
                    </span>
                  </div>
                  <hr style={{width: "100%"}}></hr>
                    <div id="searchModeContainer" 
                      style={{display: "flex", flexDirection: "column", gap: "10px", cursor: 'pointer', color: "white", 
                              overflow: "auto", height: "100%", padding: "30px", backgroundColor: "#2e3e51", boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", 
                              borderRadius: "8px"
                            }}>
                      <div id="searchModesHeader" style={{display: "flex", justifyContent: "space-between", marginBottom: "20px"}}>
                        <div id="searchMode1Title" onClick={this.handleClick} style={{textAlign: "center", fontSize: "25px", textDecoration: (this.state.toggleSearchMode)? "none" : "underline"}}>
                          Easy Search
                        </div>
                        <div id="searchMode2Title" onClick={this.handleClick} style={{textAlign: "center", fontSize: "25px", textDecoration: (this.state.toggleSearchMode)? "underline" : "none"}}>
                          Advanced Search
                        </div>
                      </div>
                      {(this.state.toggleSearchMode)?
                        <div id="searchMode2" style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                          <div id="searchbarContent" 
                            style={{
                              display: (this.state.toggleSearchMode) ? "flex" : "none", 
                              alignItems: "center", 
                              width: "100%", 
                              borderRadius: "8px", 
                              cursor: 'pointer',
                              border: "2px solid white",
                              gap: "5px"
                            }}>
                            <IoSearch style={{padding: "8px", borderRight: "2px solid white"}} 
                              name="searchIcon" width={25} height={25} strokeWidth={25} stroke="white" fill="white" 
                              onClick={this.handleToggle}/>
                            <input type="text" 
                              id="searchbar" name="searchbar" placeholder='Search Queries and Filter Table...' 
                              style={{border: "none", padding: "5px", background: "transparent", color: "white", fontSize: "15px", flex: 1}}
                              onKeyDown={this.handleToggle}
                              onChange={this.handleChange}/>
                          </div>
                          <div id="searchKeywordsContainer" style={{display: "flex", flexDirection: "column", gap: "5px", cursor: 'pointer', color: "white", overflow: "auto", height: "100%"}}>
                            <div id="searchKeywordsTitle" style={{textAlign: "center", fontSize: "22px", textDecoration: "underline", marginBottom: "20px"}}>TYPES OF KEYWORDS</div>
                            <div id="keywordsDpdn" style={{display: "grid", gap: "10px", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))"}}>
                              {[...uniqueDataKeys].map((item, index) => {
                                return (
                                  <div key={index+1} id={`option${index}`} style={{fontFamily:"serif", fontSize: "20px", whiteSpace: "nowrap", textAlign: "center"}}> 
                                    {(item.includes("_"))? (item.split("_")).join(" ") : item }
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        :
                        <div id="searchMode1" style={{display: "flex", flexDirection: "column", gap: "30px"}}>
                          <div id="searchModeDetails" style={{display: "flex", gap: "15px", justifyContent: "space-between"}} >
                            <select name="search_kywd" id="search_kywd" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}>
                              <option disabled selected value="">Choose A Keyword</option>
                              {[...uniqueDataKeys].map((item, index) => {
                                    return (
                                      <option key={index+1} id={`option${index}`} value={(item.includes("_"))? (item.split("_")).join(" ") : item}> 
                                        {(item.includes("_"))? (item.split("_")).join(" ") : item}
                                      </option>
                                    )
                                  })}
                            </select>
                            <select name="search_op" id="search_op" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}>
                              <option disabled selected value="">Choose An Operator</option>
                              <option value="=">=</option>
                              <option value="<">&lt;</option>
                              <option value=">">&gt;</option>
                              <option value="!=">!=</option>
                            </select>
                            <input type="text" name="search_val" id="search_val" placeholder="Type A Value" autoComplete="off" style={{background: "transparent", padding: "8px", border: "none", borderBottom: "1px solid white", color: "white", fontSize: "15px", textAlign: "center"}}></input>
                          </div>
                          <div id="searchModeOptions" style={{display: "flex", gap: "10px", justifyContent: "space-between"}}>
                            <div id="addQuery" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Add Query</div>
                            <div id="searchTable" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Search Table</div>
                            <div id="clearAll" style={{color: '#ffffff', backgroundColor: "rgb(29, 39, 52)", borderRadius: "8px", border: "1px solid white", padding: "5px"}} onClick={this.handleSearchClick}>Clear All</div>
                          </div>
                        </div>
                      }
                  </div>
                </div>
            </div>
          </div>


          <div id="helpSearchWrapper" style={{display: "flex", position: "relative"}}>
            <button id="helpSearchBtn" 
              style={{
                padding: '12px 24px',
                fontSize: '20px',
                fontWeight: '600',
                color: '#ffffff',
                backgroundColor: '#2C3E50',
                borderRadius: '8px',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box',
                transition: "transform 0.25s linear",
                zIndex: 2
              }} 
              onClick={this.handleClick}>
                Need Help?
            </button>

            <div id="helpSearchContainer" 
                 style={{
                  display: (this.state.toggleHelpSearch)? "block" : "none",
                  position: "absolute",
                  right: 0,
                  left: 0,
                  top: 0,
                  zIndex: 1,
                  marginTop: "55px",
                  width: "400%",
                  backgroundColor: "#1d2734", 
                  boxShadow: "0 0 0 2px #ffffff, 0 0 0 5px #4A6572", 
                  boxSizing: "border-box", 
                  padding: "30px 24px", 
                  borderRadius: "8px", 
                  overflow: "auto",
                  fontWeight: "500"
                 }}>
                <div id="helpSearchDetails" style={{display: "flex", flexDirection: "column", gap: "10px", cursor: 'pointer', color: "white", height: "100%", overflow: "auto"}}>
                  <h1 id="moreExampleTitle" style={{textAlign: "center", fontSize: "25px", textDecoration: "underline", marginBottom: "20px"}}>Types Of Queries</h1>
                  <div id="moreExampleSubTitle" style={{textAlign: "center", fontSize: "20px"}}>General Syntax:- &lt;keyword&gt; &lt;operator&gt; &lt;value&gt;</div>
                  <table id="moreExamples" style={{border: "2px solid white", padding: "10px 5px", width: "100%", borderCollapse: "collapse", tableLayout: "fixed"}}>
                    <thead>
                      <tr>
                        <th id="col1Title" style={{border: "1px solid white", padding: "8px", fontWeight: "bolder", textAlign: "center"}}>Operator</th>
                        <th id="col2Title" style={{border: "1px solid white", padding: "8px", fontWeight: "bolder", textAlign: "center"}}>Example</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td id="ex1Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"=" (Equals Sign)</td>
                        <td id="ex1Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>gender = female</td>
                      </tr>
                      <tr>
                        <td id="ex2Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"&lt;" (Less Than Sign)</td>
                        <td id="ex2Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>low morph &lt; 5</td>
                      </tr>
                      <tr>
                        <td id="ex3Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"&lt;" (Greater Than Sign)</td>
                        <td id="ex3Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>question number &gt; 20</td>
                      </tr>
                      <tr>
                        <td id="ex4Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"!=" (Not Equals Sign)</td>
                        <td id="ex4Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>mean != 10</td>
                      </tr>
                      <tr>
                        <td id="ex5Op" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>"," (Comma Sign - to combine queries)</td>
                        <td id="ex5Ex" style={{border: "1px solid white", padding: "8px", textAlign: "center"}}>gender = female, low morph &lt; 5, mean != 10, ...</td>
                      </tr>
                    </tbody>
                  </table>
                  {/* <hr style={{width: "100%"}}></hr> */}
                  <h1 style={{textDecoration: "underline", textAlign: "center", fontSize: "25px"}}>Example of Valid Queries</h1>
                  <div>Single Query: <span style={{fontFamily:"serif", fontSize: "20px"}}>correct response = 2 OR percent difference &lt; 50</span></div>
                  <div>Multiple Queries: <span style={{fontFamily:"serif", fontSize: "20px"}}>correct response = 2, percent difference &lt; 50, ...</span></div>
                </div>
            </div>
          </div>






        </div>
      </div>
      {this.state.toggleDataView ? <this.DataToSlideshow props={this.state.newTableData} handleToggle={this.handleToggle} toggleDetailsView={this.state.toggleDetailsView}  currentSlide={this.state.currentSlide} prevSlide={this.prevSlide} nextSlide={this.nextSlide} slideTransition={this.state.slideTransition}></this.DataToSlideshow> : <this.DataToTable props={this.state.newTableData} ></this.DataToTable>}
      </>
    )
    :
    <>
    <p>This test version has no trials. Please upload test trials.</p>
    <input type="file" onChange={this.onTrialsFileInput} />
    </>
  }
}


