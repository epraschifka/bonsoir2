import { useAuth0 } from '@auth0/auth0-react';
import './styles/TopNav.css';
import LogoutButton from "./LogoutButton";
import LoginButton from './LoginButton';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons'

function TopNav()
{
    const { isAuthenticated } = useAuth0();
    const [classes, setClasses] = useState('dropdown')
    const logButton = isAuthenticated ? <LogoutButton/> : <LoginButton/>;

    function toggleDrop() {
        if (classes === 'dropdown open')
        {
            setClasses('dropdown');
        }
        else
        {
            setClasses('dropdown open');
        }
    }

    return (
        <div className='topnav-wrapper'>
            <nav className='topnav'>
                <div className='topnav'>
                    <a href='http://localhost:3000/'>Bonsoir</a>
                    <a href='http://localhost:3000/#features'>Features</a>
                </div>
                <div>
                    <button className='reveal btn' onClick={toggleDrop}>
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    {logButton}
                </div>
            </nav>
            <div className={classes}>
                <a href='http://localhost:3000/#features' onClick={toggleDrop}>Features</a>
            </div>
        </div>
    )
}

export default TopNav;