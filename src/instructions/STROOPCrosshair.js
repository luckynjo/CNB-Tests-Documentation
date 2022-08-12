import React from "react";

export class STROOPCrosshair extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidMount(){
    setTimeout(this.props.onContinue, 2000);
  }

  render(){
    return(
      <div className="center">
        <div className="stimulus-text--medium text--center">+</div>
      </div>
    );
  }
}
