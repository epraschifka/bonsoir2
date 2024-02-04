import './Feature.css';
function Feature(props)
{
    return (
        <div className='feature wrapper'>
            <img className='feature image' src={props.img}></img>
            <div className='feature text'>
                <strong className='feature header'>{props.header}</strong>
                <p className='feature description'>{props.text}</p>
            </div>
        </div>
    )
}

export default Feature;