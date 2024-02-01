import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';

function LoginButton()
{
    const { loginWithRedirect } = useAuth0();

    async function handleLogin() {
        await loginWithRedirect({
            appState: {
                returnTo: '/home'
            }
        })
    }

    return (
        <button onClick={handleLogin}>Login</button>
    )
    
}

export default LoginButton;