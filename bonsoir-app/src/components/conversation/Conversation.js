import Transcriber from './Transcriber';
import './styles/Conversation.css';

function Conversation()
{
    return (
        <div className='conversation-wrapper'>
            <div className='call-wrapper'>
                <div className='call-window'></div>
                <div className='call-participants'></div>
            </div>
            <div className='transcript-wrapper'>
                <div className='transcript-logs'></div>
                <Transcriber/>
            </div>
        </div>
    )
}

export default Conversation;