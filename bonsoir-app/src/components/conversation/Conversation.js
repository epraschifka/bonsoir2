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
            <div className='transcript-wrapper'>
                <div className='transcript-logs'></div>
                <Transcriber id={props.id}/>
            </div>
        </div>
    )
}

export default Conversation;