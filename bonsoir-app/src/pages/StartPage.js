import { useState, useEffect, createContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import TopNav from '../components/navigation/TopNav';
import LeftNav from "../components/navigation/LeftNav";
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';
import './styles/ConversationPage.css';

function StartPage(props)
{
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [success, setSuccess] = useState();
    const [pageLoading,setPageLoading] = useState(true);
    
    const [input, setInput] = useState('First input');
    const [speaker, setSpeaker] = useState(user.name);
    const [messageId, setMessageId] = useState('');
    const [playing, setPlaying] = useState(false);
    const [recording, setRecording] = useState(false);
    const [thinking, setThinking] = useState(false);
    

    return (
        <div className='page-wrapper'>
            <TopNav convos={<LeftNav convoID={props.convoID}/>}/>
                <div className='leftnav-call-terminal-wrapper'>
                    <LeftNav convoID={props.convoID}/>
                    <div className='call-terminal-wrapper'>
                        <div className='terminal-wrapper'>
                            <p className='terminal-title'>Terminal</p>
                            <div className='chatlog-transcriber-wrapper'>
                                <Chatlog convoID = {props.convoID}/>
                                <Transcriber convoID = {props.convoID}/>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    )
}

export default StartPage;