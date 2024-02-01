import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const [className,setClassName] = useState('conversation-icon-wrapper')
    const linkString = '/conversation/' + props.id;
    
    function handleFocus()
    {
        console.log('focused!');
        setClassName('conversation-icon-wrapper focused');
    }
    
    function handleBlur()
    {
        console.log('unfocused :(');
        setClassName('conversation-icon-wrapper unfocused');
    }

    return (
        <NavLink to={linkString} className={className} onMouseEnter={handleFocus} onMouseLeave={handleBlur}>
            <p onFocus={() => {console.log('hey hey')}}>{props.title}</p>
        </NavLink>
    )
}

export default ConversationIcon;