import { withAuthenticationRequired } from '@auth0/auth0-react';
import Logout from './Logout';
import Profile from './Profile';

const Home = () => {
    return (
    <div>
        <Profile/>
        <Logout/>
    </div>
    )
}

export default withAuthenticationRequired(Home, {
    // onRedirecting: () => <Loading />,
  });
