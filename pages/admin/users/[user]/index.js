import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function ViewUser() {
    const router = useRouter()
    const { user } = router.query


    const [userData, setUserData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchUser = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setUserData({
                    ...data?.user,
                    role: data?.role?.name || 'No role assigned',
                    permissions: data?.permissions.map((p) => p.name).join(', ') || 'No permissions assigned',
                    programs: data?.programs.map((p) => p.name).join(', ') || 'No programs assigned',
                })

                setStatus('')   // ('success')
                setMessage('')  // ('Users fetched successfully')
            } else {
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
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'user/' + user
            fetchUser(rsc)
        }
        return () => mounted = false
    }, [user])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | User Details</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">User details</h2>
                    </div>
                    <Link href="/admin/users/[user]/edit" as={`/admin/users/${user}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit User
                        </a>
                    </Link>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex w-100">
                            {userData && <table className='table table-borderless'>
                                <tbody>
                                    {Object.keys(userData).filter(m => m !== 'uuid').map((key, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="font-bold text-capitalize">{["string", "number"].includes(typeof key) ? key.split('_').join(' ') : JSON.stringify(key,null,2)}</td>
                                                <td>{key.includes('_at') ? (new Date(userData[key]).toLocaleString('en-GB', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                })) : userData[key]}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewUser