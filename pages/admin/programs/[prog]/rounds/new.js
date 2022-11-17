import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../utilities'

function NewRound() {
    const router = useRouter()
    const { prog } = router.query
    const [status, setStatus] = useState('')
    const [allPrograms, setAllPrograms] = useState([])
    const [allSchemas, setAllSchemas] = useState([])
    const [allScoring, setAllScoring] = useState([
        'consensus',
        'z-score',
        'majority',
        'weighted',
        'custom'
    ])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [newRoundData, setNewRoundData] = useState({
        "name": "",
        "description": "",
        "program": "",
        "schema": "",
        "active": "",
        "testing_instructions": "",
        "start_date": "",
        "end_date": "",
        "meta": "",
    })

    const saveRound = () => {
        setLoading(true)
        getResource('round/new', { method: 'POST', body: newRoundData }).then((data) => {
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
            setMessage('Error saving round: ' + err.message || err)
            setLoading(false)
        })
    }

    const fetchSchemas = (pr) => {
        if (pr !== '' && pr != undefined && pr != null) {
            getResource(`schemas?program=${pr}&page_size=10000`).then((data) => {
                if (data.status === true) {
                    setAllSchemas(data?.data?.data)
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
                    setNewRoundData({ ...newRoundData, program: prog })
                    fetchSchemas(prog)
                }
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
                    <title>EPT | New Round</title>
                    <meta name="description" content="EPT" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <div className='container'>
                    <div className="row mb-4 ">
                        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                            <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                                <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                                <h3>New round</h3>
                                <Link href={`/admin/programs/${prog}/rounds`}>
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
                                saveRound()
                            }}>
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_name">Name
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <input type="text" className="form-control" id="round_name" value={newRoundData.name} placeholder="Enter round name" onChange={ev => {
                                            setNewRoundData({ ...newRoundData, name: ev.target.value })
                                        }} />
                                    </div>
                                </div>
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_desc">Description</label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <textarea className="form-control" id="round_desc" value={newRoundData.description} placeholder="Describe the round" onChange={ev => {
                                            setNewRoundData({ ...newRoundData, description: ev.target.value })
                                        }}></textarea>
                                    </div>
                                </div>
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_program">Program
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <select className='form-select' name='round_program' value={newRoundData.program} onChange={ev => {
                                            setAllSchemas([])
                                            setNewRoundData({ ...newRoundData, program: ev.target.value })
                                            fetchSchemas(ev.target.value)
                                        }}>
                                            <option value={''}>Select program</option>
                                            {allPrograms && allPrograms.length > 0 && allPrograms.map(prog => (
                                                <option key={prog.uuid} value={prog.uuid}>{prog.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                {allSchemas && allSchemas.length>0 && <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_program">Schema
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <select className='form-select' name='round_program' value={newRoundData.schema} onChange={ev => {
                                            setNewRoundData({ ...newRoundData, schema: ev.target.value })
                                            fetchSchemas(ev.target.value)
                                        }}>
                                            <option value={''}>Select schema</option>
                                            {allSchemas && allSchemas.length > 0 && allSchemas.map(schm => (
                                                <option key={schm.uuid} value={schm.uuid}>{schm.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_scoring">Scoring Criteria
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <select className='form-select' style={{ textTransform: 'capitalize' }} name='round_scoring' value={newRoundData.scoringCriteria} onChange={ev => {
                                            setNewRoundData({ ...newRoundData, scoringCriteria: ev.target.value })
                                        }}>
                                            <option value={''}>Select scoring criteria</option>
                                            {allScoring && allScoring.length > 0 && allScoring.map(score => (
                                                <option key={score} value={score}><span style={{ textTransform: 'capitalize' }}>{score}</span></option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group row mb-2 mb-lg-3">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="round_meta">Metadata</label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-7'>
                                        <textarea className="form-control" id="round_meta" placeholder="Additional attributes" value={typeof newRoundData.meta == 'object' ? JSON.stringify(newRoundData.meta) : newRoundData.meta} onChange={ev => {
                                            setNewRoundData({ ...newRoundData, meta: ev.target.value })
                                        }}></textarea>
                                    </div>
                                </div>
                                <div className="w-100 d-flex align-items-center justify-content-center">
                                    <button type="submit" className="btn btn-primary">Save round</button>
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    export default NewRound