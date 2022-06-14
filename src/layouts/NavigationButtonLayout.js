import React from 'react';

export const NavigationButtonLayout = buttons => {
  const {back_button, continue_button} = buttons;
  return (
    <>
    <div className="navigation-buttons">
    <div className="back-button-container">{back_button}</div>
    <div className="continue-button-container">{continue_button}</div>
    </div>
    </>
  )
}
