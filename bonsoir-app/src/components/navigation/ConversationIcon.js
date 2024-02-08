import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const linkString = '/conversation/' + props.id;

    return (
        <div className='conversation-icon-wrapper'>
            <NavLink to={linkString}>{props.title}</NavLink>
            <div className="conversation-icon-buttons">
            <button><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></button>
            <button><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
            </div>
        </div>
    )
}

export default ConversationIcon;