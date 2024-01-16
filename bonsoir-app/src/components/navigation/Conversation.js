import { NavLink } from "react-router-dom";
function Conversation(props)
{
    const linkString = '/conversation/' + props.id;

    return (
        <NavLink to={linkString} className='conversation-wrapper'>
            <p>{props.title}</p>
        </NavLink>
    )
}

export default Conversation;