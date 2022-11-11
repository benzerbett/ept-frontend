import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../utilities';

function NewUser() {

    const router = useRouter()
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [roles, setRoles] = useState([])
    const [programs, setPrograms] = useState([])

    const [userData, setUserData] = useState({
        "name": "",
        "email": "",
        "role": "",
        "password": "",
        "password_repeat": "",
        "programs": [],
        "meta": {}
    })

    const saveUser = () => {
        // compare password and confirm password
        if (userData.password !== userData.password_repeat) {
            setStatus('error')
            setMessage('Passwords do not match')
            return
        }
        setLoading(true)
        getResource('user/new', { method: 'POST', body: userData }).then((data) => {
            if (data.status === true) {
                setStatus('success')
                setMessage(data.message)
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error saving user: ' + err.message || err)
            setLoading(false)
        })
    }


    const fetchRoles = () => {
        // setLoading(true)
        getResource('roles?page_size=10000').then((data) => {
            if (data.status === true) {
                setRoles(data?.data?.data)
                setStatus('')
                setMessage('')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            // setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching roles: ' + err.message || err)
            // setLoading(false)
        })
    }


    const fetchPrograms = () => {
        // setLoading(true)
        getResource('programs?page_size=10000').then((data) => {
            if (data.status === true) {
                setPrograms(data?.data?.data)
                setStatus('')
                setMessage('')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            // setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching programs: ' + err.message || err)
            // setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            fetchRoles()
            fetchPrograms()
        }
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | New User</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New user</h3>
                            <Link href="/admin/users" as={`/admin/users`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className='row'>
                    <div className='col-md-12'>
                        {JSON.stringify(userData)}
                    </div>
                </div> */}

                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row bg-light p-3 rounded">
                    <div className='col-lg-12 my-3'>
                        <form onSubmit={ev => {
                            ev.preventDefault()
                            saveUser()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="text" className="form-control" id="user_name" value={userData.name} placeholder="Enter name" onChange={ev => {
                                        setUserData({ ...userData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_email">Email
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="email" className="form-control" id="user_email" value={userData.email} placeholder="Enter email" onChange={ev => {
                                        setUserData({ ...userData, email: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_desc">Role
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <select className='form-select' onChange={ev => {
                                        setUserData({ ...userData, role: ev.target.value })
                                    }}>
                                        <option value=''>Select role</option>
                                        {roles.map((rl, index) => {
                                            return <option key={rl.uuid} value={rl.uuid}>{rl.name}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            {/* assign program if user is not guest */}
                            {(userData.role && userData.role !== roles.find(rl => rl.name == 'guest')?.uuid) &&
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex'>
                                        <label className='form-label' htmlFor="user_desc">Programs</label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8'>
                                        <select multiple className='form-select' onChange={ev => {
                                            setUserData({ ...userData, programs: [...ev.target.selectedOptions].map(opt => opt.value) })
                                        }}>
                                            {/* <option value=''>Select program</option> */}
                                            {programs.map((pr, index) => {
                                                return <option key={pr.uuid} value={pr.uuid}>{pr.name}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>}
                            {/* password */}
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_password">Password
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="password" className="form-control" id="user_password" value={userData.password} placeholder="Enter password" onChange={ev => {
                                        setUserData({ ...userData, password: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_password_repeat">Repeat password
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="password" className="form-control" id="user_password_repeat" value={userData.password_repeat} placeholder="Repeat password" onChange={ev => {
                                        setUserData({ ...userData, password_repeat: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex'>
                                    <label className='form-label' htmlFor="user_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="user_meta" placeholder="Additional attributes" onChange={ev => {
                                        setUserData({ ...userData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save user</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewUser