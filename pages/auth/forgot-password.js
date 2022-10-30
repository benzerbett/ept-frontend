import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { sendPasswordResetLink } from '../../utilities';

function PasswordEmail() {
    const router = useRouter()
    let [email, setEmail] = useState('');
    let [loading, setLoading] = useState(true);
    let [status, setStatus] = useState({
        type: 'info',
        message: 'Loading...'
    });

    const handleSubmit = async (e) => {
        // send password reset link
        sendPasswordResetLink(email, router).then((data) => {
            if (data.status === true) {
                setStatus({
                    type: 'success',
                    message: data?.message || "Please check your email for a link to reset your password."
                })
            } else {
                setStatus({
                    ...data,
                    type: 'danger',
                })
            }
        }).catch((error) => {
            console.log('sendPasswordResetLink error::', error)
        })
    }

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setLoading(false);
        }
        return () => mounted = false;
    }, [])


    if (loading) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </div>


    return (
        <>
            <Head>
                <title>EPT | Forgot Password</title>
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
                        <div className="row justify-content-md-center text-center">
                            <h3>
                                Forgot Password
                            </h3>
                            <hr/>
                            <p className="text-muted">
                                Enter your email address and we will send you a link to reset your password.
                            </p>
                        </div>
                        <div className="form-group mb-4">
                            <label className='form-label' htmlFor="email">Email</label>
                            <input onInput={(e) => setEmail(e.target.value)} type="text" id="email" value={email} className="form-control" placeholder='email' />
                            {status && status.errors && status.errors.email && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.email.join('; ')}</small></div>}
                        </div>
                        <div className="form-group mb-4">
                            <input type="submit" value="Send password reset link" className="btn btn-primary w-100 mt-3" />
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

export default PasswordEmail