import { useRouteError } from "react-router-dom";
import '../css/ErrorPage.css'

function ErrorPage()
{
    const error = useRouteError();
    console.log(error);

    return (
        <div>
            <h1>Oops! We couldn't find that page.</h1>
            <p className='underError'>Maybe you entered the URL incorrectly?</p>
        </div>
    )

}

export default ErrorPage;