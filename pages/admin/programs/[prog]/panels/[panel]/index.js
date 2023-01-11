import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../../../utilities'

function ViewPanel() {
    const router = useRouter()
    const { prog, panel } = router.query


    const [panelData, setPanelData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchPanel = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setPanelData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Panels fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching panels: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'panel/' + panel
            fetchPanel(rsc)
        }
        return () => mounted = false
    }, [panel])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Panel Details</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Panel details</h2>
                    </div>
                    <Link href="/admin/programs/[prog]/panels/[panel]/edit" as={`/admin/programs/${prog}/panels/${panel}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit Panel
                        </a>
                    </Link>
                </div>
                <hr />
                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        {panelData && <div className="col-md-12 bg-light rounded p-md-4">
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-2 py-1 d-flex'>
                                    <label className='form-label text-muted' htmlFor="panel_name">Name</label>
                                </div>
                                <div className='col-lg-8'>
                                    <p>{panelData.name}</p>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-2 py-1 d-flex'>
                                    <label className='form-label text-muted' htmlFor="panel_desc">Description</label>
                                </div>
                                <div className='col-lg-8'>
                                    <p>{panelData.description}</p>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-2 py-1 d-flex'>
                                    <label className='form-label text-muted' htmlFor="panel_program">Samples</label>
                                </div>
                                <div className='col-lg-8'>
                                    <div className='row'>
                                        <div className='col-lg-12'>
                                            <table className='table table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Sample</th>
                                                        <th>Description</th>
                                                        <th>Sample Type</th>
                                                        <th>Expected result</th>
                                                        <th>Expected outcome</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(panelData.samples && panelData.samples.length > 0) ? panelData.samples
                                                        //sort samples by name
                                                        .sort((a, b) => {
                                                            if (a.name < b.name) return -1;
                                                            if (a.name > b.name) return 1;
                                                            return 0;
                                                        })
                                                        .map((sample, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td className='text-muted'>{index+1}.</td>
                                                                    <td>{sample.name}</td>
                                                                    <td>{sample?.description || ""}</td>
                                                                    <td>{sample.meta?.type || ""}</td>
                                                                    <td>{sample.expected_interpretation || ""}</td>
                                                                    <td>{sample.expected_outcome || ""}</td>
                                                                </tr>
                                                                // view all link
                                                            )
                                                        }) : <tr><td colSpan='4' className='text-center text-muted'>
                                                            No samples added
                                                        </td></tr>}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewPanel