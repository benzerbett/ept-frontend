import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../../utilities'

function EditSchema() {
    const router = useRouter()
    const { schema, prog } = router.query
    const [status, setStatus] = useState('')
    const [allPrograms, setAllPrograms] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [newSchemaData, setNewSchemaData] = useState({
        "name": "",
        "description": "",
        "schema": "",
        "meta": ""
    })

    const saveSchema = () => {
        setLoading(true)
        getResource('schema/edit/' + schema, { method: 'PUT', body: newSchemaData }).then((data) => {
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
            setMessage('Error saving schema: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setStatus('')
            setMessage('')
            setLoading(false)
            // get schema
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
            getResource(`schema/${schema}`).then((data) => {
                if (data.status === true) {
                    setNewSchemaData({
                        "name": data.data.name || "",
                        "description": data.data.description || "",
                        "schema": data.data.schema || "",
                        "program": data.data.program || "",
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
                setMessage('Error loading schema: ' + err.message || err)
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
                <title>EPT | Edit Schema</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>Edit schema</h3>
                            <Link href={`/admin/programs/${prog}/schemas/${schema}`}>
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
                            saveSchema()
                        }}>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="schema_name">Name
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <input type="text" className="form-control" id="schema_name" defaultValue={newSchemaData.name} placeholder="Enter schema name" onChange={ev => {
                                        setNewSchemaData({ ...newSchemaData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="schema_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="schema_desc" defaultValue={newSchemaData.description} placeholder="Describe the schema" onChange={ev => {
                                        setNewSchemaData({ ...newSchemaData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="schema_program">Program
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <select className='form-select' name='schema_program' defaultValue={typeof newSchemaData.program == 'object' ? newSchemaData.program?.uuid : newSchemaData.program}>
                                        <option value={''}>Select program</option>
                                        {allPrograms && allPrograms.length>0 && allPrograms.map(prog=>(
                                            <option key={prog.uuid} value={prog.uuid}>{prog.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row mb-2 mb-lg-3">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="schema_meta">Metadata</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-7'>
                                    <textarea className="form-control" id="schema_meta" placeholder="Additional attributes" defaultValue={typeof newSchemaData.meta == 'object' ? JSON.stringify(newSchemaData.meta) : newSchemaData.meta} onChange={ev => {
                                        setNewSchemaData({ ...newSchemaData, meta: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="w-100 d-flex align-items-center justify-content-center">
                                <button type="submit" className="btn btn-primary">Update schema</button>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditSchema