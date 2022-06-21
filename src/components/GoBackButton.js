import React from 'react';

export const GoBackButton = props =>
{
	const {text, classList, onClick} = props;
	return (
		<button className={"button back-button" + (classList ? " " + classList : "")} onClick={onClick} >{text && text.toUpperCase() || 'GO BACK'}</button>
	);
}
