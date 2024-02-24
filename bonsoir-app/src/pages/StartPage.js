import { useState, createContext } from 'react';
import AlertBanner from '../components/alert/AlertBanner';
import TopNav from '../components/navigation/TopNav';
import LeftNav from "../components/navigation/LeftNav";
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';
import './styles/ConversationPage.css';

export const inputCtx = createContext({speaker:''});

function StartPage(props)
{
    const [alert, setAlert] = useState('');

    return (
        <div className='page-wrapper'>
            <TopNav convos={<LeftNav convoID={props.convoID}/>}/>
            {alert && <AlertBanner severity="error" text={alert}></AlertBanner>}
            <div className='leftnav-call-terminal-wrapper'>
                    <LeftNav convoID={props.convoID}/>
                        <div className='terminal-wrapper'>
                            <p className='terminal-title'>Terminal</p>
                            <div className='chatlog-transcriber-wrapper'>
                                <Chatlog convoID = {props.convoID} setAlert={setAlert}/>
                                <Transcriber convoID = {props.convoID} disabled = {true} setAlert={setAlert}/>
                            </div>
                        </div>
                </div>
        </div>
    )
}

export default StartPage;