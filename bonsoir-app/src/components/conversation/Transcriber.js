import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './styles/Transcriber.css';

// a component that prints transcribed french speech in real time.
// Once it's finished transcribing, it updates the current conversation
// with this new statement.
function Transcriber(props)
{
    const convoID = props.id;

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
            const doThing = async () =>
            {
                // once final transcript is complete, first create a new
                // statement:
                const newStatementId = await createStatement(finalTranscript);

                // Then take the id of the newly created statement
                // and append it to the current conversation
                await updateConversation(newStatementId);
            }
            doThing();
        }
    }, [finalTranscript])

    const createStatement = async (text) => {
        console.log("Creating new statement...");
        const url = 'http://localhost:3001/create-statement/';
        const method = 'post';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify({'statementText':text})
        const options = {method:method,headers:headers,body:body};
        const res = await fetch(url,options);
        const res_json = await res.json();
        console.log(`Finished creating statement, res_json = ${JSON.stringify(res_json)}`);
        return res_json.statementId;
    }

    const updateConversation = async (statementID) => {
        console.log("Updating conversation...");
        const url = 'http://localhost:3001/update-conversation/';
        const method = 'post';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify({'convoID':convoID, 'statementID':statementID})
        const options = {method:method,headers:headers,body:body};
        const res = await fetch(url,options);
        const res_json = await res.json();
        console.log(res_json);

    }

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
        <div className='transcript-input-wrapper'>
            <div className='transcript-input'>{transcript}</div>
            <div className='transcript-button-wrapper'>
            <button onClick={toggleRecording}>{listening ? 'Stop Recording' : 'Start Recording'}</button>
            </div>
        </div>
    )
}

export default Transcriber;