import './Feature.css';
function Feature(props)
{
    return (
        <div className='feature-wrapper'>
            <img className={`feature-image ${props.disabled}`} src={props.img}></img>
            <div className='feature-text'>
                <h2 className='feature-header'>{props.header}</h2>
                <div className='feature-description'>
                    <p>{props.text}</p>
                    <p class='emphasis'>{props.extra}</p>
                </div>
            </div>
        </div>
    )
}

export default Feature;