import { useState, createContext } from 'react';
import Call from './Call';
import Chatlog from './Chatlog';
import Transcriber from './Transcriber';
import './styles/Conversation.css';

export const inputCtx = createContext();

function Conversation(props)
{
    const [input, setInput] = useState('First input');
    const [speaker, setSpeaker] = useState('human');
    const [messageId, setMessageId] = useState('');
    const [playing, setPlaying] = useState(false);
    const [recording, setRecording] = useState(false);
    return (
        <inputCtx.Provider value={{ speaker, setSpeaker, 
                                    input, setInput, 
                                    messageId, setMessageId,
                                    playing, setPlaying,
                                    recording, setRecording }}>
        <div className='conversation-wrapper'>
            <Call/>
            <div className='chat-wrapper'>
                    <Chatlog convoID={props.convoID}/>
                    <Transcriber convoID={props.convoID}/>
            </div>
        </div>
        </inputCtx.Provider>
    )
}

export default Conversation;