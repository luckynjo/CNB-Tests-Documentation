import React from 'react';

export class PlayButton extends React.Component {
  constructor(props){
    super(props);
    this.state={};
  }

  render(){
    return (
      <div>
        <div className={this.props.countdown ? "cprChild--button--triangle--countdown" : this.props.test ? "cprChild--button--triangle--test"  : "cprChild--button--triangle"}>
        </div>
      </div>
    );
  }
}
