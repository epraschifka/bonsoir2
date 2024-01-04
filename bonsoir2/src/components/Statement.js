import "../css/Statement.css";

function Statement(props)
{
    return (
        <div className='statement'>
            <p>{props.text}</p>
            <p className='speaker-date-info'>{props.speaker} {props.datetime}</p>
        </div>
    )
}

export default Statement;