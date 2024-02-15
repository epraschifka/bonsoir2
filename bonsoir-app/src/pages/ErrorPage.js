import TopNav from '../components/navigation/TopNav';
function ErrorPage()
{
    return (
        <div>
            <TopNav/>
            <section id='home'>
                <div className='intro-wrapper'>
                    <div className='intro-text'>
                        <h1>We couldn't find that page :(</h1>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ErrorPage;