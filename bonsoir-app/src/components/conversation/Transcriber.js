import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@deepgram/sdk';
import './styles/Transcriber.css'

// a component that prints transcribed french speech in real time.
// Once it's finished transcribing, it updates the current conversation
// with this new statement.
function Transcriber()
{
  const [apiKey, setApiKey] = useState(null);
  const [microphone, setMicrophone] = useState(null);
  const [socket, setSocket] = useState(null);
  const [transcript,setTranscript] = useState('');

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
      const options = { model: "nova-2", smart_format: true, language: 'fr', interim_results: true }
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
      socket.on("open", () => {
        console.log("socket open");
        socket.on("Results", data => {
          const _transcript = data.channel.alternatives[0].transcript;
          console.log(`data.channel.alternatives[0] = ${JSON.stringify(data.channel.alternatives[0])}`)

          if (_transcript)
          {
            setTranscript(_transcript)
          }
        })

      })
    }
  }

  // start listening to user and sending
  // user audio to deepgram
  async function startListening(microphone,socket) {
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

  // stop listening to user
  async function stopListening(microphone) {
    microphone.stop();
  }


  
  return (
    <div className='transcriber-wrapper'>
      <p className='transcript'>{transcript}</p>
      <div className='transcriber-buttons'>
        <button onClick={() => {startListening(microphone,socket)}}>Start recording</button>
        <button onClick={() => {stopListening(microphone)}}>Stop recording</button>
      </div>
    </div>
  )
}

export default Transcriber;