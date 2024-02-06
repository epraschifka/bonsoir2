import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import ErrorPage from './ErrorPage';
import LeftNav from "../components/navigation/LeftNav";
import TopNav from '../components/navigation/TopNav';
import Call from '../components/conversation/Call';
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';

function LoadingPage(props)
{
    return (
        <>
            <TopNav/>
            <div className='home-wrapper'>
                <LeftNav/>
                <Call/>
                <Chatlog/>
                <Transcriber/>                                
            </div>
        </>
    )
}

export default LoadingPage;