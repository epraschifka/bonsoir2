import { useAuth0 } from '@auth0/auth0-react';
import { inputCtx } from '../../pages/ConversationPage.js';
import { useContext } from 'react';
import './styles/Call.css';

function Call()
{
    const { speaker, playing, recording, thinking } = useContext(inputCtx);
    const { user } = useAuth0();
    let recordingState = recording ? 'recording' : '';
    let playingState = playing ? 'playing' : '';
    return (
        <div className={`call-wrapper`}>
            <p className='call-title'>Call with Bonsoir</p>
            <div className={`call-window ${recordingState} ${playingState}`}>
                {speaker != 'Bonsoir' && !thinking && <img src={user.picture} className='user-pic' alt='user'/>}
                {speaker == 'Bonsoir' && <img src='https://www.svgrepo.com/show/62629/robot.svg' className='bonsoir-pic' alt='bonsoir'/>}
                {thinking && <div className='thinking'>Bonsoir is thinking...</div>}
            </div>
        </div>
    )
}

export default Call;