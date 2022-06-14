import React from 'react';

export const Paragraph = props =>
{
  //console.log('given ', {paragraph_props});
  //const {key, content} = {paragraph_props};
  const {text, classList, ...rest} = props;
  return (<p className={'paragraph ' + classList}>{text}</p>)
}
