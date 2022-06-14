import React from 'react';

export const Span = props =>
{
  const {text, classList} = props;
  return (<span classList={classList}>{text}</span>);
}
