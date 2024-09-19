import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AudioConsentPopup from './AudioConsentPopup';
import mic from '../assets/mic.svg';
import stop_btn from '../assets/record-btn.svg';

export default function VoiceRecorder(props) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState('');
    const [recordingTime, setRecordingTime] = useState(0);
    const [timerVisible, setTimerVisible] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [hasConsented, setHasConsented] = useState(null);

    useEffect(() => {
        let timer;
        if (isRecording) {
            setTimerVisible(true);
            timer = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRecording]);

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
        setRecordingTime(0);
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        setTimerVisible(false);
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
            alert('You consented your audio to being recorded.');
            // startRecording();
        } else {
            alert('You did not consent your audio to being recorded.');
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }

    return (

        <div>
            {hasConsented === null && <AudioConsentPopup onConsent={handleConsent} />}
            {hasConsented === true && (
            <>
                {(!isRecording && !audioBlob) && <p>Click the button to start recording...</p>}
                {!isRecording && <button onClick={startRecording}><img src={mic}/></button>}
                {isRecording && <button onClick={stopRecording}><img src={stop_btn}/>{timerVisible && (<p>{formatTime(recordingTime)}</p>)}</button>}
                {(!isRecording && audioBlob) && <button onClick={saveRecording}>Save Recording</button>}
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
