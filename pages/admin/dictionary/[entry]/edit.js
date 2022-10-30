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
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Edit Dictionary Entry</h2>
                    </div>
                </div>
                <hr />
                <div className="row">
                    {/* form to capture the following fields:
                        - name (text)
                        - description (textarea)
                        - code (text)
                        - program (select)
                        - metadata (textarea)
                        - type (select: string / list_of_items)
                        - value (list_of_items) (textarea) (key:value pairs)
                        - value (string) (text)
                    */}
                    <form className="col-md-12">
                        <div className="mb-3 form-group row">
                            <div className='col-md-3'>
                                <label htmlFor="name" className="form-label">Name</label>
                            </div>
                            <div className='col-md-6'>
                                <input type="text" className="form-control" id="name" placeholder="Name" value={dictionaryData?.name} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-md-3'>
                                <label htmlFor="description" className="form-label">Description</label>
                            </div>
                            <div className='col-md-6'>
                                <textarea className="form-control" id="description" placeholder="Description" rows="3" value={dictionaryData?.description} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-md-3'>
                                <label htmlFor="code" className="form-label">Code</label>
                            </div>
                            <div className='col-md-6'>

                                <input type="text" className="form-control" id="code" placeholder="Code" value={dictionaryData?.code} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-md-3'>
                                <label htmlFor="program" className="form-label">Program</label>
                            </div>
                            <div className='col-md-6'>
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
                            <div className='col-md-3'>
                                <label htmlFor="metadata" className="form-label">Metadata</label>
                            </div>
                            <div className='col-md-6'>

                                <textarea className="form-control" id="metadata" placeholder="Metadata" rows="3" value={dictionaryData?.metadata} />
                            </div>
                        </div>
                        <div className="mb-3 form-group row">
                            <div className='col-md-3'>
                                <label htmlFor="type" className="form-label">Type</label>
                            </div>
                            <div className='col-md-6'>
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
                            <div className='col-md-3'>
                                <label htmlFor="value" className="form-label">Value</label>
                            </div>
                            <div className='col-md-6'>
                                {valueType && valueType == 'list_of_items' ? <textarea className="form-control" id="value" placeholder="Value" rows="3" value={JSON.stringify(dictionaryData?.value)} /> : <input type="text" className="form-control" id="value" placeholder="Value" value={JSON.stringify(dictionaryData?.value)} />}
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Update Entry</button>
                    </form>
                </div >
            </div >
        </>
    )
}
export default EditDictionary