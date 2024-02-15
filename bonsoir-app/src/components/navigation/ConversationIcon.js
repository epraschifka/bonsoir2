import { useEffect, useState, useRef } from "react"; // Add useRef import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'
import "./styles/ConversationIcon.css";

function ConversationIcon(props)
{
    const [editing, setEditing] = useState(false);
    const [title,setTitle] = useState(props.title);
    const linkString = '/conversation/' + props.id;
    const linkRef = useRef(null); // Create a ref for the link element
    const activeClass = props.id === props.CurrentID ? 'active-conversation' : '';

    useEffect(() => {
        console.log(editing); 
        if (editing) {
            linkRef.current.focus();
        }
    },[editing])

    async function updateConvo()
    {
        setTitle(linkRef.current.innerText);
        setEditing(false);
        const url = `${process.env.REACT_APP_SERVER_URL}/rename-conversation`;
        const method = 'put';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify({id: props.id, title: linkRef.current.innerText});
        const options = {method:method, headers:headers, body:body};
        await fetch(url,options);
    }

    async function deleteConvo()
    {
        console.log('deleteConvo triggered')
        const url = `${process.env.REACT_APP_SERVER_URL}/delete-conversation`;
        const method = 'delete';
        const headers = {'Content-Type': 'application/json'};
        const body = JSON.stringify({id: props.id});
        const options = {method:method,headers:headers,body:body};
        console.log('sending fetch...')
        await fetch(url,options);
        console.log('received response')
        if (props.id === props.CurrentID)
        {
            window.location.href = '/home';
        }
        else
        {
            window.location.reload();
        }

    }

    return (
        <div className={`conversation-icon-wrapper ${activeClass}`}>
            {editing && <p contentEditable={editing} ref={linkRef}>{title}</p>}
            {!editing && <a href={linkString} contentEditable={editing}>{title}</a>}
            <div className="conversation-icon-buttons">
                {editing && <button onClick={updateConvo}><FontAwesomeIcon icon={faCheck}></FontAwesomeIcon></button>}
                {!editing && <button onClick={() => setEditing(true)}><FontAwesomeIcon icon={faEdit}></FontAwesomeIcon></button>}
                <button onClick={deleteConvo}><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
            </div>
        </div>
    )
}

export default ConversationIcon;