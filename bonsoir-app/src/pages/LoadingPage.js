import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import LeftNav from "../components/navigation/LeftNav";
import Conversation from '../components/conversation/Conversation';
import './styles/HomePage.css';
import TopNav from '../components/navigation/TopNav';

function ConversationPage(props)
{
    return (
        <>
            <TopNav/>
            <div className='home-wrapper'>
                <LeftNav/>
                <Conversation convoID={props.convoID}/>
            </div>
        </>
    )
}

export default ConversationPage;