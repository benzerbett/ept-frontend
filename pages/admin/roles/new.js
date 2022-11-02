import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../utilities';

function NewRole() {

    const router = useRouter()
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [permissions, setPermissions] = useState([])

    const [roleData, setRoleData] = useState({
        "name": "",
        "description": "",
        "permissions": [],
        "meta": {}
    })

    const saveRole = () => {
        setLoading(true)
        getResource('role/new', { method: 'POST', body: roleData }).then((data) => {
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
            setMessage('Error saving role: ' + err.message || err)
            setLoading(false)
        })
    }


    const fetchPermissions = () => {
        setLoading(true)
        getResource('permissions?page_size=10000').then((data) => {
            if (data.status === true) {
                setPermissions(data?.data?.data)
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching permissions: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            fetchPermissions()
        }
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | New Role</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New role</h3>
                            <Link href="/admin/roles" as={`/admin/roles`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* <div className='row'>
                    <div className='col-md-12'>
                        {JSON.stringify(roleData)}
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
                            saveRole()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="role_name">Role Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="text" className="form-control" id="role_name" value={roleData.name} placeholder="Enter role name" onChange={ev => {
                                        setRoleData({ ...roleData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="role_desc">Role Description</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="role_desc" value={roleData.description} placeholder="Describe the role" onChange={ev => {
                                        setRoleData({ ...roleData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="role_desc">Role Permissions</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8 row px-lg-3'>
                                    {/* sorted by domain (word after _) */}
                                    {permissions.sort((a, b) => {
                                        return a.name.split('_')[1] > b.name.split('_')[1] ? 1 : -1
                                    }).map((permission, index) => {
                                        return <div className="form-check form-switch col-sm-6 col-md-4 col-xl-3" key={index}>
                                            <input className="form-check-input" type="checkbox" id={`permission_${index}`} onChange={ev => {
                                                if (ev.target.checked) {
                                                    if (!roleData.permissions.includes(permission.uuid)) {
                                                        setRoleData({ ...roleData, permissions: [...roleData.permissions, permission.uuid] })
                                                    }
                                                } else {
                                                    setRoleData({ ...roleData, permissions: roleData.permissions.filter(p => p !== permission.uuid) })
                                                }
                                            }} />
                                            <label className="form-check-label text-capitalize" htmlFor={`permission_${index}`}>{permission.name.split('_').join(' ')}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="role_meta">Role Metadata</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="role_meta" placeholder="Additional attributes" onChange={ev => {
                                        setRoleData({ ...roleData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save role</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewRole