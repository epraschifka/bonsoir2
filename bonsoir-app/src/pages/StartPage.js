import TopNav from '../components/navigation/TopNav';
import LeftNav from "../components/navigation/LeftNav";
import Call from '../components/conversation/Call';
import Chatlog from '../components/conversation/Chatlog';
import Transcriber from '../components/conversation/Transcriber';
import './styles/ConversationPage.css';

function StartPage(props)
{
    return (
        <>
            <TopNav/>
            <div className='conversation-page-wrapper'>
                    <LeftNav/>
                    <Call/>
                    <div className='chatlog-transcriber-wrapper'>
                        <p className='terminal-title'>Terminal</p>
                        <Chatlog/>
                        <Transcriber/>
                    </div>
            </div>
        </>
    )
}

export default StartPage;