import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const linkString = '/conversation/' + props.id;

    async function deleteConvo()
    {
        console.log('deleteConvo triggered')
        const url = 'http://localhost:3001/delete-conversation';
        const method = 'delete';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify({id: props.id});
        const options = {method:method,headers:headers,body:body};
        console.log('sending fetch...')
        await fetch(url,options);
        console.log('received response')
        window.location.reload();

    }

    return (
        <div className='conversation-icon-wrapper'>
            <NavLink to={linkString}>{props.title}</NavLink>
            <div className="conversation-icon-buttons">
            <button><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></button>
            <button onClick={deleteConvo}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
            </div>
        </div>
    )
}

export default ConversationIcon;