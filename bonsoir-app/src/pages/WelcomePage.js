import { NavLink } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav';
import Feature from '../components/welcome/Feature';
import './styles/WelcomePage.css';

function WelcomePage()
{
    return (
        <>
            <TopNav/>
            <section id='home'>
                <div className='intro-wrapper'>
                    <div className='intro-text'>
                        <h1>An <span class='emphasis'>intelligent</span> virtual assistant with <span class='emphasis'>speech recognition</span> and <span class='emphasis'>synthesis</span></h1>
                        <NavLink to='http://localhost:3000/home'>
                            <button className='intro-button'>
                                Get started
                            </button>
                        </NavLink>
                    </div>
                    <video controls className='intro-video'>
                        <source src="https://samplelib.com/lib/preview/mp4/sample-30s.mp4" type="video/mp4" width='200px'/>
                    </video>
                </div>
            </section>

            <section id='features'>
                <h1 className='features-header'>Features</h1>
                <div className='features'></div>
                <div className='features-grid'>
                    <Feature img='https://i.insider.com/64c94ded048ff200190f369f?width=700' header='Intelligent conversations' text="Simulate intelligent, real-time conversations with OpenAI's ChatGPT."/>
                    <Feature img='https://summalinguae.com/wp-content/uploads/2017/04/How-Does-Speech-Recognition-Technology-WorkV02.jpg' header='Speech to text' text="State of the art speech recognition technology by Deepgram."/>
                    <Feature img='https://www.smartdatacollective.com/wp-content/uploads/2023/08/ai-text-to-voice-tools-860x588.jpg.webp' header='Text to speech' text="Lifelike speech synthesis from Eleven Labs."/>
                    <Feature img='https://www.scribbledata.io/wp-content/uploads/2023/05/Fine-tuning-Large-Language-Models-02-1-scaled.jpg' header='Custom settings' extra='Coming soon' text="Fine-tune your AI's parameters to change its conversational style." disabled='disabled'/>
                    <Feature img='https://dq3ztx9qtqqpv.cloudfront.net/wp-content/uploads/2020/01/languages.png' header='Wide language support' extra='Coming soon' text="Supports English, French, German, Russian, Chinese." disabled='disabled'/>
                </div>
            </section>
            <div className='footer'></div>
        </>
    )
}

export default WelcomePage;