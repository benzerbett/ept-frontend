import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../utilities';

function EditRole() {
    const router = useRouter()
    const { role } = router.query
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState([])

    const [newRoleData, setNewRoleData] = useState({
        "name": "",
        "description": "",
        "meta": "",
        "permissions": []
    })


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

    const saveRole = () => {
        setLoading(true)
        getResource('role/edit/' + role, { method: 'PUT', body: newRoleData }).then((data) => {
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

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            fetchPermissions()
            // get role
            getResource(`role/${role}`).then((data) => {
                if (data.status === true) {
                    setNewRoleData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
                        "meta": data.data.meta || "",
                        "permissions": Array.from(data.data.permissions, p => p.uuid) || []
                    })
                } else {
                    setStatus('error')
                    setMessage(data.message)
                }
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setStatus('error')
                setMessage('Error loading role: ' + err.message || err)
                setLoading(false)
            })
        }
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | Edit role</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>Edit role</h3>
                            <Link href="/admin/roles" as={`/admin/roles`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row bg-light p-3 rounded">
                    <div className='col-lg-12 my-3'>
                        {status !== 'error' && <form onSubmit={ev => {
                            ev.preventDefault()
                            saveRole()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="role_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="text" className="form-control" id="role_name" defaultValue={newRoleData.name} placeholder="Enter role name" onChange={ev => {
                                        setNewRoleData({ ...newRoleData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="role_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="role_desc" defaultValue={newRoleData.description} placeholder="Describe the role" onChange={ev => {
                                        setNewRoleData({ ...newRoleData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="role_desc">Role Permissions</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8 row px-lg-3'>
                                    {/* sorted by domain (word after _) */}
                                    {permissions.sort((a, b) => {
                                        return a.name.split('_')[1] > b.name.split('_')[1] ? 1 : -1
                                    }).map((permission, index) => {
                                        return <div className="form-check form-switch col-sm-6 col-md-4 col-xl-3" key={index}>
                                            <input className="form-check-input" type="checkbox" id={`permission_${index}`} onChange={ev => {
                                                if (ev.target.checked) {
                                                    if (!newRoleData.permissions.includes(permission.uuid)) {
                                                        setNewRoleData({ ...newRoleData, permissions: [...newRoleData.permissions, permission.uuid] })
                                                    }
                                                } else {
                                                    setNewRoleData({ ...newRoleData, permissions: newRoleData.permissions.filter(p => p !== permission.uuid) })
                                                }
                                            }} checked={newRoleData.permissions.includes(permission.uuid)} />
                                            <label className="form-check-label text-capitalize" htmlFor={`permission_${index}`}>{permission.name.split('_').join(' ')}</label>
                                        </div>
                                    })}
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="role_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="role_meta" placeholder="Additional attributes" defaultValue={typeof newRoleData.meta == 'object' ? JSON.stringify(newRoleData.meta) : newRoleData.meta} onChange={ev => {
                                        setNewRoleData({ ...newRoleData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Update role</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditRole