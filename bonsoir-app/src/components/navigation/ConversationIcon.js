import { NavLink } from "react-router-dom";
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const linkString = '/conversation/' + props.id;

    return (
        <NavLink to={linkString} className='conversation-icon-wrapper'>
            <p>{props.title}</p>
        </NavLink>
    )
}

export default ConversationIcon;