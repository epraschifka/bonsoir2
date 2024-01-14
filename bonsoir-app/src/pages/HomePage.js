import { useAuth0 } from '@auth0/auth0-react';
import NavBar from "../components/navigation/NavBar";
function HomePage()
{
    const { user } = useAuth0();
    return (
        <>
            <NavBar/>
        </>
    )
}

export default HomePage;