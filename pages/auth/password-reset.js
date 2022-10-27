import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Link from 'next/link';
import { doGetSession, doPasswordReset } from '../../utilities';
import { useRouter } from 'next/router';

export default function PasswordReset() {
    const router = useRouter()
    let [email, setEmail] = useState('');
    let [token, setToken] = useState('');
    let [password, setPassword] = useState('');
    let [password_repeat, setPasswordRepeat] = useState('');
    let [loading, setLoading] = useState(true);
    let [status, setStatus] = useState({
        type: 'info',
        message: 'Loading...'
    });

    const handleSubmit = async (e) => {
        // check if passwords match
        if (password !== password_repeat) {
            setStatus({
                ...status,
                errors: {
                    ...status.errors,
                    password_repeat: ['Passwords do not match']
                }
            })
            return;
        }
        // do password reset
        doPasswordReset(email || router.query.email, password, password_repeat, token || router.query.token, router).then((data) => {
                    if (data.status === true) {
                        setStatus({
                            type: 'success',
                            message: data?.message || "Password reset successful. Proceed to log in."
                        })
                        setEmail('');
                        setPassword('');
                        setPasswordRepeat('');
                    } else {
                        setStatus({
                            ...data,
                            type: 'danger',
                        })
                    }
                }).catch((error) => {
                    console.log('doPasswordReset error::', error)
                })
        }

        useEffect(() => {
            let mounted = true;
            if (mounted) {
                setEmail(router.query.email);
                setToken(router.query.token);
                setLoading(false);
            }
            return () => mounted = false;
        }, [])

        if (loading) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h5 className='mb-0'>Loading...</h5>
        </div>

        // error if token is not set
        if (!router.query.token || !router.query.email) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className='alert alert-warning text-center'>
                <h5>Incomplete link</h5>
                <p className='mb-0'>Please check the link in your email. If the link is broken, please request for a new one.</p>
                <Link href='/auth/forgot-password'>
                    <a className='btn btn-primary mt-3'>Request new link</a>
                </Link>
            </div>
        </div>


        return (
            <>
                <Head>
                    <title>EPT | Reset Password</title>
                    <meta name="description" content="EPT" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className="container my-5">
                    <div className="row justify-content-md-center">
                        <div className="col-md-6 justify-content-md-center">
                            {status && status.message && ["warning", "success", "danger"].includes(status.type) && <div className={`alert py-2 mb-3 alert-${status.type} fade show`} role="alert" style={{ margin: '0px -15px' }}>
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
                            <input onInput={(e) => setEmail(e.target.value)} type="text" id="email" value={router.query.email || email} className="hidden" placeholder='email' hidden />
                            <div className="row justify-content-md-center text-center">
                                <h3>
                                    Reset password
                                </h3>
                                <hr />
                            </div>
                            <div className="form-group mb-4">
                                <label className='form-label' htmlFor="password">Password</label>
                                <input onInput={(e) => {
                                    setPassword(e.target.value)
                                    setStatus({
                                        ...status,
                                        errors: {
                                            ...status.errors,
                                            password: []
                                        }
                                    })
                                }} type="password" id="password" value={password} className="form-control" placeholder='***************' autoComplete="new-password" />
                                {status && status.errors && status.errors.password && <div className="text-danger"><small>{status.errors.password.join('; ')}</small></div>}
                            </div>
                            <div className="form-group mb-4">
                                <label className='form-label' htmlFor="password_repeat">Repeat password</label>
                                <input onInput={(e) => {
                                    setPasswordRepeat(e.target.value)
                                    setStatus({
                                        ...status,
                                        errors: {
                                            ...status.errors,
                                            password_repeat: []
                                        }
                                    })
                                }} type="password" id="password_repeat" value={password_repeat} className="form-control" placeholder='***************' autoComplete="new-password" />
                                {status && status.errors && status.errors.password_repeat && <div className="text-danger"><small>{status.errors.password_repeat.join('; ')}</small></div>}
                            </div>
                            <div className="form-group mb-4">
                                <input type="submit" value="Reset password" className="btn btn-primary w-100 mt-3" />
                                <div className='d-flex mt-3 flex-row justify-content-around align-items-center text-center'>
                                    <Link href="/auth/signup">
                                        <a>Create an account</a>
                                    </Link>
                                    <Link href="/auth/login">
                                        <a>Log in</a>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        )
    }