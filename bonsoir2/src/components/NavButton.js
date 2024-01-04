import '../css/NavButton.css';

function NavButton(props)
{
    const classes = 'NavButton-wrapper' + ' ' + props.extra;
    return (
        <div className={classes}>
            <div className='NavButton'>{props.text}</div>
        </div>
    )
}

export default NavButton;