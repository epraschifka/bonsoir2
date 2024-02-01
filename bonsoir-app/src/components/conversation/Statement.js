import './styles/Statement.css';
function Statement(props)
{
    return (
        <div className={`statement-wrapper ${props.speaker}`}>
            <p className='statement-text'>{props.text}</p>
        </div>
    )
}

export default Statement;