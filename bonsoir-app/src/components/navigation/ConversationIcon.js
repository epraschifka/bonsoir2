import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const linkString = '/conversation/' + props.id;

    return (
        <NavLink to={linkString} className='leftnav child'>{props.title}</NavLink>
    )
}

export default ConversationIcon;