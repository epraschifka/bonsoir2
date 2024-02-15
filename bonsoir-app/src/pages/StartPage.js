import { useState, useEffect, createContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import TopNav from '../components/navigation/TopNav';
import LeftNav from "../components/navigation/LeftNav";
import Call from '../components/conversation/Call';
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';
import './styles/ConversationPage.css';

export const inputCtx = createContext({speaker:''});

function StartPage(props)
{
    return (
        <div className='page-wrapper'>
            <TopNav convos={<LeftNav convoID={props.convoID}/>}/>
            <div className='leftnav-call-terminal-wrapper'>
                    <LeftNav convoID={props.convoID}/>
                        <div className='terminal-wrapper'>
                            <p className='terminal-title'>Terminal</p>
                            <div className='chatlog-transcriber-wrapper'>
                                <Chatlog convoID = {props.convoID}/>
                                <Transcriber convoID = {props.convoID} disabled = {true}/>
                            </div>
                        </div>
                </div>
        </div>
    )
}

export default StartPage;