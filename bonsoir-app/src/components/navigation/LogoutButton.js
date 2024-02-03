import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import './styles/Button.css'

function LogoutButton()
{
    const { logout } = useAuth0();

    async function handleLogin() {
        await logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    return (
        <button onClick={handleLogin}>Logout</button>
    )
    
}

export default LogoutButton;