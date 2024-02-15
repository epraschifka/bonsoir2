import { useState, useEffect, createContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import LoadingPage from "./LoadingPage";
import ErrorPage from './ErrorPage';
import TopNav from '../components/navigation/TopNav';
import LeftNav from "../components/navigation/LeftNav";
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';
import './styles/ConversationPage.css';

export const inputCtx = createContext({speaker:''});

function ConversationPage(props)
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

    // get the conversation corresponding to the convoID
    useEffect(() => {
        retrieveConvo();
    },[]);

    async function retrieveConvo()
    {
        const url = `${process.env.REACT_APP_SERVER_URL}/retrieve-conversations-id/${props.convoID}`;
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
        <div className='page-wrapper'>
            <TopNav convos={<LeftNav convoID={props.convoID}/>}/>
            <inputCtx.Provider value={{input,setInput,
                                        speaker,setSpeaker,
                                        messageId,setMessageId,
                                        playing,setPlaying,
                                        recording,setRecording,
                                        thinking, setThinking}}>
                <div className='leftnav-call-terminal-wrapper'>
                    <LeftNav convoID={props.convoID}/>
                        <div className='terminal-wrapper'>
                            <p className='terminal-title'>Terminal</p>
                            <div className='chatlog-transcriber-wrapper'>
                                <Chatlog convoID = {props.convoID}/>
                                <Transcriber convoID = {props.convoID}/>
                            </div>
                        </div>
                </div>
            </inputCtx.Provider>
        </div>
    )
}

export default ConversationPage;