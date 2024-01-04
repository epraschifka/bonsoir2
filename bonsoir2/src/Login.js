import "./css/Login.css"
function Login()
{
    return (
        <div className='login-wrapper-outer'>
            <div className='login-wrapper-inner'>
                <form>
                    <h1>Login</h1>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username'></input>
                    <label htmlFor='password'>Password</label>
                    <input type='text' id='password'></input>
                    <input type='submit'></input>
                </form>
                <a href='http://localhost:3000/register'>New user? Register</a>
            </div>
        </div>
    )
}

export default Login;