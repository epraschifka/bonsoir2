import TopNav from '../components/navigation/TopNav';
import Feature from '../components/welcome/Feature';
import './styles/WelcomePage.css';

function WelcomePage()
{
    return (
        <div>
            <TopNav/>
            <div className='video'></div>
            <div className='features'>
                <Feature img='https://i.insider.com/64c94ded048ff200190f369f?width=700' header='Intelligent conversations' text="Simulate intelligent, real-time conversations with OpenAI's ChatGPT."/>
                <Feature img='https://summalinguae.com/wp-content/uploads/2017/04/How-Does-Speech-Recognition-Technology-WorkV02.jpg' header='Speech-to-text' text="State of the art speech detection technology by Deepgram."/>
                <Feature img='https://www.smartdatacollective.com/wp-content/uploads/2023/08/ai-text-to-voice-tools-860x588.jpg.webp' header='Text-to-speech' text="Lifelike speech synthesis from Eleven Labs."/>
            </div>
            <div className='upcoming-features'>
                <Feature img='https://www.scribbledata.io/wp-content/uploads/2023/05/Fine-tuning-Large-Language-Models-02-1-scaled.jpg' header='Custom settings' text="Fine-tune your AI's parameters to change its conversational style."/>
                <Feature img='https://dq3ztx9qtqqpv.cloudfront.net/wp-content/uploads/2020/01/languages.png' header='Wide language support' text="Supports English, French, German, Russian, Chinese."/>
            </div>
            <div className='about-me'></div>
            <div className='footer'></div>
        </div>
    )
}

export default WelcomePage;