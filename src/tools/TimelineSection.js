import React, {useEffect, useState} from 'react';
import axios from 'axios';

export const TimelineSection = props => {
  const {id, language, content, ...rest} = props;

  console.log('content here is ', content);

  const data = content ? JSON.parse(content) : null;
  return data ?
  (
    <table className="translate left">
    <tbody>
    {data.map((item, index) => {
      return <tr key={index}><td><p key={index}>{item}</p></td></tr>
    })}
    </tbody>
    </table>
  )
  :
  <p>Loading ....</p>
}
