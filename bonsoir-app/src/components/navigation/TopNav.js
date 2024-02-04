import { useAuth0 } from '@auth0/auth0-react';
import './styles/TopNav.css';
import LogoutButton from "./LogoutButton";
import LoginButton from './LoginButton';

function TopNav()
{
    const { isAuthenticated } = useAuth0();
    const button = isAuthenticated ? <LogoutButton/> : <LoginButton/>;
    return (
        <nav class='topnav wrapper'>
            <div class='topnav child'>
                <h1>Bonsoir</h1>
                <a href='#features'>Features</a>
            </div>
            <div class='topnav child'>
                {button}
            </div>
        </nav>
    )
}

export default TopNav;