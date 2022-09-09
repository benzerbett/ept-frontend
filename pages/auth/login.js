import React, { useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
const API_URL = "http://localhost:8000/test_laravel/api/";
export default function Login() {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let login_token = null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        const headers = {
            "Content-Type": `multipart/form-data`
        };
        let data = new FormData();
        data.append('username', username);
        data.append('password', password);
        let result = await axios({
            method: 'post',
            url: 'login-verify',
            baseURL: API_URL,
            data: data,
            headers: headers,
        });
        let response = result.data;
        if (response['success']) {
            console.log("Login Successful");
            login_token = response['token'];
        } else {
            console.log("Failed to Login");
        }
    }
    const get_user = async () => {
        if (login_token) {
            const headers = {
                "Authorization": `Bearer ${login_token}`
            };
            let result = await axios({
                method: 'get',
                url: 'auth-user',
                baseURL: API_URL,
                data: JSON.stringify({}),
                headers: headers,
            });
            let response = result.data;
            console.log("get_user", response);
        } else {
            console.log("Login Token is empty");
        }
    }
    return (
        <>
            <Head>
                <title>EPT | Login</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <form onSubmit={(e) => handleSubmit(e)} action="" method="post">
                    <div>
                        <label htmlFor="">Username</label><br />
                        <input onInput={(e) => setUsername(e.target.value)} type="text" id="username" value={username} />
                    </div>
                    <div>
                        <label htmlFor="">Password</label><br />
                        <input onInput={(e) => setPassword(e.target.value)} type="password" id="password" value={password} />
                    </div>
                    <div>
                        <input type="submit" value="Login" />
                        <button onClick={get_user} type="button" >Get User</button>
                    </div>
                </form>
            </div>
        </>
    )
}