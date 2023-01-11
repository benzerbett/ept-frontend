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
    const [sampleTypes, setSampleTypes] = useState([
        "Blood",
        "Dried Blood Spot",
        "Serum",
        "Plasma",
        "Urine",
        "Tissue",
        "Stool",
        "Image",
        "Other"
    ])
    const [blankSample, setBlankSample] = useState({
        "name": "",
        "description": "",
        "expected_interpretation": "",
        "expected_outcome": "",
        "meta": {}
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
            window.scrollTo(0, 0)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error saving panel: ' + err.message || err)
            setLoading(false)
            window.scrollTo(0, 0)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            getResource(`panel/${panel}`).then((data) => {
                if (data.status === true) {
                    setNewPanelData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
                        "samples": Array.from(data.data.samples, s => {
                            return {
                                ...s,
                                id: s.uuid
                            }
                        }),
                        "meta": data.data.meta || "",
                        "id": data.data.uuid
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
                                    <label className='form-label' htmlFor="panel_program">Samples
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <div className='row'>
                                        <div className='col-lg-12'>
                                            <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#addsamplemdl" id="addSplModalTrigger">
                                                <i className='fa fa-plus'></i> Add sample
                                            </button>
                                            <table className='table table-sm'>
                                                <thead>
                                                    <tr>
                                                        <th>Sample</th>
                                                        <th>Sample Type</th>
                                                        <th>Expected outcome</th>
                                                        <th>Expected interpretation</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(newPanelData.samples && newPanelData.samples.length > 0) ? newPanelData.samples
                                                        .filter((sample, index) => !sample.deleted)
                                                        //sort samples by name
                                                        .sort((a, b) => {
                                                            if (a.name < b.name) return -1;
                                                            if (a.name > b.name) return 1;
                                                            return 0;
                                                        })
                                                        .map((sample, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <button type="button" title="Edit sample" className="btn btn-link fs-6 py-0 px-2" onClick={(v) => {
                                                                            v.preventDefault();
                                                                            if (sample && sample?.id) {
                                                                                setBlankSample(sample);
                                                                                document.getElementById("addSplModalTrigger").click();
                                                                            }
                                                                        }}>
                                                                            &nbsp;{sample.name}&nbsp;
                                                                        </button>
                                                                    </td>
                                                                    <td>{sample.meta?.type || "-"} {(sample.meta?.type && sample.meta?.type.toLocaleLowerCase() == "other" && sample.meta?.other_type) && <span>({sample.meta?.other_type})</span>}</td>
                                                                    <td>{sample.expected_outcome || "-"}</td>
                                                                    <td>{sample.expected_interpretation || "-"}</td>
                                                                    <td>

                                                                        <button type="button" title="Remove sample" className="btn btn-link text-danger text-decoration-none fs-6 py-0 px-2" onClick={(e) => {
                                                                            e.preventDefault();
                                                                            if (window.confirm('Are you sure you want to delete this sample?')) {
                                                                                if (sample?.uuid) {
                                                                                    let samples = [...newPanelData.samples];
                                                                                    let sample_index = newPanelData.samples.findIndex(s => s.uuid === sample.uuid);
                                                                                    samples[sample_index].deleted = true;
                                                                                    setNewPanelData({ ...newPanelData, samples: samples });
                                                                                } else {
                                                                                    if (sample?.id) {
                                                                                        let samples = newPanelData.samples.filter(s => s.id !== sample.id);
                                                                                        setNewPanelData({ ...newPanelData, samples: samples });
                                                                                    }
                                                                                }
                                                                            }

                                                                        }}>Remove</button>
                                                                    </td>
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
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Update panel</button>

                                {/* {window && window?.location?.hostname == "localhost" && <button className="btn btn-link text-muted mx-3 btn-sm" onClick={e => {
                                    e.preventDefault();
                                    alert(JSON.stringify(newPanelData, null, 4))
                                }}>Preview</button>} */}
                            </div>
                        </form>}
                    </div>
                </div>
            </div>





            {/* ------------------- MODALS ------------------- */}

            {/* --- add sample modal --- */}
            <div className="modal fade" id="addsamplemdl" tabIndex="-1" role="dialog" aria-labelledby="addsamplemdltitle" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" style={{ backgroundColor: 'azure' }}>
                        <div className="modal-header">
                            <h5 className="modal-title" id="addsamplemdltitle">{blankSample?.id ? "Update" : "Add"} sample</h5>
                            <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close" data-bs-target="#addsamplemdl"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-12 form-group mb-2">
                                    <label className='form-label mb-0' htmlFor="sample_name">Sample Name <span className='text-danger'>*</span></label>
                                    <input type="text" className="form-control" id="sample_name" placeholder="Sample name" value={blankSample?.name} onChange={ev => {
                                        let newSpl = {
                                            ...blankSample
                                        }
                                        newSpl.name = ev.target.value
                                        setBlankSample({ ...newSpl })
                                    }} />
                                </div>
                                <div className="col-md-12 form-group mb-2">
                                    <label className='form-label mb-0' htmlFor="sample_desc">Sample Description</label>
                                    <textarea className="form-control" id="sample_desc" value={blankSample.description} placeholder="Sample description" onChange={ev => {
                                        setBlankSample({ ...blankSample, description: ev.target.value })
                                    }}></textarea>
                                </div>
                                <div className="col-md-12 form-group mb-2">
                                    <label className='form-label mb-0' htmlFor="sample_type">Sample Type <span className='text-danger'>*</span></label>
                                    <select className='form-select mb-1 text-capitalize' style={{ textTransform: 'capitalize' }} name='target_type' value={blankSample.meta?.type} onChange={ev => {
                                        let newSpl = {
                                            ...blankSample
                                        }
                                        newSpl.meta.type = ev.target.value
                                        setBlankSample({ ...newSpl })
                                    }}>
                                        <option value=''>Select Sample Type</option>
                                        {sampleTypes.map((type, i) => (
                                            <option key={i} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                {blankSample.meta?.type && blankSample.meta?.type.toLocaleLowerCase() === 'other' && (
                                    <div className="col-md-12 form-group mb-2">
                                        <label className='form-label mb-0' htmlFor="sample_other_type">Other Sample Type</label>
                                        <input type="text" className="form-control" id="sample_other_type" value={blankSample.meta?.other_type} placeholder="Other Sample Type" onChange={ev => {
                                            let newSpl = {
                                                ...blankSample
                                            }
                                            newSpl.meta.other_type = ev.target.value
                                            setBlankSample({ ...newSpl })
                                        }} />
                                    </div>
                                )}
                                <div className="col-md-12 form-group mb-2">
                                    <label className='form-label mb-0' htmlFor="sample_outcome">Expected outcome</label>
                                    <textarea className="form-control" id="sample_outcome" value={blankSample.expected_outcome} placeholder="Expected outcome" onChange={ev => {
                                        setBlankSample({ ...blankSample, expected_outcome: ev.target.value })
                                    }}></textarea>
                                </div>
                                <div className="col-md-12 form-group mb-2">
                                    <label className='form-label mb-0' htmlFor="sample_interpretation">Expected interpretation <span className='text-danger'>*</span></label>
                                    <textarea className="form-control" id="sample_interpretation" value={blankSample.expected_interpretation} placeholder="Expected interpretation" onChange={ev => {
                                        setBlankSample({ ...blankSample, expected_interpretation: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-link text-muted" data-bs-toggle="modal" data-bs-target="#addsamplemdl" onClick={e => {
                                setBlankSample({ "name": "", "description": "", "expected_interpretation": "", "expected_outcome": "", "meta": {} })
                            }}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={e => {
                                e.preventDefault();
                                let newSpl = {
                                    ...blankSample
                                }
                                if (newSpl?.uuid) {
                                    newSpl.edited = true
                                }
                                let curr_samples = newPanelData.samples || []
                                if (newSpl?.id && curr_samples.findIndex(spl => spl.id === newSpl.id) !== -1) {
                                    // existing sample
                                    curr_samples[curr_samples.findIndex(spl => spl.id === newSpl.id)] = newSpl
                                    setBlankSample({ "name": "", "description": "", "expected_interpretation": "", "expected_outcome": "", "meta": {} })
                                } else {
                                    // new sample
                                    newSpl.id = Math.random().toString(36).substr(2, 9)
                                    if (curr_samples.findIndex(spl => spl.name === newSpl.name) === -1) {
                                        curr_samples.push(newSpl)
                                        setBlankSample({ "name": "", "description": "", "expected_interpretation": "", "expected_outcome": "", "meta": {} })
                                    } else {
                                        // alert('A similar sample already exists')
                                    }
                                }
                                setNewPanelData({ ...newPanelData, samples: curr_samples })
                                document.getElementById('addSplModalTrigger').click()
                            }}
                            // disabled={!blankSample || !blankSample?.name}
                            >{blankSample?.id ? "Update" : "Add"}</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- add sample modal --- */}
            {/* ------------------- MODALS ------------------- */}
        </>
    )
}

export default EditPanel