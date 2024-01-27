import { inputCtx } from './Conversation.js';
import { useContext } from 'react';
import './styles/Call.css';

function Call()
{
    const { speaker } = useContext(inputCtx);
    return (
        <div className='call-wrapper'>
            <div className='call-window'>
                {speaker == 'human' && <img className='user-pic'/>}
                {speaker == 'bonsoir' && <img className='bonsoir-pic'/>}
            </div>
            <div className='call-participants'>
                <img className='user-pic'/>
                <img className='bonsoir-pic'/>
            </div>
        </div>
    )
}

export default Call;