import { useState, useEffect, useContext } from 'react';
import { inputCtx } from './Conversation.js';

import './styles/Chatlog.css';

function Chatlog(props)
{
    const [chatlog,setChatlog] = useState([1,2]);
    const { input, setInput } = useContext(inputCtx);
    let chatlog_mapped;
    try {
         chatlog_mapped = chatlog.map(statement => {
            return (<p>{statement.text}</p>)
        })
    } catch (error)
    {
        console.log(`chatlog = ${JSON.stringify(chatlog)}`);
    }

    useEffect(() => {
        async function retrieveConversation() {
            console.log("retrieving conversation...");
            const url = `http://localhost:3001/retrieve-conversations-id/${props.convoID}`;
            const res = await fetch(url);
            const res_json = await res.json();
            setChatlog(res_json.convo.statements);
        }

        retrieveConversation();
    },[input])

    return(
        <div className='chatlog-wrapper'>
            {chatlog_mapped}
        </div>
    )
}

export default Chatlog;