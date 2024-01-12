import { useState, useEffect } from "react";
export default function Home()
{
    const [username, setUsername] = useState('');

    useEffect(() => {
        async function getUsername()
        {
            const url = 'http://localhost:3001/username';
            const headers = {"Content-Type" : "application/json"};
            const options = {method:'get',headers:headers,credentials:'include'};
            const res = await fetch(url, options)
            const username = await res.json();
            setUsername(username.username);
        }
        getUsername();
    }, [])
    

    return (
        <div>
            <h1>Welcome {username}</h1>
        </div>
    )
}