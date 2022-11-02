import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function ViewPermission() {
    const router = useRouter()
    const { permission } = router.query


    const [permissionData, setPermissionData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchPermission = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setPermissionData(data?.data)

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
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'permission/' + permission
            fetchPermission(rsc)
        }
        return () => mounted = false
    }, [permission])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Edit Permission</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New permission</h3>
                            <Link href="/admin/programs" as={`/admin/permissions`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="row bg-light p-3 rounded">
                    {permissionData && <form className='col-lg-12'>
                        {Object.keys(permissionData).filter(m => (m !== 'uuid' && !m.includes('_at'))).map((key, index) => {
                            return (
                                <div className='form-group row mb-3 d-flex align-items-center'>
                                    <label className="col-lg-3 mb-0 form-label text-capitalize">{key.split('_').join(' ')}</label>
                                    <div className='col-lg-6'>
                                        <input className="form-control" value={permissionData[key]} name={key} readOnly type={'text'} />
                                    </div>
                                </div>
                            )
                        })}

                        <div className='col-lg-12 d-flex align-items-center justify-content-center'>
                            {/* submit */}
                            <input type="submit" className="btn btn-primary" value="Update Permission" />
                        </div>
                    </form>}
                </div>
            </div>
        </>
    )
}

export default ViewPermission