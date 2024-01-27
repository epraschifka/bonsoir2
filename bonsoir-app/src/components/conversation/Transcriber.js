import { useState, useEffect, useContext } from 'react';
import { LiveTranscriptionEvents,createClient } from '@deepgram/sdk';
import { inputCtx } from './Conversation.js';
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
    const [recording,setRecording] = useState(false);
    const [transcript,setTranscript] = useState('');
    const { speaker, setSpeaker, 
            input, setInput, 
            messageId, setMessageId } = useContext(inputCtx);

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
                          language: 'fr', interim_results: true,
                          endpointing: 10 }
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
            console.log('sending data...');
            socket.send(e.data);
        }

        socket.on("Results", async (data) => {
            const _transcript = data.channel.alternatives[0].transcript;
            console.log('data received');

            if (_transcript) {
                setTranscript(_transcript);
            }

            if (_transcript && data.speech_final)
            {
                closeSocket();
                await updateConversation(speaker,_transcript);
                setSpeaker('bonsoir');
                setInput(_transcript);
                const bonsoirResponse = await getResponse(_transcript);
                await updateConversation('bonsoir',bonsoirResponse);
                setSpeaker('human');
                getSocket();
            }
        })

        await microphone.start(500);
        setRecording(true);
    }

    function closeSocket()
    {
        microphone.stop();
        socket.finish();
        setRecording(false);
    }

    // update conversation with new statement
  async function updateConversation(speaker,statement) {
    const url = 'http://localhost:3001/update-conversation/';
    const method = 'post';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'convoID':props.convoID, speaker:speaker, 'statement':statement})
    const options = {method:method,headers:headers,body:body};
    const res = await fetch(url,options);
    const res_json = await res.json();
    setInput(statement);
  }

  // gets response from chatgpt
  async function getResponse(statement) {
    const url = 'http://localhost:3001/post-query/';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'query':statement})
    const options = {method:'post',headers:headers,body:body};
    const res = await fetch(url,options);
    const res_json = await res.json();
    const res_text = res_json.myText;
    return res_text;
  }

    return (
        <div className='transcriber-wrapper'>
        <p className='transcript'>{transcript}</p>
        <div className='transcriber-buttons'>
            <button onClick={() => getSocket()} disabled={recording}>Start recording</button>
            <button onClick={() => closeSocket()} disabled={!recording}>Stop recording</button>
        </div>
        </div>
    )
}

export default Transcriber;