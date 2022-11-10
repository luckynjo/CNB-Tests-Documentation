import React, { useState, useEffect } from 'react';
import angry_emoji from '../assets/er40Child/anger_transparent.png';
import happy_emoji from '../assets/er40Child/happy_transparent.png';
import fear_emoji from '../assets/er40Child/fear_transparent.png';
import noe_emoji from '../assets/er40Child/Neutral_transparent.png';
import sad_emoji from '../assets/er40Child/sad_transparent.png';
import ER40ChildDemoInstructionsPage1 from '../instructions/ER40ChildDemoInstructionsPage1.js';
import ER40ChildDemoInstructionsPage2 from '../instructions/ER40ChildDemoInstructionsPage2.js';
import ER40ChildDemoInstructionsPage3 from '../instructions/ER40ChildDemoInstructionsPage3.js';
import ER40ChildDemoInstructionsPage4 from '../instructions/ER40ChildDemoInstructionsPage4.js';
import ER40ChildDemoInstructionsPage5 from '../instructions/ER40ChildDemoInstructionsPage5.js';

export default class ER40ChildSlideshow extends React.Component {
  constructor(props)
  {
    super(props);
    this.state={
      current_page:0,
      num_of_pages:4
    };

    this.next = this.next.bind(this);
    this.restart = this.restart.bind(this);
  }

  componentDidMount(){
    setTimeout(this.next, 5000);
  }

  next(){
    const curPage = this.state.current_page;
    const numPages = this.state.num_of_pages;
    if(curPage < numPages){
      const nextCurPage = curPage+1;
      this.setState({
        current_page: nextCurPage
      });
      setTimeout(this.next, 5000);
    }
  }

  restart(){
    this.setState({
        current_page:0,
        num_of_pages:4
    });
    this.next();
  }

  render()
  {
    const curPage = this.state.current_page;
    return(
      <div>
        {curPage === 0 ? <ER40ChildDemoInstructionsPage1 canContinue={this.props.canContinue} instructions={this.props.instructions} /> :
          curPage === 1 ? <ER40ChildDemoInstructionsPage2 instructions={this.props.instructions}/> :
          curPage === 2 ? <ER40ChildDemoInstructionsPage3 instructions={this.props.instructions}/> :
          curPage === 3 ? <ER40ChildDemoInstructionsPage4 instructions={this.props.instructions}/> :
          <ER40ChildDemoInstructionsPage5 text={this.props.text} replay={this.restart} canContinue={this.props.canContinue}/>
        }
      </div>
    );
  }
}
