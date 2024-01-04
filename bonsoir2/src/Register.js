import "./css/Register.css";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function Register()
{
    const [formData, setFormData] = useState({})
    const navigate = useNavigate();

    async function handleSubmit(e)
    {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        // check that the two passwords match
        if (password !== confirmPassword)
        {
            console.log("Passwords don't match!")
            return;
        }

        // client-side validation passed, send to server
        const headers = {'Content-Type': 'application/json'}
        const body = {'username':username,'password':password};
        const response = await fetch('http://localhost:3001/register',
                                {headers:headers, 
                                 body: JSON.stringify(body), 
                                 method: 'POST'});

        const response_json = await response.json();
        
        if (response_json.success === true)
        {
            console.log("true!");
            navigate('/dashboard');
        }
        else
        {
            navigate('/register');
        }

    }

    return (
        <div className='login-wrapper-outer'>
            <div className='login-wrapper-inner'>
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <label htmlFor='username'>Username</label>
                    <input type='text' id='username' name='username'></input>
                    <label htmlFor='password'>Password</label>
                    <input type='text' id='password' name='password'></input>
                    <label htmlFor='confirm-password'>Confirm password</label>
                    <input type='text' id='confirm-password' name='confirmPassword'></input>
                    <input type='submit'></input>
                </form>
                <a href='http://localhost:3000/login'>Already a user? Log in</a>
            </div>
        </div>
    )
}

export default Register;