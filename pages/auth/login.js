import React, { useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Link from 'next/link';
import { simulateLogin } from '../../utilities';
const API_URL = "http://localhost:8000/test_laravel/api/";
export default function Login() {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let login_token = null;
    const handleSubmit = async (e) => {
        // e.preventDefault();
        // const headers = { "Content-Type": `multipart/form-data` };
        // let data = new FormData();
        // data.append('username', username);
        // data.append('password', password);
        // let result = await axios({
        //     method: 'post',
        //     url: 'login-verify',
        //     baseURL: API_URL,
        //     data: data,
        //     headers: headers,
        // });
        // let response = result.data;
        // if (response['success']) {
        //     console.log("Login Successful");
        //     login_token = response['token'];
        // } else {
        //     console.log("Failed to Login");
        // }

        // simulate login
        simulateLogin(username, password)
    }
    return (
        <>
            <Head>
                <title>EPT | Login</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container my-5">
                <div className="row justify-content-md-center">
                    <form onSubmit={(e) => handleSubmit(e)} action="" method="post" className="col-sm-5 border border-primary p-5">
                        <div className="form-group mb-3">
                            <label className='form-label' htmlFor="username">Username</label>
                            <input onInput={(e) => setUsername(e.target.value)} type="text" id="username" value={username} className="form-control" placeholder='username' />
                        </div>
                        <div className="form-group">
                            <label className='form-label' htmlFor="password">Password</label>
                            <input onInput={(e) => setPassword(e.target.value)} type="password" id="password" value={password} className="form-control" placeholder='***************' />
                        </div>
                        <input type="submit" value="Login" className="btn btn-primary w-100 mt-3" />
                        <div className='d-flex mt-3 flex-row justify-content-around align-items-center text-center'>
                            <Link href="/auth/signup">
                                <a>Signup</a>
                            </Link>
                            <Link href="/auth/forgot-password">
                                <a>Forgot Password</a>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}