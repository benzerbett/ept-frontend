import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function ViewOrgUnit() {
    const router = useRouter()
    const { orgunit } = router.query


    const [orgUnitData, setOrgUnitData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchOrgUnit = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setOrgUnitData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('OrgUnits fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching organization units: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'organization_unit/' + orgunit
            fetchOrgUnit(rsc)
        }
        return () => mounted = false
    }, [orgunit])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Organization Unit Details</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Organization Unit details</h2>
                    </div>
                    <Link href="/admin/orgunits/[orgunit]/edit" as={`/admin/orgunits/${orgunit}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit
                        </a>
                    </Link>
                </div>
                <hr />
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex w-100">
                            {orgUnitData && <table className='table table-borderless'>
                                <tbody>
                                    {Object.keys(orgUnitData).filter(m => m !== 'uuid').map((key, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="font-bold text-capitalize">{key.split('_').join(' ')}</td>
                                                <td>
                                                    {typeof orgUnitData[key] == 'object' ?
                                                        <pre className='p-2 br-1 pt-0' style={{whiteSpace: 'pre-wrap', backgroundColor: '#fcfcfc'}}>{JSON.stringify(orgUnitData[key], null, 2).split('"').join('').split('{').join('').split('}').join('')}</pre> :
                                                        key.includes('_at') ? (new Date(orgUnitData[key]).toLocaleString('en-GB', {
                                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                        })) :
                                                            orgUnitData[key]}
                                                </td>
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

export default ViewOrgUnit