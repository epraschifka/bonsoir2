import { NavLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from "react";
import ConversationIcon from "./ConversationIcon";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import './styles/NavBar.css';

function NavBar()
{
    const { user } = useAuth0();
    const [convos, setConvos] = useState([]);
    const printedConvos = convos.map(convo => {
        return (<ConversationIcon id={convo._id}
                              email={convo.email}
                              title={convo.title}
                              key={convo._id}/>);
    });

    // get convos on initial page load
    useEffect(() => {
        retrieveConvos();
    },[])

    // function to retrieve conversations started by this user
    async function retrieveConvos()
    {
        const url = 'http://localhost:3001/retrieve-conversations-email/'
                        + user.email;
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
        const url = 'http://localhost:3001/create-conversation';
        const method = 'post';
        const headers = {'Content-Type': 'application/json'};
        const email = user.email;
        const title = string;
        const body = JSON.stringify({email: email, title: title});
        const options = {method:method,headers:headers,body:body};
        await fetch(url,options);
        await retrieveConvos();
    }

    return (
        <nav className='navbar'>
            <div className='navbar-top-wrapper'>
                <div onClick={() => createNewConvo('new conversation')} className='create-new-convo'>
                    <p>+</p>
                </div>
                {printedConvos}
            </div>
            <div className="navbar-bottom-wrapper">
                <NavLink to='/profile'>Profile</NavLink>
                <NavLink to='/vocabulary'>Vocabulary</NavLink>
                <LogoutButton/>
            </div>
        </nav>
    )
}

export default NavBar;