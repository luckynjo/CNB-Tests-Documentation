import React from 'react';

export const BeginHeader = props =>
{
  //console.log('given ', {paragraph_props});
  //const {key, content} = {paragraph_props};
  const {text, classList, ...rest} = props;
  return (<h1 className={classList || ''}>{text}</h1>)
}
