import { useState, useEffect, useContext } from 'react';
import { inputCtx } from '../../pages/ConversationPage.js';
import Statement from './Statement.js';

import './styles/Chatlog.css';

function Chatlog(props)
{
    const [chatlog,setChatlog] = useState([]);
    const { input, setInput, messageId, setMessageId } = useContext(inputCtx);
    let chatlog_mapped = chatlog.map(statement => {
        return (<Statement text={statement.text} 
                           speaker={statement.speaker} 
                           time={statement.time}
                           key={statement.time}/>)
    })

    useEffect(() => {
        async function retrieveConversation() {
            if (props.convoID)
            {
                const url = `${process.env.REACT_APP_SERVER_URL}/retrieve-conversations-id/${props.convoID}`;
                const res = await fetch(url);
                const res_json = await res.json();
                const statements = res_json.convo.statements;
                const lastStatement = statements[statements.length-1];
                if (statements.length > 0)
                {
                    setMessageId(lastStatement.messageId);
                }
                setChatlog(statements);
            }
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