import React from 'react';

export default function ResponseButton(props)
{
	if(props.img)
	{
		return (
			<div classList={"button " + props.classList} onClick={(e) => props.onClick(props.response, e)}>
			 <img src={props.img} alt={props.text || 'Response button'}/>
			 {props.secondaryContent && props.secondaryContent}
			</div>
		);
	}
	else
	{
		return (
			<div classList={"button " + props.classList} onClick={(e) => props.onClick(props.response, e)}>{props.text}
			{props.secondaryContent && props.secondaryContent}
			</div>
		)
	}

};
