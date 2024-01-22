import { useState, useEffect, useMemo, useContext, useRef } from 'react';
import { createClient } from '@deepgram/sdk';
import { inputCtx } from './Conversation.js';
import './styles/Transcriber.css'

// a component that prints transcribed french speech in real time.
// Once it's finished transcribing, it updates the current conversation
// with this new statement.
function Transcriber(props)
{
  const [apiKey, setApiKey] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [socket, setSocket] = useState(null);
  const [transcript,setTranscript] = useState('');
  const [ recording, setRecording ] = useState(false);
  const { input, setInput } = useContext(inputCtx);
  const socketRef = useRef(null);

  // on the initial render:
  //  1. get and set the api key
  //  2. get and set the user's microphone
  useEffect(() => {
    getApiKey();
    getMicrophone();
  }, []);

  // once we have the key, set up socket
  useMemo(() => {
    function getSocket() {
      const _deepgram = createClient(apiKey);
      const options = { model: "nova-2", smart_format: true, 
                        language: 'fr', interim_results: true,
                        endpointing: 10 }
      const _socket = _deepgram.listen.live(options);
      setSocket(_socket);
    }

    if (apiKey)
    {
      getSocket();
    }
    
  }, [apiKey]);

  // once we have socket, define socket behavior
  useMemo(() => {
    if (socket)
    {
      socketRef.current = socket;
      setupSocket(socket);
    }
  }, [socket])

  async function getApiKey() {
    const result = await fetch("http://localhost:3001/apiKey");
    const json = await result.json();
    setApiKey(json.apiKey);
  }

  // request access to user's microphone
  async function getMicrophone() {
    const userMedia = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const userMicrophone = new MediaRecorder(userMedia);
    setMicrophone(userMicrophone);
  }

  // define socket behavior
  function setupSocket(socket) {
    if (socket)
    {
      socket.on("Results", data => {
        console.log("Received data from WebSocket:", data);
      
        const _transcript = data.channel.alternatives[0].transcript;
      
        if (_transcript) {
          setTranscript(_transcript);
        }
      
        if (data.speech_final && _transcript) {
          console.log("speech_final detected");
          updateConversation(_transcript);
        }
      });
      
    }
  }

  // start listening to user and sending
  // user audio to deepgram
  async function startListening(microphone,socket) {
    setRecording(true);
    await microphone.start(500);
  
    microphone.onstart = () => {
      console.log("client: microphone opened");
    };
  
    microphone.onstop = () => {
      console.log("client: microphone closed");
    };
  
    microphone.ondataavailable = (e) => {
      const data = e.data;
      // console.log("client: sent data to websocket");
      socket.send(data);
    };
  }

  // update conversation with new statement
  async function updateConversation(statement) {
    console.log("Updating conversation...");
    const url = 'http://localhost:3001/update-conversation/';
    const method = 'post';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'convoID':props.convoID, 'statement':statement})
    const options = {method:method,headers:headers,body:body};
    const res = await fetch(url,options);
    const res_json = await res.json();
    console.log(`updatedConversation with res_json=${JSON.stringify(res_json)}`);
    setInput(statement);
}

  // stop listening to user
  function stopListening(microphone) {
    setRecording(false);
    microphone.stop();
  }
  

  return (
    <div className='transcriber-wrapper'>
      <p className='transcript'>{transcript}</p>
      <div className='transcriber-buttons'>
        <button onClick={() => {startListening(microphone,socket)}} disabled={recording}>Start recording</button>
        <button onClick={() => {stopListening(microphone)}} disabled={!recording}>Stop recording</button>
      </div>
    </div>
  )
}

export default Transcriber;