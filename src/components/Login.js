export default function Login()
{
    function handleSubmit(e)
    {
        const username = e.target.username.value;
        const password = e.target.password.value;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type='text'name='username'></input>
                <label>Password</label>
                <input type='text' name='password'></input>
                <input type='submit'></input>
            </form>
        </div>
    )
}