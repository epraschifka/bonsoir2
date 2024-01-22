import { useState, createContext } from 'react';
import Chatlog from './Chatlog';
import Transcriber from './Transcriber';
import './styles/Conversation.css';

export const inputCtx = createContext();

function Conversation(props)
{
    const [input, setInput] = useState('First input');
    return (
        <div className='conversation-wrapper'>
            <div className='call-wrapper'>
                <div className='call-window'></div>
                <div className='call-participants'></div>
            </div>
            <div className='chat-wrapper'>
                <inputCtx.Provider value={{ input,setInput }}>
                    <Chatlog convoID={props.convoID}/>
                    <Transcriber convoID={props.convoID}/>
                </inputCtx.Provider>
            </div>
        </div>
    )
}

export default Conversation;