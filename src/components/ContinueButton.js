import React from 'react';

export const ContinueButton = props =>
{
    const {text, classList, onClick} = props;
  	return <button className={"button continue-button center--horizontal" + (classList ? " " + classList : "")} onClick={onClick}>{text && text.toUpperCase() || "CLICK HERE TO CONTINUE"}</button>
}
