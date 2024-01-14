import { NavLink } from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import './styles/NavBar.css';

function NavBar()
{
    const { isAuthenticated } = useAuth0();
    return (
        <nav className='navbar'>
            <NavLink to='/'>Home</NavLink>
            {isAuthenticated && (
                <>
                <NavLink to='/profile'>Profile</NavLink>
                <LogoutButton/>
                </>)}

            {!isAuthenticated && (
                <>
                <LoginButton/>
                </>)}
        </nav>
    )
}

export default NavBar;