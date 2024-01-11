export default function Login()
{
    async function handleSubmit(e)
    {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const url = 'http://localhost:3001/login';
        const headers = {"Content-Type" : "application/json"};
        const body = JSON.stringify({username: username, password: password});
        const options = {method:'post',headers:headers,body:body};
        const result = await fetch(url, options);

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