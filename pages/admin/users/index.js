import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { doGetSession, getResource } from '../../../utilities'

function Users() {
    const [users, setUsers] = useState([])
    const [session, setSession] = useState([])
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const router = useRouter()


    useEffect(() => {
        doGetSession().then((session) => {
            if (session) {
                setSession(session)
                // fetch users
                getResource('users').then((data) => {
                    if(data.status === true){
                        setUsers(data?.data)
                        setStatus('')   // ('success')
                        setMessage('')  // ('Users fetched successfully')
                    }else{
                        setStatus('error')
                        setMessage(data.message)
                    }
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                    setStatus('error')
                    setMessage('Error fetching users: ' + err.message || err)
                    setLoading(false)
                })
            } else {
                router.push('/auth/login', undefined, { unstable_skipClientCache: true })
            }
        })
    }, [])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    // return (
    //     <main>
    //         <Head>
    //             <title>Users</title>
    //         </Head>
    //         <div className="container">
    //             <pre>{JSON.stringify(users, null, 2)}</pre>
    //         </div>
    //     </main>
    // )

    return (
        <>
            <Head>
                <title>EPT | Users</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <h1 className="font-bold my-4">Users</h1>
                    <div className="d-flex align-items-center my-2">
                        <form className="input-group">
                            <input type="text" className="form-control" placeholder="Search" />
                            <button className="btn btn-primary bg-dark">Search</button>
                        </form>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-md-2 d-flex align-items-center">
                        <Link href="/user/surveys"><a className="">&larr; Back</a></Link>
                    </div>
                    <div className="col-md-10 d-flex align-items-center justify-content-center">
                        {status && <div className={`py-3 mb-0 px-3 fs-6 alert w-100 text-center alert-${status === 'success' ? 'success' : ['danger', 'error', 'failed'].includes(status) ? 'danger' : status}`} role="alert">
                            {message}
                        </div>}
                    </div>
                    <hr className="mt-3 mb-3" style={{ borderColor: '#ccc' }} />
                </div> */}
                <div className="d-flex w-100">
                    <div className="table-responsive w-100">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Title</th>
                                    <th scope="col">Role</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created At</th>
                                    <th scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? users.map((user) => (

                                    <tr key={user.uuid}>
                                        <td>
                                            {user?.name}
                                        </td>
                                        <td>
                                            {user?.role?.name || 'N/A'}
                                        </td>
                                        <td className='text-capitalize'>{user.deleted_at == null ? <span className='badge bg-success'>Active</span> : <span className='badge bg-warning'>Disabled</span>}</td>
                                        <td>{new Date(user?.created_at).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                        }) || "-"}</td>
                                        <td className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                                            <Link href={{ pathname: `/user/${user.uuid}/edit` }} >
                                                <a className='btn btn-primary btn-sm py-0 text-nowrap'>Edit User</a>
                                            </Link>
                                                <a className='btn text-danger btn-link btn-sm py-0 text-nowrap' onClick={ev=>{
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    if(confirm('Are you sure you want to delete this user?')){
                                                        getResource(`users/delete/${user.uuid}`, {uuid: user.uuid}).then((data) => {
                                                            if(data.status === true){
                                                                setStatus('success')
                                                                setMessage('User deleted successfully')
                                                                setUsers(users.filter(u=>u.uuid !== user.uuid))
                                                            }else{
                                                                setStatus('error')
                                                                setMessage(data.message)
                                                            }
                                                        }).catch((err) => {
                                                            console.log(err)
                                                            setStatus('error')
                                                            setMessage('Error deleting user: ' + err.message || err)
                                                        } )
                                                    }
                                                }}>Deactivate User</a>
                                        </td>
                                    </tr>
                                )) : <tr><td colSpan={7} className="text-center">No users found</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users