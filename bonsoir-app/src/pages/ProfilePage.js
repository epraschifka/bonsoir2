import { useAuth0 } from '@auth0/auth0-react';
import NavBar from "../components/navigation/NavBar";

function ProfilePage()
{
    const { user } = useAuth0();
    return (
        <>
            <NavBar/>
            <h1>Profile</h1>
            <img src={user.picture}/>
            <h1>Welcome, {user.name}</h1>
            <h2>{user.email}</h2>
        </>
    )
}

export default ProfilePage;