import LeftNav from "../components/navigation/LeftNav";
import './styles/StartPage.css';
import TopNav from '../components/navigation/TopNav';

function StartPage()
{
    return (
        <>
            <TopNav/>
            <div className='home-wrapper'>
                {/*<LeftNav/>
                <div className='startpage-text'>
                    Create a new conversation or select an existing
                    conversation to get started.
                </div>*/}
            </div>
        </>
    )
}

export default StartPage;