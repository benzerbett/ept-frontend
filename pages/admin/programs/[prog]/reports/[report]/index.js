import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProgramsNavbar from '../../../../../../components/common/ProgramsNavbar'
import { getResource } from '../../../../../../utilities'

function ViewReport() {
    const router = useRouter()
    const { prog, report } = router.query
    const [programData, setProgramData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchProgram = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setProgramData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // 
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching programs: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'program/' + prog
            fetchProgram(rsc)
        }
        return () => mounted = false
    }, [prog])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>
    return (
        <>
            <Head>
                <title>EPT | View Report</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container p-0'>
                <div className="row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <ProgramsNavbar program={programData} router={router} />
                            <Link href="/admin/programs/[program]/reports/[report]/edit" as={`/admin/programs/${prog}/reports/${report}/edit`}>
                                <a className="btn btn-primary btn-sm">
                                    <i className='fa fa-pencil'></i> &nbsp;
                                    Edit Report
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className='col-lg-12'>
                        ViewReport Program:{prog}, Report:{report}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewReport