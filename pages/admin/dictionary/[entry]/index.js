import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function ViewDictionary() {
    const router = useRouter()
    const { entry } = router.query


    const [dictionaryData, setDictionaryData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchDictionary = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setDictionaryData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Dictionary fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching dictionary: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'dictionary/' + entry
            fetchDictionary(rsc)
        }
        return () => mounted = false
    }, [entry])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Dictionary</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Dictionary details</h2>
                    </div>
                    <Link href="/admin/dictionary/[dictionary]/edit" as={`/admin/dictionary/${entry}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit Dictionary
                        </a>
                    </Link>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex w-100">
                            {dictionaryData && <table className='table table-borderless'>
                                <tbody>
                                    {Object.keys(dictionaryData)
                                    .filter(m => m !== 'uuid')
                                    .map(
                                        (key, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="font-bold text-capitalize">{key.split('_').join(' ')}</td>
                                                {/* TODO: check data type. If JSON, render in table */}
                                                <td>{dictionaryData[key] && key.includes('_at') ? (new Date(dictionaryData[key]).toLocaleString('en-GB', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                })) : typeof dictionaryData[key] === 'object' ? <pre className='p-3 rounded font-monospace' style={{lineHeight: '0.9', backgroundColor: '#e6f7fd'}}>{JSON.stringify(dictionaryData[key],null,1)}</pre> : dictionaryData[key]}</td>
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

export default ViewDictionary