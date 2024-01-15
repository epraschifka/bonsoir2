import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom'
import LoadingPage from "./LoadingPage";
import NavBar from "../components/navigation/NavBar";
import Call from '../components/Call';
import Transcript from '../components/Transcript';
import './styles/HomePage.css';
function HomePage()
{
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <LoadingPage/>
        )
    }

    return (
        <div className='home-wrapper'>
            <NavBar/>
            <Call/>
            <Transcript/>
        </div>
    )
}

export default HomePage;