import React from 'react';

function AudioConsentPopup(props) {
    const handleYes = () => {
        props.onConsent(true);
    };

    const handleNo = () => {
        props.onConsent(false);
    };

    return (
        <div className="consent-popup">
            <p>Do you consent to your audio being recorded?</p>
            <button onClick={handleYes}>Yes</button>
            <button onClick={handleNo}>No</button>
        </div>
    );
}

export default AudioConsentPopup;
