import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import ProgramsNavbar from '../../../../components/common/ProgramsNavbar';
import { getResource } from '../../../../utilities';

function EditProgram() {
    const router = useRouter()
    const { prog } = router.query
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [programData, setProgramData] = useState(null);
    const [newProgramData, setNewProgramData] = useState({
        "name": "",
        "description": "",
        "meta": ""
    })

    const saveProgram = () => {
        console.log('saveProgram')
        setLoading(true)
        getResource('program/edit/'+prog, { method: 'PUT', body: newProgramData }).then((data) => {
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
            setMessage('Error saving program: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            // get program
            getResource(`program/${prog}`).then((data) => {
                if (data.status === true) {
                    setProgramData(data.data)
                    setNewProgramData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
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
                setMessage('Error loading program: ' + err.message || err)
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
                <title>EPT | New Program</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <ProgramsNavbar program={programData} router={router} />
                            <Link href="/admin/programs" as={`/admin/programs`}>
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
                            saveProgram()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="program_name">Program Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="program_name" defaultValue={newProgramData.name} placeholder="Enter program name" onChange={ev => {
                                        setNewProgramData({ ...newProgramData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="program_desc">Program Description</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="program_desc" defaultValue={newProgramData.description} placeholder="Describe the program" onChange={ev => {
                                        setNewProgramData({ ...newProgramData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1'>
                                    <label className='form-label' htmlFor="program_meta">Program Metadata</label>
                                    <small className='d-block text-muted lh-sm mb-1'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="program_meta" placeholder="Additional attributes" defaultValue={newProgramData.meta} onChange={ev => {
                                        setNewProgramData({ ...newProgramData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Save program</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProgram