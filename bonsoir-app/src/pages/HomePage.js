import { useAuth0 } from '@auth0/auth0-react';
import NavBar from "../components/navigation/NavBar";
import Call from '../components/Call';
import Transcript from '../components/Transcript';
import './styles/HomePage.css';
function HomePage()
{
    const { user } = useAuth0();
    return (
        <div className='home-wrapper'>
            <NavBar/>
            <Call/>
            <Transcript/>
        </div>
    )
}

export default HomePage;