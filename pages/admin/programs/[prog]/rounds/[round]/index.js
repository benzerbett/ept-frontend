import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../../../utilities'

function ViewRound() {
    const router = useRouter()
    const { prog, round } = router.query


    const [roundData, setRoundData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchRound = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setRoundData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Rounds fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching rounds: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'round/' + round
            fetchRound(rsc)
        }
        return () => mounted = false
    }, [round])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Round Details</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Round details</h2>
                    </div>
                    <Link href="/admin/programs/[prog]/rounds/[round]/edit" as={`/admin/programs/${prog}/rounds/${round}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit Round
                        </a>
                    </Link>
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-8">
                        <div className="d-flex w-100">
                            {roundData && <table className='table table-borderless'>
                                <tbody>
                                {Object.keys(roundData).filter(m => m !== 'uuid').map((key, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="font-bold text-capitalize">{key.split('_').join(' ')}</td>
                                                <td>
                                                    {typeof roundData[key] == 'object' ?
                                                        <pre className='p-2 br-1 pt-0' style={{whiteSpace: 'pre-wrap', backgroundColor: '#fcfcfc'}}>{JSON.stringify(roundData[key], null, 2).split('"').join('').split('{').join('').split('}').join('')}</pre> :
                                                        key.includes('_at') ? (new Date(roundData[key]).toLocaleString('en-GB', {
                                                            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true
                                                        })) :
                                                            roundData[key]}
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

export default ViewRound