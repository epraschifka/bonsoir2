import { NavLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { useState, useEffect } from "react";
import Conversation from "./Conversation";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import './styles/NavBar.css';
import "./styles/Conversation.css";

function NavBar()
{
    const { user } = useAuth0();
    const [convos, setConvos] = useState([]);
    const printedConvos = convos.map(convo => {
        return (<Conversation id={convo._id} 
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
        console.log("Retrieving conversations...")
        const url = 'http://localhost:3001/retrieve-conversations/'
                        + user.email;
        const method = 'get';
        const headers = {'Content-Type': 'application/json'};
        const options = {method:method,headers:headers};
        console.log(`Making fetch request to ${url} with options=${JSON.stringify(options)}`)
        const res = await fetch(url,options);
        const res_json = await res.json();
        console.log(res_json);
        setConvos(res_json);
    }

    // add new conversation to navbar, and retrieve convos again
    // to update navbar.
    async function createNewConvo(string)
    {
        console.log("Creating new conversation...")
        const url = 'http://localhost:3001/create-conversation';
        const method = 'post';
        const headers = {'Content-Type': 'application/json'};
        const email = user.email;
        const title = string;
        const body = JSON.stringify({email: email, title: title});
        const options = {method:method,headers:headers,body:body};
        console.log(`Making fetch request to ${url} with options=${JSON.stringify(options)}`)
        const res = await fetch(url,options);
        console.log("Fetch request complete.")
        console.log("Retrieving convos...")
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
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/profile'>Profile</NavLink>
                <LogoutButton/>
            </div>
        </nav>
    )
}

export default NavBar;