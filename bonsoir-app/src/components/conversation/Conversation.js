import Chatlog from './Chatlog';
import Transcriber from './Transcriber';
import './styles/Conversation.css';

function Conversation(props)
{
    return (
        <div className='conversation-wrapper'>
            <div className='call-wrapper'>
                <div className='call-window'></div>
                <div className='call-participants'></div>
            </div>
            <div className='chat-wrapper'>
                <Chatlog/>
                <Transcriber/>
            </div>
        </div>
    )
}

export default Conversation;