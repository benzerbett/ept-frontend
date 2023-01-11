import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { getResource } from '../../../../../../utilities'

function ViewForm() {
    const router = useRouter()
    const { prog, form } = router.query


    const [formData, setFormData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const fetchForm = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setFormData(data?.data)

                setStatus('')   // ('success')
                setMessage('')  // ('Forms fetched successfully')
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error fetching forms: ' + err.message || err)
            setLoading(false)
        })
    }

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'form/' + form
            fetchForm(rsc)
        }
        return () => mounted = false
    }, [form])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>


    return (
        <>
            <Head>
                <title>EPT | Form Preview</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
                <meta charSet="utf-8" />
            </Head>
            <div className="container">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                    <div className="d-flex flex-column flex-lg-row flex-grow justify-content-between align-items-center gap-4">
                        <button className="btn btn-link" onClick={() => router.back()}>&larr; Back</button>
                        <h2 className="font-bold my-4">Form preview</h2>
                    </div>
                    <Link href="/admin/programs/[prog]/forms/[form]/edit" as={`/admin/programs/${prog}/forms/${form}/edit`}>
                        <a className="btn btn-primary btn-sm">
                            <i className='fa fa-pencil'></i> &nbsp;
                            Edit Form
                        </a>
                    </Link>
                </div>
                <hr />
                {/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */}
                <div className="row bg-light p-3 formed">
                    <div className='col-lg-12 my-3'>
                        {
                            true// status !== 'error' 
                            && <form onSubmit={ev => {
                                ev.preventDefault()
                                saveForm()
                            }}>
                                <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-2 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="form_name">Name
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8'>
                                        <input type="text" className="form-control" id="form_name" value={formData.name} placeholder="Enter form name" disabled />
                                    </div>
                                </div>
                                <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-2 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="form_desc">Description</label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8'>
                                        <textarea className="form-control" id="form_desc" value={formData.description} placeholder="Describe the form" disabled></textarea>
                                    </div>
                                </div>
                                <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-2 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="target_type">Type
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8' id="form_type_container">
                                        <input type="text" className="form-control" id="target_type" value={formData.target_type} placeholder="Enter form name" disabled />
                                    </div>
                                </div>

                                {/* --------------- form components ---------------- */}
                                <div className="row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-12 py-1 d-flex flex-row justify-content-between mb-2'>
                                        <h5><b>Form sections</b></h5>
                                    </div>
                                    <div className='col-lg-12 py-1'>
                                        {formData.sections && formData.sections.filter(s => {
                                            // filter out the deleted sections
                                            return !s.delete
                                        }).map((section, index) => (
                                            <div className='card w-100 mb-3' key={index}>
                                                <div className="card-header">
                                                    <div className="row">
                                                        <div className='col-md-8'>
                                                            <h5 className="card-title mb-0" >{section?.name}</h5>
                                                            <p className='mb-0 fst-italic'>{section?.description.split(' ').slice(0, 14).join(' ')}{section.description.split(' ').length > 13 && "..."}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-lg-12'>
                                                            <div className='row d-flex flex-column align-items-center'>
                                                                {section?.fields && section?.fields.filter(f => {
                                                                    // filter out deleted fields
                                                                    return !f.delete
                                                                }).map((field, index) => (
                                                                    <div className='col-md-11 rounded border shadow-sm border-default py-2 my-3 position-relative' key={index}>
                                                                        <div className='text-muted text-capitalize position-absolute rounded bg-white px-2' style={{ top: '-14px' }}>
                                                                            <small>{field.type}</small>
                                                                        </div>
                                                                        <div className='row p-2'>
                                                                            <div className='col-xl-4 d-flex flex-column'>
                                                                                <label htmlFor={'field_' + field.id} className='form-label mb-0'>{field.type != "paragraph" ? field.name : "Information"} {field.meta?.required && <span className='text-danger'>*</span>}</label>
                                                                                {field.meta?.required && <small className='fst-italic text-muted'>Required</small>}
                                                                            </div>
                                                                            <div className='col-xl-6'>
                                                                                {field.type == 'paragraph' ? (
                                                                                    <>
                                                                                        <p className='form-text fs-6 px-2'>{field.description}</p>
                                                                                    </>
                                                                                ) : (field.type == 'textarea' ? (
                                                                                    <textarea className='form-control' id={'field_' + field.id} placeholder={field.meta?.placeholder} disabled />
                                                                                ) : field.type == 'select' ? (
                                                                                    <select className='form-select' id={'field_' + field.id} multiple={field.meta?.multiple || false} disabled>
                                                                                        <option value=''>Select</option>
                                                                                        {field.options.map((option, index) => (
                                                                                            <option key={index} value={option?.value || option || ""}>{option.name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                ) : (field.type == "radio" ? <div className='d-flex gap-3 flex-wrap'>
                                                                                    {field.options && field.options.map(opt => (
                                                                                        <div className='form-check' key={opt.id}>
                                                                                            <input type={field.type} className="form-check-input" id={'field_' + field.id} placeholder={field.meta?.placeholder || field.name} disabled />
                                                                                            <label className='form-check-label' htmlFor={'field_' + field.id}>{opt.name}</label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div> : (
                                                                                    field.type == "checkbox" ? <div className='form-check'><input type={field.type} className='form-check-input' id={'field_' + field.id} disabled />
                                                                                        {/* <label className='form-check-label' htmlFor={'field_' + field.id}>{field.name}</label> */}
                                                                                    </div>
                                                                                        : <input type={field.type} className='form-control' id={'field_' + field.id} placeholder={field.meta?.placeholder || field.name} disabled />
                                                                                ))
                                                                                )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* ---------------- form components --------------- */}

                                    <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                        <div className='col-lg-2 py-1 d-flex flex-column'>
                                            <label className='form-label' htmlFor="form_meta">Metadata</label>
                                            <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                        </div>
                                        <div className='col-lg-8'>
                                            <textarea className="form-control" id="form_meta" placeholder="Additional attributes" value={
                                                typeof formData.meta == 'object' ? JSON.stringify(formData.meta).replace(/,/g, ', ').split('{').join('\n ').split('}').join('\n').split('[').join('\n ').split(']').join('\n').split('"').join('')
                                                    : formData.meta} disabled></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>}
                    </div>
                </div>
                {/* /\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\ */}
            </div>
        </>
    )
}

export default ViewForm