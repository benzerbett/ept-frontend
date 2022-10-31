import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function ViewRole() {
    const router = useRouter()
    const { role } = router.query


    const [roleData, setRoleData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchRole = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setRoleData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Roles fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching roles: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'role/' + role
            fetchRole(rsc)
        }
        return () => mounted = false
    }, [role])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Role Details</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Role details</h2>
                    </div>
                    <Link href="/admin/roles/[role]/edit" as={`/admin/roles/${role}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit Role
                        </a>
                    </Link>
                </div>
                <hr />
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex w-100">
                            {roleData && <table className='table table-borderless'>
                                <tbody>
                                    <tr>
                                        <td className='font-bold text-muted'>Name</td>
                                        <td>{roleData.name}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold text-muted'>Description</td>
                                        <td>{roleData.description}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold text-muted'>Permissions</td>
                                        <td className='d-flex flex-wrap'>{Object.values(roleData.permissions).length > 0 ? Object.values(roleData.permissions).map((p, k) => <Link href={`/admin/permissions/${Object.keys(roleData.permissions)[k]}`}><a key={k} className='badge text-dark m-1' style={{backgroundColor: 'rgb(232, 232, 232)', fontSize: '0.9em', fontWeight: 500}}>{p}</a></Link>) : 'No permissions'}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold text-muted'>Created at</td>
                                        <td>{new Date(roleData?.created_at).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold text-muted'>Updated at</td>
                                        <td>{new Date(roleData?.updated_at).toLocaleString('en-GB', {
                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                        })}</td>
                                    </tr>
                                    <tr>
                                        <td className='font-bold text-muted'>Metadata</td>
                                        <td>
                                            {roleData?.meta ? <pre className='p-3 rounded font-monospace' style={{ lineHeight: '0.9', backgroundColor: '#e6f7fd' }}>{JSON.stringify(roleData?.meta, null, 1)}</pre> : "-"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewRole