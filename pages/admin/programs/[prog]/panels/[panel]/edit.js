import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../../utilities'

function EditPanel() {
    const router = useRouter()
    const { panel, prog } = router.query
    const [status, setStatus] = useState('')
    const [allPrograms, setAllPrograms] = useState([])
    const [allSamples, setAllSamples] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [newPanelData, setNewPanelData] = useState({
        "name": "",
        "description": "",
        "program": "",
        "samples": [],
        "meta": ""
    })

    const savePanel = () => {
        setLoading(true)
        getResource('panel/edit/' + panel, { method: 'PUT', body: newPanelData }).then((data) => {
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
            setMessage('Error saving panel: ' + err.message || err)
            setLoading(false)
        })
    }
    const fetchSamples = (pr) => {
        if (pr !== '' && pr != undefined && pr != null) {
            getResource(`samples?program=${pr}&page_size=10000`).then((data) => {
                if (data.status === true) {
                    setAllSamples(data?.data?.data)
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
            // get panel
            if(prog) {
                fetchSamples(prog)
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
            getResource(`panel/${panel}`).then((data) => {
                if (data.status === true) {
                    setNewPanelData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
                        "program": data.data.program || "",
                        "samples": (data.data.samples && data.data.samples.length>0 ? Array.from(data.data.samples, x => x.uuid) : []) || [],
                        "meta": data.data.meta || ""
                    })
                } else {
                    setStatus('error')
                    setMessage(data.message)
                }
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setStatus('error')
                setMessage('Error loading panel: ' + err.message || err)
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
                <title>EPT | Edit Panel</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>Edit panel</h3>
                            <Link href={`/admin/programs/${prog}/panels/${panel}`}>
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
                            savePanel()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="panel_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="panel_name" value={newPanelData.name} placeholder="Enter panel name" onChange={ev => {
                                        setNewPanelData({ ...newPanelData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="panel_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="panel_desc" value={newPanelData.description} placeholder="Describe the panel" onChange={ev => {
                                        setNewPanelData({ ...newPanelData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="panel_program">Program
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='panel_program' disabled value={newPanelData.program} onChange={ev => {
                                        setNewPanelData({ ...newPanelData, program: ev.target.value })
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
                                    <label className='form-label' htmlFor="panel_program">Samples
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='panel_program' multiple value={newPanelData.samples} onChange={ev => {
                                        let selected = Array.from(ev.target.selectedOptions, option => option.value);
                                        setNewPanelData({ ...newPanelData, samples: selected })
                                    }}>
                                        {/* <option value={''}>Select samples</option> */}
                                        {allSamples && allSamples.length > 0 && allSamples.map(spl => (
                                            <option key={spl.uuid} value={spl.uuid}>{spl.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="panel_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="panel_meta" placeholder="Additional attributes" value={typeof newPanelData.meta == 'object' ? JSON.stringify(newPanelData.meta) : newPanelData.meta} onChange={ev => {
                                        setNewPanelData({ ...newPanelData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Update panel</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditPanel