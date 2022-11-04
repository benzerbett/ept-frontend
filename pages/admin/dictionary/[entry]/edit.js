import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../utilities'

function EditDictionary() {
    const router = useRouter()
    const { entry } = router.query

    const [dictionaryData, setDictionaryData] = useState(null)

    const [valueType, setValueType] = useState('')

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchDictionary = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setDictionaryData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Dictionary fetched successfully')

                // set value type based on current value type
                let vt = data?.data?.value
                if (typeof vt === 'string') setValueType('string')
                else if (typeof vt === 'object') setValueType('list_of_items')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching dictionary: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'dictionary/' + entry
            fetchDictionary(rsc)
        }
        return () => mounted = false
    }, [entry])


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
                            <h3>Edit dictionary entry</h3>
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
                    <form className="col-lg-12">
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="name" className="form-label">Name</label>
                            </div>
                            <div className='col-lg-6'>
                                <input type="text" className="form-control" id="name" placeholder="Name" value={dictionaryData?.name} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="description" className="form-label">Description</label>
                            </div>
                            <div className='col-lg-6'>
                                <textarea className="form-control" id="description" placeholder="Description" rows="3" value={dictionaryData?.description} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="code" className="form-label">Code</label>
                            </div>
                            <div className='col-lg-6'>

                                <input type="text" className="form-control" id="code" placeholder="Code" value={dictionaryData?.code} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="program" className="form-label">Program</label>
                            </div>
                            <div className='col-lg-6'>
                                <select className="form-select" id="program" aria-label="Program">
                                    <option value="" selected disabled>Select program</option>
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

                                <textarea className="form-control" id="metadata" placeholder="Metadata" rows="3" value={dictionaryData?.meta} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-lg-3'>
                                <label htmlFor="type" className="form-label">Type</label>
                            </div>
                            <div className='col-lg-6'>
                                <select className="form-select" id="type" aria-label="Type" value={valueType} onChange={ev=>{
                                    setValueType(ev.target.value)
                                }}>
                                    <option value="" selected disabled>Select type</option>
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
                                {valueType && valueType == 'list_of_items' ? <textarea className="form-control" id="value" placeholder="Value" rows="3" value={JSON.stringify(dictionaryData?.value)} /> : <input type="text" className="form-control" id="value" placeholder="Value" value={JSON.stringify(dictionaryData?.value)} />}
                            </div>
                        </div>
                        <div className='w-100 d-flex align-items-center justify-content-center'>
                            <button type="submit" className="btn btn-primary">Update Entry</button>
                        </div>
                    </form>
                </div >
            </div >
        </>
    )
}
export default EditDictionary