import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Link from 'next/link';
import { simulateGetSession, simulateLogin } from '../../utilities';
import { useRouter } from 'next/router';
const API_URL = "http://localhost:8000/test_laravel/api/";
export default function Login() {
    const router = useRouter()
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(true);
    let login_token = null;
    const handleSubmit = async (e) => {
        // simulate login
        simulateLogin(username, password, router)
    }

    useEffect(() => {
        let mtd = true
        if (mtd) {
            const session = simulateGetSession()
            if (session) {
                if(session.user.type === 'admin'){
                    router.push('/admin/', undefined, { unstable_skipClientCache: true })
                }else if(session.user.type === 'user'){
                    router.push('/user/', undefined, { unstable_skipClientCache: true })
                }
            }
            setLoading(false)
        }
        return () => {
            mtd = false
        }
    }, [])

    if(loading) return <div style={{width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <h5 className='mb-0'>Loading...</h5>
    </div>
    
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