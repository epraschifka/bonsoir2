import './styles/Statement.css';
function Statement(props)
{
    return (
        <div className='statement-wrapper'>
            <div className = 'statement-text'>
                <p className={`statement-content ${props.speaker}`}>{props.text}</p>
                <p className='statement-data'>{`${props.speaker} at ${props.time}`}</p>
            </div>
        </div>
    )
}

export default Statement;