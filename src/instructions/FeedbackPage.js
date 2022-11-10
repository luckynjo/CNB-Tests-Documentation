import React from 'react';
import {SimpleInstructionsParser} from '../utils/SimpleInstructionsParser.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {Row} from '../layouts/Row.js';
/***
Instructions renders text / images / html content that is defined in a test and passed as props.
*/
export default class FeedbackPage extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  componentDidMount(){
    setTimeout(() =>this.props.updateCorrectFeedback(false), 3000);
  }

  render(){
    const {instructions} = this.props;
    return (
      <>
      <div className = "instructions" style={{position: "absolute", top: "50%", textAlign: "center"}}>
          <p style={{color: "#009900"}}>{instructions}</p>
      </div>
      </>
    )
  }
}
