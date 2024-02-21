import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from "react";
import ConversationIcon from "./ConversationIcon";
import './styles/LeftNav.css';

function LeftNav(props)
{
    const { user } = useAuth0();
    const [convos, setConvos] = useState([]);
    const printedConvos = convos.map(convo => {
        return (<ConversationIcon id={convo._id}
                              email={convo.email}
                              title={convo.title}
                              key={convo._id}
                              CurrentID = {props.convoID}/>);
    });

    // get convos on initial page load
    useEffect(() => {
        retrieveConvos();
    },[])

    // function to retrieve conversations started by this user
    async function retrieveConvos()
    {
        const url = `${process.env.REACT_APP_SERVER_URL}/retrieve-conversations-email/${user.email}`;
        const method = 'get';
        const headers = {'Content-Type': 'application/json'};
        const options = {method:method,headers:headers};
        const res = await fetch(url,options);
        const res_json = await res.json();
        setConvos(res_json);
    }

    // add new conversation to navbar, and retrieve convos again
    // to update navbar.
    async function createNewConvo(string)
    {
        const url = `${process.env.REACT_APP_SERVER_URL}/create-conversation`;
        const method = 'post';
        const headers = {'Content-Type': 'application/json'};
        const email = user.email;
        const title = string;
        const body = JSON.stringify({email: email, title: title});
        const options = {method:method,headers:headers,body:body};
        const res = await fetch(url,options);
        const res_json = await res.json();
        const convoID = res_json.info;
        await retrieveConvos();
    }

    return (
        <div className='leftnav-wrapper'>
            <nav className='leftnav'>
                    <div className='new-conversation-wrapper' onClick={() => createNewConvo('New Conversation')}>
                        <p className='new-conversation-text'>New</p>
                        <button className='new-conversation-button'>+</button>
                    </div>
                    {printedConvos}
            </nav>
        </div>
    )
}

export default LeftNav;