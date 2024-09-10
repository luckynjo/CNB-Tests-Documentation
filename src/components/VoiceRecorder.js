import React, { useState, useRef } from 'react';
import axios from 'axios';
import AudioConsentPopup from './AudioConsentPopup';

export default function VoiceRecorder(props) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [hasConsented, setHasConsented] = useState(null);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            setAudioBlob(blob);
            setAudioUrl(URL.createObjectURL(blob));
            audioChunksRef.current = [];
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    const saveRecording = async() => {
        if (!audioBlob) return;
        const formData = new FormData();
        const uniqueFileName = `recording_${Date.now()}.wav`;

        formData.append('file', audioBlob, uniqueFileName);

        try {
            // save audio file to db
            await axios.post('administer.pl', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            alert('Recording saved successfully');
        } catch (error) {
            console.error('Error saving recording: ', error);
        }
    };

    const handleConsent = (consent) => {
        setHasConsented(consent);

        if (consent) {
            alert('You consented your audio to being recorded. Recording will begin now');
            startRecording();
        } else {
            alert('You did not consent your audio to being recorded. Recording will not start');
        }
    };

    return (

        <div>
            {hasConsented === null && <AudioConsentPopup onConsent={handleConsent} />}
            {hasConsented === true && (
            <>
                <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
                <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
                <button onClick={saveRecording} disabled={!audioBlob}>Save Recording</button>
        {audioUrl && (
            <div>
                <p>Playback</p>
                <audio controls src={audioUrl} />
            </div>
        )}
        </>
    )}
        </div>
    );
};
