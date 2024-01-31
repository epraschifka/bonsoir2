import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom'
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import LeftNav from "../components/navigation/LeftNav";
import Conversation from '../components/conversation/Conversation';
import './styles/HomePage.css';
import TopNav from '../components/navigation/TopNav';

function ConversationPage(props)
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
        const url = 'http://localhost:3001/retrieve-conversations-id/'
                        + convoID;
        const method = 'get';
        const headers = {'Content-Type': 'application/json'};
        const options = {method:method,headers:headers};
        const res = await fetch(url,options);
        const res_json = await res.json();
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
        <>
            <TopNav/>
            <div className='home-wrapper'>
                <LeftNav/>
                <Conversation convoID={convoID}/>
            </div>
        </>
    )
}

export default ConversationPage;