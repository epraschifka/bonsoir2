import './styles/Statement.css';
function Statement(props)
{
    return (
        <p className={`statement-text ${props.speaker}`}>{props.text}</p>
    )
}

export default Statement;