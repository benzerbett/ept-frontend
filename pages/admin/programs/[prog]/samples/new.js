import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../utilities'

function NewSample() {
    const router = useRouter()
    const { prog } = router.query
    const [status, setStatus] = useState('')
    const [allPrograms, setAllPrograms] = useState([])
    const [allRounds, setAllRounds] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [newSampleData, setNewSampleData] = useState({
        "name": "",
        "description": "",
        "program": "",

        "round": "",
        "expected_outcome": "",
        "expected_outcome_notes": "",
        "expected_interpretation": "",
        "expected_interpretation_notes": "",

        "meta": ""
    })

    const saveSample = () => {
        setLoading(true)
        getResource('sample/new', { method: 'POST', body: newSampleData }).then((data) => {
            if (data.status === true) {
                setStatus('success')
                setMessage(data.message)
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error saving sample: ' + err.message || err)
            setLoading(false)
        })
    }

    const fetchRounds = (pr) => {
        if (pr !== '' && pr != undefined && pr != null) {
            getResource(`rounds?program=${pr}&page_size=10000`).then((data) => {
                if (data.status === true) {
                    setAllRounds(data?.data?.data)
                    // setStatus('success')
                    // setMessage(data.message)
                } else {
                    // setStatus('error')
                    // setMessage('Error fetching schemas: ' + data.message)
                }
            }).catch((err) => {
                console.log(err)
                // setStatus('error')
                // setMessage('Error fetching schemas: ' + err.message || err)
            })
        }
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            if (prog) {
                setNewSampleData({ ...newSampleData, program: prog })
                fetchRounds(prog)
            }
            // get sample
            getResource(`programs?page_size=10000`).then((data) => {
                if (data.status === true) {
                    setAllPrograms(data.data?.data)
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
        return () => mounted = false
    }, [])

    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <>
            <Head>
                <title>EPT | New Sample</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New sample</h3>
                            <Link href={`/admin/programs/${prog}/samples`}>
                                <a className="btn btn-default text-muted btn-sm"> Cancel </a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-12'>
                        {status && status !== '' && <div className={`alert d-flex align-items-center gap-3 alert-${status === 'error' ? 'danger' : 'success'}`} role="alert">
                            <i className={'fa fa-2x fa-' + (status === 'error' ? 'warning' : 'info-circle')}></i> {message}
                        </div>}
                    </div>
                </div>
                <div className="row bg-light p-3 rounded">
                    <div className='col-lg-12 my-3'>
                        {status !== 'error' && <form onSubmit={ev => {
                            ev.preventDefault()
                            saveSample()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="sample_name" value={newSampleData.name} placeholder="Enter sample name" onChange={ev => {
                                        setNewSampleData({ ...newSampleData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="sample_desc" value={newSampleData.description} placeholder="Describe the sample" onChange={ev => {
                                        setNewSampleData({ ...newSampleData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_program">Program
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='sample_program' disabled value={newSampleData.program} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, program: ev.target.value })
                                    }}>
                                        <option value={''}>Select program</option>
                                        {allPrograms && allPrograms.length > 0 && allPrograms.map(prog => (
                                            <option key={prog.uuid} value={prog.uuid}>{prog.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_round">Round
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='sample_round' value={newSampleData.round} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, round: ev.target.value })
                                    }}>
                                        <option value={''}>Select round</option>
                                        {allRounds && allRounds.length > 0 && allRounds.map(spl => (
                                            <option key={spl.uuid} value={spl.uuid}>{spl.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_expected_outcome">Expected outcome</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="sample_expected_outcome" placeholder="Expected outcome" value={newSampleData.expected_outcome} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, expected_outcome: ev.target.value })
                                    }} />
                                </div>
                            </div>

                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_expected_outcome_notes">Expected outcome notes</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="sample_expected_outcome_notes" placeholder="Outcome notes" value={newSampleData.expected_outcome_notes} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, expected_outcome_notes: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>

                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_expected_interpretation">Expected interpretation</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="sample_expected_interpretation" placeholder="Expected interpretation" value={newSampleData.expected_interpretation} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, expected_interpretation: ev.target.value })
                                    }} />
                                </div>
                            </div>

                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_expected_interpretation_notes">Expected interpretation notes</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="sample_expected_interpretation_notes" placeholder="Interpretation notes" value={newSampleData.expected_interpretation_notes} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, expected_interpretation_notes: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>

                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="sample_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="sample_meta" placeholder="Additional attributes" value={typeof newSampleData.meta == 'object' ? JSON.stringify(newSampleData.meta) : newSampleData.meta} onChange={ev => {
                                        setNewSampleData({ ...newSampleData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save sample</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default NewSample