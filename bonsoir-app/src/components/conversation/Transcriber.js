import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './styles/Transcriber.css';

// a component that prints transcribed french speech in real time.
// Once it's finished transcribing, it updates the current conversation
// with this new statement.
function Transcriber(props)
{
    const convoID = props.convoID;

    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (finalTranscript)
        {
            const updateConversation = async (statement) => {
                console.log("Updating conversation...");
                const url = 'http://localhost:3001/update-conversation/';
                const method = 'post';
                const headers = {'Content-Type': 'application/json'};
                const body = JSON.stringify({'convoID':convoID, 'statement':statement})
                const options = {method:method,headers:headers,body:body};
                const res = await fetch(url,options);
                const res_json = await res.json();
                console.log(res_json);
            }

            const statement = {'text':finalTranscript,'audio':''};
            updateConversation(statement);
        }
    }, [finalTranscript])

    function toggleRecording()
    {
        if (!listening)
        {
            SpeechRecognition.startListening({ language: 'fr-FR'});
        }
        else
        {
            SpeechRecognition.stopListening();
        }
    }

    return (
        <div className='transcript-wrapper'>
            <div className='transcript-log'></div>
            <div className='transcript-input'>
                <p className='transcript-input-text'>{transcript}</p>
                <div className='transcript-input-button-wrapper'>
                    <button className='transcript-input-button' onClick={toggleRecording}>{listening ? 'Stop recording' : 'Start recording'}</button>
                </div>
            </div>
        </div>
    )
}

export default Transcriber;