import React from 'react';
import {NavigationButtonLayout} from '../layouts/NavigationButtonLayout.js';
import {ContinueButton} from '../components/ContinueButton.js';
import {GoBackButton} from '../components/GoBackButton.js';
import {BeginHeader} from '../components/BeginHeader.js';
import {Row} from '../layouts/Row.js';

export const BeginPage = props => {
  const {title, onContinue, onGoBack, goBackTo, continue_button_text, back_button_text, hideGoBack} = props;

  return (
    <>
    <div className="begin-page">
     <h2 className="title justify-content-center center">{title}</h2>
    </div>
    <div className="position-bottom--absolute">
    <table className="buttons-table">
    <tbody>
    <tr>
    <td><div>{!hideGoBack && <GoBackButton text={back_button_text} onClick={onGoBack}/>}</div></td>
    <td><ContinueButton text={continue_button_text} onClick={onContinue}/></td>
    <td><div></div></td>
    </tr>
    </tbody>
    </table>
    </div>
    </>
  )
}
