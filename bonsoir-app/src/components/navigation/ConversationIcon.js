import { NavLink } from "react-router-dom";
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const linkString = '/conversation/' + props.id;
    const className = 'conversation-icon-wrapper' + 
                        (props.selected ? ' selected' : '')

    return (
        <NavLink to={linkString} className={className}>
            <p>{props.title}</p>
        </NavLink>
    )
}

export default ConversationIcon;