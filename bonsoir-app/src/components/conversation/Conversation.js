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
            <Transcriber convoID={props.convoID}/>
        </div>
    )
}

export default Conversation;