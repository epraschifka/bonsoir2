import "../css/Participant.css";
function Participant(props)
{
    return (
        <div className='participant-wrapper'>
            <img className='participant-pic'></img>
            <p className='participant-name'>{props.name}</p>
        </div>
    )
}

export default Participant;