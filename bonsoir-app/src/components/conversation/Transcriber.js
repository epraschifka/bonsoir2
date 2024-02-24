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
    const [pending, setPending] = useState(false);
    const [micAccess, setMicAccess] = useState(false);
    const [gettingSocket, setGettingSocket] = useState(false);
    const [audioElement, setAudioElement] = useState(new Audio());
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
      try {
        const result = await fetch(`${process.env.REACT_APP_SERVER_URL}/apiKey`);
        const json = await result.json();
        setApiKey(json.apiKey);
      } 
      catch (error) {
        props.setAlert('Error getting API key. Check your internet connection or try again later.');}
    }

    async function getMicrophone() {
      let userMedia;

      try {
        userMedia = await navigator.mediaDevices.getUserMedia({audio: true});
      } 
      catch {
        props.setAlert('Access to microphone denied. Please allow access to your microphone or try again later.');
      }

      setMicAccess(true);

      let mimeType = 'audio/webm';

      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/mp4';
      }

      const userMicrophone = new MediaRecorder(userMedia, { mimeType: mimeType });

      userMicrophone.onstart = () => {
      };
      
      userMicrophone.onstop = () => {
      };

      setMicrophone(userMicrophone);
    }

    function getSocket() {
        try {
          setGettingSocket(true);
          const _deepgram = createClient(apiKey);
          const options = { model: "nova-2", smart_format: true, 
                            language: 'en-AU', interim_results: true,
                            endpointing: 50 }
          const _socket = _deepgram.listen.live(options);

          _socket.on(LiveTranscriptionEvents.Open, () => {
              setSocketOpen(true);
          })

          _socket.on(LiveTranscriptionEvents.Close, () => {
              setSocketOpen(false);
          })

          setSocket(_socket);
        }
        catch {
            props.setAlert('Error creating connection to Deepgram. Check your internet connection or try again later.');
        }
    }
    
    async function setupLink()
    {
      setGettingSocket(false);
      const timeout = setTimeout(() => {
        closeSocket();
        props.setAlert('Recording cancelled due to timeout');
      }, 60000)

      microphone.ondataavailable = (e) => {
        if (e.data.size > 0)
        {
          socket.send(e.data);
          console.log(`data sent with size ${e.data.size}`);
        }
        
      }

      socket.on("Results", async (data) => {
          const _transcript = data.channel.alternatives[0].transcript;

          if (_transcript) {
              setTranscript(_transcript);
          }

          if (_transcript && data.speech_final)
          {
              timeout && clearTimeout(timeout);
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
      try {
        microphone.stop();
        socket.finish();
        const audioURL = process.env.PUBLIC_URL + '/sounds/mic_close.mp3';
        const micStopAudio = new Audio(audioURL);
        micStopAudio.play(); 
        setRecording(false);
      } 
      catch {
        console.log('stopping socket failed')
        props.setAlert('Error closing connection to Deepgram.');
      }
    }

    // update conversation with new statement
  async function updateConversation(speaker,statement) {
    try {
    const url = `${process.env.REACT_APP_SERVER_URL}/update-conversation/`;
    const method = 'post';
    const headers = {'Content-Type': 'application/json'};
    const body = JSON.stringify({'convoID':props.convoID, speaker:speaker, 'statement':statement, 'messageId': statement.id})
    const options = {method:method,headers:headers,body:body};
    await fetch(url,options);
    setInput(statement);
    }
    catch {
      props.setAlert('Error updating conversation. Check your internet connection and try again.');
  
    }
  }
  
  // gets response from chatgpt
  async function getResponse(statement) {
    let _audioElement;
    let res_json;

    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/post-query/`;
      const headers = {'Content-Type': 'application/json'};
      const body = JSON.stringify({'query':statement,'parentMessageId':messageId})
      const options = {method:'post',headers:headers,body:body};
      const res = await fetch(url,options);
      res_json = await res.json();
      setMessageId(res_json.id);
      const audio = res_json.audio;
      const audioArray = Object.values(audio);
      const uint8Array = new Uint8Array(audioArray);
      const blob = new Blob([uint8Array], { type: 'audio/mpeg' });
      const blobUrl = URL.createObjectURL(blob);
      _audioElement = new Audio(blobUrl);
    } catch {
      props.setAlert('Error getting response. Check your internet connection and try again.');
    }

    _audioElement.onplay = () => {
      setPlaying(true);
      setSpeaker('Bonsoir');
    }

    _audioElement.onpause = () => {
      setPlaying(false);
      setSpeaker(user.name);
      setTranscript('');
    }

    setAudioElement(_audioElement);

    _audioElement.play().then(() => {
    }).catch(error => {
      setPending(true);
    })

    setThinking(false);
    const reply = {'text':res_json.text, 'id': res_json.id};
    return reply;
  }

  function playMissed()
  {
    setPlaying(true);
    audioElement.play();
    setPending(false);
  }

    return (
        <div className='transcriber-wrapper'>
        <p className='transcript desktop'>{transcript ? transcript : props.disabled ? 'Create a new conversation or load an existing conversation using the bar on the left.': 'Transcribed speech will appear here.'}</p>
        <p className='transcript mobile'>{transcript ? transcript : props.disabled ? 'Create a new conversation or load an existing conversation using the icon in the top left.': 'Transcribed speech will appear here.'}</p>
        <div className='transcriber-buttons'>
            {micAccess && !pending && !recording && !thinking && <button className='btn' onClick={() => getSocket()} disabled={props.disabled || playing || speaker === 'Bonsoir' || gettingSocket}>Start recording</button>}
            {micAccess && recording && <button className='btn recording' onClick={() => closeSocket()} disabled={gettingSocket}>Recording, Click to Cancel</button>}
            {micAccess && thinking && <button className='btn' disabled><div className='loader'></div></button>}
            {micAccess && pending && <button className='btn' onClick={playMissed}>Play response</button>}
            {!micAccess && <button className='btn' disabled>Microphone access required</button>}
        </div>
        </div>
    )
}

export default Transcriber;