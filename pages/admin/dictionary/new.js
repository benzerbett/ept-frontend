import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

function EditDictionary() {
    const router = useRouter()

    const [newDictionary, setnewDictionary] = useState({})

    const [valueType, setValueType] = useState('')

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);


    const saveEntry = () => {
        setLoading(true)
        getResource('dictionary/new', { method: 'POST', body: newDictionary }).then((data) => {
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
            setMessage('Error saving dictionary entry: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            setLoading(false)
            setStatus('')
            setMessage('')
        }
        return () => mounted = false
    }, [])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Edit Dictionary Entry</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New dictionary entry</h3>
                            <Link href="/admin/dictionary" as={`/admin/dictionary`}>
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
                    <form onSubmit={ev => {
                        ev.preventDefault()
                        saveEntry()
                    }}>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="name" className="form-label">Name</label>
                            </div>
                            <div className='col-lg-6'>
                                <input type="text" className="form-control" id="name" placeholder="Name" value={newDictionary?.name} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="description" className="form-label">Description</label>
                            </div>
                            <div className='col-lg-6'>
                                <textarea className="form-control" id="description" placeholder="Description" rows="3" value={newDictionary?.description} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="code" className="form-label">Code</label>
                            </div>
                            <div className='col-lg-6'>

                                <input type="text" className="form-control" id="code" placeholder="Code" value={newDictionary?.code} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="program" className="form-label">Program</label>
                            </div>
                            <div className='col-lg-6'>
                                <select className="form-select" id="program" aria-label="Program">
                                    <option value="" disabled>Select program</option>
                                    <option value="EPT">EPT</option>
                                    <option value="HIV">HIV</option>
                                    <option value="TB">TB</option>
                                    <option value="HCT">HCT</option>
                                    <option value="PMTCT">PMTCT</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="metadata" className="form-label">Metadata</label>
                            </div>
                            <div className='col-lg-6'>

                                <textarea className="form-control" id="metadata" placeholder="Metadata" rows="3" value={newDictionary?.metadata} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="type" className="form-label">Type</label>
                            </div>
                            <div className='col-lg-6'>
                                <select className="form-select" id="type" aria-label="Type" value={valueType} onChange={ev => {
                                    setValueType(ev.target.value)
                                }}>
                                    <option value="" disabled>Select type</option>
                                    <option value="string">String</option>
                                    <option value="list_of_items">List of Values</option>
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="value" className="form-label">Value</label>
                            </div>
                            <div className='col-lg-6'>
                                <textarea className="form-control" id="value" placeholder="Value" rows="3" value={valueType && valueType == 'list_of_items' ? JSON.stringify(newDictionary?.value) : newDictionary?.value} />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Entry</button>
                    </form>
                </div >
            </div >
        </>
    )
}
export default EditDictionary