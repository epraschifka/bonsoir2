import { NavLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import ConversationIcon from "./ConversationIcon";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import './styles/NavBar.css';
import "./styles/ConversationIcon.css";

function NavBar()
{
    return (
        <nav className='navbar'>
            <div className='navbar-top-wrapper'>
                <ConversationIcon/>
            </div>
            <div className="navbar-bottom-wrapper">
                <NavLink to='/'>Home</NavLink>
                <NavLink to='/profile'>Profile</NavLink>
                <LogoutButton/>
            </div>
        </nav>
    )
}

export default NavBar;