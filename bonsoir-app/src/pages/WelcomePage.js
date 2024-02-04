import { NavLink } from 'react-router-dom';
import TopNav from '../components/navigation/TopNav';
import Feature from '../components/welcome/Feature';
import './styles/WelcomePage.css';

function WelcomePage()
{
    return (
        <div>
            <TopNav/>
            <section id='intro'>
            <div className='intro wrapper'>
                <div className='intro text'>
                    <h1>An <span class='emphasis'>intelligent</span> virtual assistant with <span class='emphasis'>speech recognition</span> and <span class='emphasis'>synthesis</span></h1>
                    <NavLink to='http://localhost:3000/home'>
                        <button className='intro button'>
                            Get started
                        </button>
                    </NavLink>
                </div>
                <video controls className='intro video' width='100%' height='500px'>
                    <source src="https://file-examples.com/storage/fec6b14e8365bdea89d5ee7/2017/04/file_example_MP4_480_1_5MG.mp4" type="video/mp4" width='200px'/>
                </video>
            </div>
            </section>

            <section id='features'>
                <h1 className='page header'>Features</h1>
                <div className='features grid'>
                    <Feature img='https://i.insider.com/64c94ded048ff200190f369f?width=700' header='Intelligent conversations' text="Simulate intelligent, real-time conversations with OpenAI's ChatGPT."/>
                    <Feature img='https://summalinguae.com/wp-content/uploads/2017/04/How-Does-Speech-Recognition-Technology-WorkV02.jpg' header='Speech-to-text' text="State of the art speech recognition technology by Deepgram."/>
                    <Feature img='https://www.smartdatacollective.com/wp-content/uploads/2023/08/ai-text-to-voice-tools-860x588.jpg.webp' header='Text-to-speech' text="Lifelike speech synthesis from Eleven Labs."/>
                    <Feature img='https://www.scribbledata.io/wp-content/uploads/2023/05/Fine-tuning-Large-Language-Models-02-1-scaled.jpg' header='Custom settings' text="Fine-tune your AI's parameters to change its conversational style."/>
                    <Feature img='https://dq3ztx9qtqqpv.cloudfront.net/wp-content/uploads/2020/01/languages.png' header='Wide language support' text="Supports English, French, German, Russian, Chinese."/>
                </div>
            </section>
            <div className='footer'></div>
        </div>
    )
}

export default WelcomePage;