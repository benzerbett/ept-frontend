import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { doGetSession, getResource } from '../../../utilities'

function Permissions() {
    const [permissions, setPermissions] = useState([])
    const [session, setSession] = useState([])
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    useEffect(() => {
        let mounted = true
        if (mounted) {
            console.log('mounted', new Date().toISOString())
            doGetSession().then((session) => {
                if (session) {
                    setSession(session)
                    // fetch permissions
                    getResource('permissions').then((data) => {
                        if (data.status === true) {
                            setPermissions(data?.data)
                            setStatus('')   // ('success')
                            setMessage('')  // ('Permissions fetched successfully')
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
                } else {
                    router.push('/auth/login', undefined, { unstable_skipClientCache: true })
                }
            })
        }
        return () => mounted = false
    }, [])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    // return (
    //     <main>
    //         <Head>
    //             <title>Permissions</title>
    //         </Head>
    //         <div className="container">
    //             <pre>{JSON.stringify(permissions, null, 2)}</pre>
    //         </div>
    //     </main>
    // )
    return (
        <>
            <Head>
                <title>EPT | Permissions</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Permissions</h1>
                    <div className="d-flex align-items-center my-2">
                        <form className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn btn-primary bg-dark">Search</button>
                        </form>
                    </div>
                </div>
                <div className="d-flex w-100">
                    <div className="table-responsive w-100">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions && permissions.length > 0 ? permissions.map((permission) => (

                                    <tr key={permission.uuid}>
                                        <td>
                                            <Link href={`/admin/permissions/${permission.uuid}`}>
                                                <a className="">{permission.name}</a>
                                            </Link>
                                        </td>
                                        <td>
                                            {permission?.description}
                                        </td>
                                        <td className='text-capitalize'>{permission.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                        <td>{new Date(permission?.created_at).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                        }) || "-"}</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{ pathname: `/permission/${permission.uuid}/edit` }} >
                                                <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit Permission</a>
                                            </Link>
                                            <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                if (confirm('Are you sure you want to delete this permission?')) {
                                                    getResource(`permissions/delete/${permission.uuid}`, { uuid: permission.uuid }).then((data) => {
                                                        if (data.status === true) {
                                                            setStatus('success')
                                                            setMessage('Permission deleted successfully')
                                                            setPermissions(permissions.filter(u => u.uuid !== permission.uuid))
                                                        } else {
                                                            setStatus('error')
                                                            setMessage(data.message)
                                                        }
                                                    }).catch((err) => {
                                                        console.log(err)
                                                        setStatus('error')
                                                        setMessage('Error deleting permission: ' + err.message || err)
                                                    })
                                                }
                                            }}>Delete Permission</a>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={7} className="text-center">No permissions found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Permissions