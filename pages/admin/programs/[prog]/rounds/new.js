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
    const [allForms, setAllForms] = useState([])
    const [allSchemas, setAllSchemas] = useState([])
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
        "forms": [],
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
    const fetchForms = (pr) => {
        if (pr !== '' && pr != undefined && pr != null) {
            getResource(`forms?program=${pr}&page_size=10000`).then((data) => {
                if (data.status === true) {
                    setAllForms(data?.data?.data)
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
                fetchForms(prog)
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
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="text" className="form-control" id="round_name" value={newRoundData.name} placeholder="Enter round name" onChange={ev => {
                                        setNewRoundData({ ...newRoundData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="round_desc" value={newRoundData.description} placeholder="Describe the round" onChange={ev => {
                                        setNewRoundData({ ...newRoundData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_program">Program
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <select className='form-select' name='round_program' value={newRoundData.program} onChange={ev => {
                                        setAllSchemas([])
                                        setAllForms([])
                                        setNewRoundData({ ...newRoundData, program: ev.target.value })
                                        fetchSchemas(ev.target.value)
                                        fetchForms(ev.target.value)
                                    }}>
                                        <option value={''}>Select program</option>
                                        {allPrograms && allPrograms.length > 0 && allPrograms.map(prog => (
                                            <option key={prog.uuid} value={prog.uuid}>{prog.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {allSchemas && allSchemas.length > 0 && <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_schema">Schema
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <select className='form-select' name='round_schema' value={newRoundData.schema} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, schema: ev.target.value })
                                    }}>
                                        <option value={''}>Select schema</option>
                                        {allSchemas && allSchemas.length > 0 && allSchemas.map(schm => (
                                            <option key={schm.uuid} value={schm.uuid}>{schm.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>}
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_active">Is it active
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="radio" className="form-check-input" id="round_active" name='round_active' value={true} checked={newRoundData.active} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, active: true })
                                    }} /> Yes &nbsp;&nbsp;
                                    <input type="radio" className="form-check-input" id="round_active" name='round_active' value={false} checked={!newRoundData.active} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, active: false })
                                    }} /> No
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_use_checklist">Use readiness checklist?
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>This means that the participants will have to fill a readiness checklist form for approval before proceeding to enter results for this round</small>
                                </div>
                                <div className='col-lg-2'>
                                    <input type="radio" className="form-check-input" id="round_use_checklist" name='round_use_checklist' value={true} checked={newRoundData.use_checklist} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, use_checklist: true })
                                    }} /> Yes &nbsp;&nbsp;
                                    <input type="radio" className="form-check-input" id="round_use_checklist" name='round_use_checklist' value={false} checked={!newRoundData.use_checklist} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, use_checklist: false })
                                    }} /> No
                                </div>
                                <div className='col-lg-6'>
                                    {(newRoundData?.use_checklist && newRoundData?.use_checklist === true) && allForms && allForms.length > 0 && <div className="form-group row mb-2 mb-lg-3">
                                        <div className='col-lg-12 py-1 d-flex flex-column'>
                                            <label className='form-label' htmlFor="round_checklist">Checklist form
                                                <span className='text-danger'>*</span>
                                            </label>
                                            <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                        </div>
                                        <div className='col-lg-12'>
                                            <select className='form-select' name='round_checklist' value={newRoundData.checklist_form} onChange={ev => {
                                                if (newRoundData.forms && !newRoundData.forms.includes(ev.target.value)) setNewRoundData({ ...newRoundData, forms: [...newRoundData.forms, ev.target.value] })
                                            }}>
                                                <option value={''}>Select checklist form</option>
                                                {allForms && allForms.length > 0 && allForms.filter(f => ['survey', 'pre'].includes(f.target_type)).map(frm => (
                                                    <option key={frm.uuid} value={frm.uuid}>{frm.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>}
                                </div>
                            </div>

                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_multi_panels">Use multiple panels?
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>This means that you will use multiple panels for different cohorts/lots of participants.</small>
                                </div>
                                <div className='col-lg-4'>
                                    <input type="radio" className="form-check-input" id="round_multi_panels" name='round_multi_panels' value={true} checked={newRoundData.multi_panels} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, multi_panels: true })
                                    }} /> Yes &nbsp;&nbsp;
                                    <input type="radio" className="form-check-input" id="round_multi_panels" name='round_multi_panels' value={false} checked={!newRoundData.multi_panels} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, multi_panels: false })
                                    }} /> No
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_multi_panels">Number of lots?
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>The number of groups/cohorts to split the users into.</small>
                                </div>
                                <div className='col-lg-8'>
                                    <input type="number" className="form-control" id="round_no_lots" name='round_no_lots' placeholder='Number of lots' value={true} checked={newRoundData.no_lots} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, no_lots: true })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_instructions">Testing instructions</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="round_instructions" placeholder="Instructions" value={newRoundData.testing_instructions} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, testing_instructions: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_instructions">Period
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-4'>
                                    <label htmlFor='round_start_date'>Start date</label>
                                    <input type="date" className="form-control" id="round_start_date" placeholder="Start date" value={newRoundData.start_date ? new Date(newRoundData.start_date).toISOString().slice(0, 10) : ""} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, start_date: new Date(ev.target.value).toISOString() })
                                    }} />
                                </div>
                                <div className='col-lg-4'>
                                    <label htmlFor='round_start_date'>End date</label>
                                    <input type="date" className="form-control" id="round_end_date" placeholder="End date" value={newRoundData.end_date ? new Date(newRoundData.end_date).toISOString().slice(0, 10) : ""} onChange={ev => {
                                        setNewRoundData({ ...newRoundData, end_date: new Date(ev.target.value).toISOString() })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{borderBottom:'1px solid #ececec'}}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="round_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
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