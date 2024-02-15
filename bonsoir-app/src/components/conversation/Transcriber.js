import { useState, useEffect, useContext } from 'react';
import { LiveTranscriptionEvents,createClient } from '@deepgram/sdk';
import { useAuth0 } from '@auth0/auth0-react';
import { inputCtx } from '../../pages/ConversationPage.js';
import './styles/Transcriber.css'

// on initial render -> get api key and user microphone
// when user presses 'start recording' -> create & open a websocket to deepgram
// once websocket is created & open -> start sending data from microphone to deepgram 
// when user presses 'stop recording' -> close websocket & stop microphone
function Transcriber(props)
{
    const [apiKey, setApiKey] = useState('');
    const [microphone,setMicrophone] = useState('');
    const [socket, setSocket] = useState('');
    const [socketOpen, setSocketOpen] = useState(false);
    const [transcript,setTranscript] = useState('');
    const [blobUrl, setBlobUrl] = useState(null);
    const { speaker, setSpeaker, input, 
            setInput, messageId, setMessageId,
            playing, setPlaying,
            recording, setRecording,
            thinking, setThinking } = useContext(inputCtx);
    const { user } = useAuth0();

    useEffect(() => {
        getApiKey();
        getMicrophone();
    },[])

    useEffect(() => {
        if (socket && socketOpen)
        {
            setupLink();
        }
    }, [socket,socketOpen])

    async function getApiKey() {
        const result = await fetch("http://localhost:3001/apiKey");
        const json = await result.json();
        setApiKey(json.apiKey);
    }

    async function getMicrophone() {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const userMicrophone = new MediaRecorder(userMedia);

        userMicrophone.onstart = () => {
            console.log("microphone opened");
        };
        
        userMicrophone.onstop = () => {
            console.log("microphone closed");
        };

        setMicrophone(userMicrophone);
      }

    function getSocket() {
        const _deepgram = createClient(apiKey);
        const options = { model: "nova-2", smart_format: true, 
                          language: 'en-AU', interim_results: true,
                          endpointing: 50 }
        const _socket = _deepgram.listen.live(options);

        _socket.on(LiveTranscriptionEvents.Open, () => {
            console.log("socket opened");
            setSocketOpen(true);
        })

        _socket.on(LiveTranscriptionEvents.Close, () => {
            console.log("socket closed");
            setSocketOpen(false);
        })

        setSocket(_socket);
      }
    
    async function setupLink()
    {
        microphone.ondataavailable = (e) => {
            socket.send(e.data);
        }

        socket.on("Results", async (data) => {
            const _transcript = data.channel.alternatives[0].transcript;

            if (_transcript) {
                setTranscript(_transcript);
            }

            if (_transcript && data.speech_final)
            {
                closeSocket();
                setThinking(true);
                const query = {text:_transcript, id: messageId};
                await updateConversation(speaker,query);
                setInput(_transcript);
                const bonsoirResponse = await getResponse(_transcript);
                await updateConversation('Bonsoir',bonsoirResponse);
                setTranscript('');
            }
        })

        await microphone.start(500);
        const audioURL = process.env.PUBLIC_URL + '/sounds/mic_open.mp3';
        const micStartAudio = new Audio(audioURL);
        micStartAudio.play(); 
        setRecording(true);
    }

    function closeSocket()
    {
        microphone.stop();
        socket.finish();
        const audioURL = process.env.PUBLIC_URL + '/sounds/mic_close.mp3';
        const micStopAudio = new Audio(audioURL);
        micStopAudio.play(); 
        setRecording(false);
    }

    // update conversation with new statement
  async function updateConversation(speaker,statement) {
    const url = 'http://localhost:3001/update-conversation/';
    const method = 'post';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'convoID':props.convoID, speaker:speaker, 'statement':statement, 'messageId': statement.id})
    const options = {method:method,headers:headers,body:body};
    await fetch(url,options);
    setInput(statement);
  }
  
  // gets response from chatgpt
  async function getResponse(statement) {
    const url = 'http://localhost:3001/post-query/';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'query':statement,'parentMessageId':messageId})
    const options = {method:'post',headers:headers,body:body};
    const res = await fetch(url,options);
    const res_json = await res.json();
    setMessageId(res_json.id);
    const audio = res_json.audio;
    const audioArray = Object.values(audio);
    const uint8Array = new Uint8Array(audioArray);
    const blob = new Blob([uint8Array], { type: 'audio/wav' });
    setBlobUrl(URL.createObjectURL(blob));
    console.log(blobUrl);
    setThinking(false);
    const reply = {'text':res_json.text,'audio':blob, 'id': res_json.id};
    return reply;
  }
  
  function startPlaying()
  {
    setPlaying(true);
    setSpeaker('Bonsoir');
  }

  function stopPlaying()
  {
    setPlaying(false);
    setSpeaker(user.name);
  }

    return (
        <div className='transcriber-wrapper'>
        <p className='transcript'>{transcript ? transcript : props.disabled ? 'Create a new conversation or load an existing conversation using the bar on the left.': 'Transcribed speech will appear here.'}</p>
        <div className='transcriber-buttons'>
            {!recording && !thinking && <button className='btn' onClick={() => getSocket()} disabled={props.disabled || playing || speaker === 'Bonsoir'}>Start recording</button>}
            {recording && <button className='btn recording' onClick={() => closeSocket()}>Recording, Click to Cancel</button>}
            {thinking && <button className='btn' disabled><div className='loader'></div></button>}
            <audio autoPlay src={blobUrl} onPlay={startPlaying} onPause={stopPlaying}/>
        </div>
        </div>
    )
}

export default Transcriber;