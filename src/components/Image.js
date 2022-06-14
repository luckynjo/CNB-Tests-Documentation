import React from 'react';

export const Image = props =>
{
  const {text, img_url, classList} = props;
  return (<img alt={text} src={img_url} className={'img ' + classList}></img>);
}
