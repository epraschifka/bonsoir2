import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom'
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import NavBar from "../components/navigation/NavBar";
import Call from '../components/Call';
import Transcript from '../components/Transcript';
import './styles/HomePage.css';
function HomePage(props)
{
    const { user, isAuthenticated, isLoading } = useAuth0();
    const convoID = props.convoID;

    const [success, setSuccess] = useState();
    const [pageLoading,setPageLoading] = useState(true);

    // get the conversation corresponding to the convoID
    useEffect(() => {
        retrieveConvo();
    },[]);

    async function retrieveConvo()
    {
        console.log("Retrieving conversation...")
        const url = 'http://localhost:3001/retrieve-conversations-id/'
                        + convoID;
        const method = 'get';
        const headers = {'Content-Type': 'application/json'};
        const options = {method:method,headers:headers};
        console.log(`Making fetch request to ${url} with options=${JSON.stringify(options)}`)
        const res = await fetch(url,options);
        const res_json = await res.json();
        console.log(res_json);
        setSuccess(res_json.success);
        setPageLoading(false);
    }

    if (isLoading || pageLoading) {
        return (
            <LoadingPage/>
        )
    }
    
    if (!isLoading && !success)
    {
        return (
            <ErrorPage/>
        )
    }

    return (
        <div className='home-wrapper'>
            <NavBar/>
            <Call/>
            <Transcript/>
        </div>
    )
}

export default HomePage;