import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './styles/Transcriber.css';

function Transcriber()
{
    const {
        transcript,
        interimTranscript,
        finalTranscript,
        resetTranscript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

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