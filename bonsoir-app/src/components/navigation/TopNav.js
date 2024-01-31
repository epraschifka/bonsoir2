import './styles/TopNav.css';
import LogoutButton from "./LogoutButton";
function TopNav()
{
    return (
        <nav class='topnav-wrapper'>
            <div class='topnav-left'>
                <h1>Bonsoir</h1>
                <p>About</p>
            </div>
            <div class='topnav-right'>
                <LogoutButton/>
            </div>
        </nav>
    )
}

export default TopNav;