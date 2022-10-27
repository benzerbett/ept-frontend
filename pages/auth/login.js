import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Link from 'next/link';
import { doGetSession, doLogin } from '../../utilities';
import { useRouter } from 'next/router';

export default function Login() {
    const router = useRouter()
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [loading, setLoading] = useState(true);
    let [status, setStatus] = useState({
        type: 'info',
        message: 'Loading...'
    });
    let login_token = null;
    const handleSubmit = async (e) => {
        // do login
        doLogin(email, password, router).then((data) => {
            if (data.status === true) {
                setStatus({
                    type: 'success',
                    message: "Login successful"
                })
            } else {
                setStatus({
                    ...data,
                    type: 'danger',
                })
            }
        }).catch((error) => {
            console.log('doLogin error::', error)
        })
    }

    useEffect(() => {
        let mtd = true
        if (mtd) {
            doGetSession().then((session) => {
                if (session) {
                    if (session.user.type === 'admin') {
                        router.push('/admin/', undefined, { unstable_skipClientCache: true })
                    } else if (session.user.type === 'user') {
                        router.push('/user/', undefined, { unstable_skipClientCache: true })
                    }
                }
            })
            setLoading(false)
        }
        return () => {
            mtd = false
        }
    }, [])

    if (loading) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    <div className="col-md-6 justify-content-md-center">
                        {status && status.message && ["warning","success","danger"].includes(status.type) && <div className={`alert py-2 mb-3 alert-${status.type} fade show`} role="alert" style={{ margin: '0px -15px' }}>
                            <p className='text-center mb-0' style={{ fontSize: '0.85em' }}>{status.message}</p>
                        </div>}
                    </div>
                </div>
                <div className="row justify-content-md-center">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSubmit(e)
                    }} action="" method="post" className="col-sm-5 border border-gray p-4 rounded">
                        <div className="row justify-content-md-center text-center">
                            <h3>
                                Log in
                            </h3>
                            <hr/>
                        </div>
                        <div className="form-group mb-4">
                            <label className='form-label' htmlFor="email">Email</label>
                            <input onInput={(e) => setEmail(e.target.value)} type="text" id="email" value={email} className="form-control" placeholder='email' />
                            {status && status.errors && status.errors.email && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.email.join('; ')}</small></div>}
                        </div>
                        <div className="form-group mb-4">
                            <label className='form-label' htmlFor="password">Password</label>
                            <input onInput={(e) => setPassword(e.target.value)} type="password" id="password" value={password} className="form-control" placeholder='***************' />
                            {status && status.errors && status.errors.password && <div className="text-danger"><small>{status.errors.password.join('; ')}</small></div>}
                        </div>
                        <div className="form-group mb-4">
                            <input type="submit" value="Login" className="btn btn-primary w-100 mt-3" />
                            <div className='d-flex mt-3 flex-row justify-content-around align-items-center text-center'>
                                <Link href="/auth/signup">
                                    <a>Signup</a>
                                </Link>
                                <Link href="/auth/forgot-password">
                                    <a>Forgot Password</a>
                                </Link>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}