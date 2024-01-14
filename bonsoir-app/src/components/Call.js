import CallWindow from "./CallWindow";
import Participants from "./Participants";
import './styles/Call.css';

function Call()
{
    return(
        <div className="call-wrapper">
            <CallWindow/>
            <Participants/>
        </div>
    )
}

export default Call;