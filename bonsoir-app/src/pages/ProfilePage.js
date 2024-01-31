import { useAuth0 } from '@auth0/auth0-react';
import LeftNav from "../components/navigation/LeftNav";
import "./styles/ProfilePage.css"

function ProfilePage()
{
    const { user } = useAuth0();
    return (
        <div className='profile-wrapper'>
            <LeftNav/>
            <div>
                <h1>Profile</h1>
                <img src={user.picture}/>
                <h1>Welcome, {user.name}</h1>
                <h2>{user.email}</h2>
            </div>
        </div>
    )
}

export default ProfilePage;