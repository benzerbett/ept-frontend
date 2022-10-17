import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Head from 'next/head';
import Link from 'next/link';
import { doGetSession, doSignup } from '../../utilities';
import { useRouter } from 'next/router';

function Signup() {
    const router = useRouter()
    let [name, setName] = useState('');
    let [lname, setLName] = useState('');
    let [phone, setPhone] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [password2, setPassword2] = useState('');
    let [loading, setLoading] = useState(true);
    let [status, setStatus] = useState({
        type: 'info',
        message: 'Loading...',
        errors: {
            email: [],
            password: [],
            password2: [],
            phone: [],
            name: [],
        }
    });
    const handleSubmit = async (e) => {
        setStatus({
            type: 'info',
            message: 'Loading...'
        })

        let full_name = name + ' ' + lname;
        //validate name, email, phone, password
        if (full_name === '' || full_name.length < 3) {
            setStatus({
                errors: {
                    ...status.errors,
                    name: ['Name is required']
                }
            })
            return
        }
        if (phone === '' || phone.length < 10) {
            setStatus({
                errors: {
                    ...status.errors,
                    phone: ['Phone is required']
                }
            })
            return
        }
        if (email === '' || email.length < 3) {
            setStatus({
                errors: {
                    ...status.errors,
                    email: ['Email is required']
                }
            })
            return
        }
        if (password === '' || password == null) {
            setStatus({
                errors: {
                    ...status.errors,
                    password: ['Confirm Password is required']
                }
            })
            return
        }
        if (password.length < 8) {
            setStatus({
                errors: {
                    ...status.errors,
                    password: ['Password must be at least 8 characters']
                }
            })
            return
        }
        if (password2 === '' || password2.length < 3) {
            setStatus({
                errors: {
                    ...status.errors,
                    password2: ['Confirm Password is required']
                }
            })
            return
        }

        if (password !== password2) {
            setStatus({
                errors: {
                    ...status.errors,
                    password: ['Passwords do not match'],
                    password2: ['Confirm Password does not match']
                }
            })
            return
        }
        doSignup(full_name.trim(), email.trim(), phone.trim(), password, router).then((data) => {
            // console.log('doSignup data::', data)
            if (data.status === true) {
                // login success
                setStatus({
                    type: 'success',
                    message: "Account created successfully. Please login to continue"
                })
                // clear form
                setName('')
                setLName('')
                setPhone('')
                setEmail('')
                setPassword('')
                setPassword2('')
            } else {
                // login failed
                setStatus({
                    ...data,
                    type: 'danger',
                })
            }
        }).catch((error) => {
            console.log('doSignup error::', error)
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
                <title>EPT | Signup</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container my-5">
                <div className="row justify-content-md-center">
                    <form onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleSubmit(e)
                    }} action="" method="post" className="col-sm-7 border border-grey p-5">
                        <h3 className='text-center'>Create an account</h3>
                        <hr />
                        <div className="row justify-content-md-center">
                            <div className="col-md-12 justify-content-md-center">
                                {status && status.message && ["warning", "success", "danger"].includes(status.type) && <div className={`alert py-2 mb-3 alert-${status.type} fade show`} role="alert" style={{ margin: '0px -15px' }}>
                                    <p className='text-center mb-0' style={{ textTransform: 'capitalize' }}>{status.message}</p>
                                    <Link href='/auth/login'>
                                        <a className='text-center d-block' style={{ textTransform: 'capitalize' }}>Login</a>
                                    </Link>
                                </div>}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='fname' className='form-label mb-1'>First name:</label>
                                    <input type="text" name="fname" className={"form-control " + (status?.errors?.name && status?.errors?.name.length > 0 ? "is-invalid" : "")} placeholder='Jane' value={name} onInput={(e) => {
                                        setName(e.target.value);
                                        // remove name errors
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                name: []
                                            }
                                        })
                                    }} />
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='lname' className='form-label mb-1'>Last name:</label>
                                    <input type="text" name="lname" className={"form-control " + (status?.errors?.name && status?.errors?.name.length > 0 ? "is-invalid" : "")} placeholder='Ndegwa' value={lname} onInput={(e) => {
                                        setLName(e.target.value);
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                name: []
                                            }
                                        })
                                    }} />
                                </div>
                            </div>
                            <div className='col-md-12 m-1'>
                                {status && status.errors && status.errors.name && status.errors.name.length > 0 && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.name.join('; ')}</small></div>}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='email' className='form-label mb-1'>Email:</label>
                                    <input type="email" name="email" className={"form-control " + (status?.errors?.email && status?.errors?.email.length > 0 ? "is-invalid" : "")} placeholder='jndegwa@yahoo.com' value={email} onChange={(e) => {
                                        setEmail(e.target.value);
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                email: []
                                            }
                                        })
                                    }} />
                                    {status && status.errors && status.errors.email && status.errors.email.length > 0 && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.email.join('; ')}</small></div>}
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='phone' className='form-label mb-1'>Phone:</label>
                                    <input type="text" name="phone" className={"form-control " + (status?.errors?.phone && status?.errors?.phone.length > 0 ? "is-invalid" : "")} placeholder='0712334455' value={phone} onChange={(e) => {
                                        setPhone(e.target.value);
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                phone: []
                                            }
                                        })
                                    }} />
                                    {status && status.errors && status.errors.phone && status.errors.phone.length > 0 && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.phone.join('; ')}</small></div>}
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='password' className='form-label mb-1'>Password:</label>
                                    <input type="password" name="password" className={"form-control " + (status?.errors?.password && status?.errors?.password.length > 0 ? "is-invalid" : "")} placeholder='**********' value={password} onChange={(e) => {
                                        setPassword(e.target.value);
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                password: []
                                            }
                                        })
                                    }} />
                                    {status && status.errors && status.errors.password && status.errors.password.length > 0 && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.password.join('; ')}</small></div>}
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='password-repeat' className='form-label mb-1'>Repeat password:</label>
                                    <input type="password" name="password-repeat" className={"form-control " + (status?.errors?.password2 && status?.errors?.password2.length > 0 ? "is-invalid" : "")} placeholder='**********' value={password2} onChange={(e) => {
                                        setPassword2(e.target.value);
                                        setStatus({
                                            ...status,
                                            errors: {
                                                ...status.errors,
                                                password2: []
                                            }
                                        })
                                    }} />
                                    {status && status.errors && status.errors.password2 && status.errors.password2.length > 0 && <div className="alert alert-danger border-white my-1 p-0 px-2"><small>{status.errors.password2.join('; ')}</small></div>}
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary w-100 mt-4" >Create an account</button>
                        <div className='py-3 text-muted'>
                            <small>By creating an account, you agree to the terms and conditions and the privacy policy of this application website.</small>
                        </div>
                        <div className='d-flex mt-3 flex-row justify-content-around align-items-center text-center'>
                            <span>Have an account?{' '}<Link href="/auth/login">
                                <a>Log in</a>
                            </Link></span>
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

export default Signup