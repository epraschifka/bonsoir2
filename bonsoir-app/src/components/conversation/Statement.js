import { useAuth0 } from '@auth0/auth0-react';
import './styles/Statement.css';
function Statement(props)
{
    const { user } = useAuth0();
    return (
        <div className='statement-wrapper'>
            {props.speaker !== "Bonsoir" && <img src={user.picture}></img>}
            {props.speaker === "Bonsoir" && <img src='https://www.svgrepo.com/show/62629/robot.svg'></img>}
            <div className = 'statement-text'>
                <p className={`statement-content ${props.speaker}`}>{props.text}</p>
                <p className='statement-data'>{`${props.speaker} at ${props.time}`}</p>
            </div>
        </div>
    )
}

export default Statement;