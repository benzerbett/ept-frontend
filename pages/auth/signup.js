import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

function Signup() {
    return (
        <>
            <Head>
                <title>EPT | Signup</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container my-5">
                <div className="row justify-content-md-center">
                    <form className="col-sm-7 border border-primary p-5">
                        <h3 className='text-center'>Create an account</h3>
                        <hr/>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='fname' className='form-label mb-1'>First name:</label>
                                    <input type="text" name="fname" className="form-control" placeholder='Jane' />
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='lname' className='form-label mb-1'>Last name:</label>
                                    <input type="text" name="lname" className="form-control" placeholder='Ndegwa' />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='email' className='form-label mb-1'>Email:</label>
                                    <input type="email" name="email" className="form-control" placeholder='jndegwa@yahoo.com' />
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='phone' className='form-label mb-1'>Phone:</label>
                                    <input type="text" name="phone" className="form-control" placeholder='0712334455' />
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='password' className='form-label mb-1'>Password:</label>
                                    <input type="password" name="password" className="form-control" placeholder='**********' />
                                </div>
                            </div>
                            <div className='col-md-6 mt-3'>
                                <div className="form-group">
                                    <label htmlFor='password-repeat' className='form-label mb-1'>Repeat password:</label>
                                    <input type="password" name="password-repeat" className="form-control" placeholder='**********' />
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