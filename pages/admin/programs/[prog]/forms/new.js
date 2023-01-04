import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../utilities'

function NewForm() {
    const router = useRouter()
    const { prog } = router.query
    const [status, setStatus] = useState('')
    const [allPrograms, setAllPrograms] = useState([])
    const [allForms, setAllForms] = useState([])
    const [allSchemas, setAllSchemas] = useState([])
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const [formTypes, setFormTypes] = useState([
        "Survey",
        "Checklist",
        "Results_entry"
    ])

    const [newFormData, setNewFormData] = useState({
        "name": "",
        "description": "",
        "type": "",
        "sections": [],
        "meta": "",
    })

    const [blankSection, setBlankSection] = useState({
        "name": "",
        "description": "",
        "fields": [],
        "meta": "",
    })

    const [blankField, setBlankField] = useState({
        "name": "",
        "description": "",
        "type": "",
        "required": false,
        "options": [],
        "validations": [],
        "meta": {
            placeholder: '',
            multiple: false
        }
    })

    const saveForm = () => {
        setLoading(true)
        getResource('form/new', { method: 'POST', body: newFormData }).then((data) => {
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
            setMessage('Error saving form: ' + err.message || err)
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
                setNewFormData({ ...newFormData, program: prog })
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
                <title>EPT | New Form</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className='container'>
                <div className="row mb-4 ">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <h3>New form</h3>
                            <Link href={`/admin/programs/${prog}/forms`}>
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
                <div className="row bg-light p-3 formed">
                    <div className='col-lg-12 my-3'>
                        {status !== 'error' && <form onSubmit={ev => {
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
                                    <input type="text" className="form-control" id="form_name" value={newFormData.name} placeholder="Enter form name" onChange={ev => {
                                        setNewFormData({ ...newFormData, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="form_desc">Description</label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8'>
                                    <textarea className="form-control" id="form_desc" value={newFormData.description} placeholder="Describe the form" onChange={ev => {
                                        setNewFormData({ ...newFormData, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                <div className='col-lg-2 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="form_type">Type
                                        <span className='text-danger'>*</span>
                                    </label>
                                    <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                </div>
                                <div className='col-lg-8 text-capitalize'>
                                    <select className='form-select' name='form_type' value={newFormData.type} onChange={ev => {
                                        setNewFormData({ ...newFormData, type: ev.target.value })
                                    }}>
                                        <option value={''}>Select form type</option>
                                        {formTypes && formTypes.map(ft => (
                                            <option key={ft} value={ft}>{ft.split('_').join(' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* --------------- form components ---------------- */}
                            <div className="row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                <div className='col-lg-12 py-1 d-flex flex-row justify-content-between mb-2'>
                                    <h5>Form sections</h5>
                                    <button type="button" class="btn btn-dark btn-sm" data-bs-toggle="modal" data-bs-target="#sectionModal" id="sectionModalTrigger">
                                        Add new section
                                    </button>
                                </div>
                                <div className='col-lg-12 py-1'>
                                    {newFormData.sections && newFormData.sections.map((section, index) => (
                                        <div className='card w-100 mb-3' key={index}>
                                            <div className="card-header">
                                                <div className="row">
                                                    <div className='col-md-8'>
                                                        <h5 className="card-title mb-0" >{section?.name}</h5>
                                                        <p className='mb-0 fst-italic'>{section?.description.split(' ').slice(0, 14).join(' ')}...</p>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='d-flex gap-3 align-items-center h-100 justify-content-end'>
                                                            <button type="button" class="btn btn-outline-dark btn-sm" data-bs-toggle="modal" data-bs-target="#addFieldModal" id="addFieldModalTrigger" onClick={e => {
                                                                setBlankField({
                                                                    ...blankField,
                                                                    sectionId: index
                                                                })
                                                            }}> Add Field </button>
                                                            <button type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#sectionModal"> Edit section </button>
                                                            <button type="button" class="btn btn-outline-danger btn-sm" data-bs-toggle="modal" data-bs-target="#sectionModal"> <i className='fa fa-trash-alt'></i> Delete </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card-body'>
                                                <div className='row'>
                                                    <div className='col-lg-12'>
                                                        <h5 className='mb-2'>Fields</h5>
                                                        <div className='row d-flex flex-column align-items-center'>
                                                            {section?.fields && section?.fields.map((field, index) => (
                                                                <div className='col-md-11 rounded border shadow-sm border-default py-2 my-3 position-relative' key={index}>
                                                                    <div className='text-muted text-capitalize position-absolute rounded bg-white px-2' style={{ top: '-14px' }}>
                                                                        <small>{field.type}</small>
                                                                    </div>
                                                                    <div className='row p-2'>
                                                                        <div className='col-xl-2'>
                                                                            <label htmlFor={'field_' + field.id} className='form-label'>{field.type != "paragraph" ? field.name : "Information"}</label>
                                                                        </div>
                                                                        <div className='col-xl-8'>
                                                                            {field.type == 'paragraph' ? (
                                                                                <>
                                                                                    <p className='form-text fs-6 px-2'>{field.description}</p>
                                                                                </>
                                                                            ) : (field.type == 'textarea' ? (
                                                                                <textarea className='form-control' id={'field_' + field.id} placeholder={field.placeholder || field.name} />
                                                                            ) : (!['select'].includes(field.type) ? <input type={field.type} className={(["checkbox", "radio"].includes(field.type) ? "form-check-input" : 'form-control') + ' '} id={'field_' + field.id} placeholder={field.placeholder || field.name} /> : (
                                                                                <select className='form-select' id={'field_' + field.id}>
                                                                                    <option value=''>Select</option>
                                                                                    {field.options.map((option, index) => (
                                                                                        <option key={index} value={option?.value || ""}>{option.name}</option>
                                                                                    ))}
                                                                                </select>
                                                                            )))
                                                                            }
                                                                        </div>
                                                                        <div className='col-xl-2 d-flex flex-wrap gap-1 align-items-center justify-content-center mt-2 justify-content-xl-end'>
                                                                            <button className='btn btn-outline-primary btn-sm' onClick={() => {} }> <i className='fa fa-pencil-alt'></i> Edit</button>
                                                                            <button className='btn btn-outline-danger btn-sm' onClick={() => {} }><i className='fa fa-trash-alt'></i> Delete</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row'>

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* ---------------- form components --------------- */}

                                {/* <div className="form-group row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-2 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="form_meta">Metadata</label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8'>
                                        <textarea className="form-control" id="form_meta" placeholder="Additional attributes" value={typeof newFormData.meta == 'object' ? JSON.stringify(newFormData.meta) : newFormData.meta} onChange={ev => {
                                            setNewFormData({ ...newFormData, meta: ev.target.value })
                                        }}></textarea>
                                    </div>
                                </div> */}

                                <div className="w-100 d-flex align-items-center justify-content-center">
                                    <button type="submit" className="btn btn-primary">Save form</button>
                                </div>
                            </div>
                        </form>}
                    </div>
                </div>
            </div>




            {/* -----------------------  <MODALS   -------------------------  */}
            {/* --------- <section modal ---------- */}
            <div class="modal fade" id="sectionModal" tabindex="-1" role="dialog" aria-labelledby="sectionModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered modal-fullscreenz" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="sectionModalTitle">New section</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                        </div>
                        <div class="modal-body">
                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="section_name">Section name
                                        <span className='text-danger'>*</span>
                                    </label>
                                </div>
                                <div className='col-lg-9'>
                                    <input type="text" className="form-control" id="section_name" value={blankSection.name} placeholder="Enter section name" onChange={ev => {
                                        setBlankSection({ ...blankSection, name: ev.target.value })
                                    }} />
                                </div>
                            </div>

                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="section_desc">Description</label>
                                </div>
                                <div className='col-lg-9'>
                                    <textarea className="form-control" id="section_desc" value={blankSection.description} placeholder="Section description" onChange={ev => {
                                        setBlankSection({ ...blankSection, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onClick={ev => {
                                    setNewFormData({ ...newFormData, sections: [...newFormData.sections, blankSection] })
                                    setBlankSection({ name: '', description: '' })
                                    document.getElementById('sectionModalTrigger').click()
                                }}>Add section</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --------- section modal/> ---------- */}



            {/* --------- <field modal ---------- */}
            <div class="modal fade" id="addFieldModal" tabindex="-1" role="dialog" aria-labelledby="addFieldModalTitle" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered modal-fullscreenz" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="addFieldModalTitle">New field</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                        </div>
                        <div class="modal-body">
                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="field_name">Field name
                                        <span className='text-danger'>*</span>
                                    </label>
                                </div>
                                <div className='col-lg-9'>
                                    <input type="text" className="form-control" id="field_name" value={blankField.name} placeholder="Enter field name" onChange={ev => {
                                        setBlankField({ ...blankField, name: ev.target.value })
                                    }} />
                                </div>
                            </div>
                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="field_name">Field type
                                        <span className='text-danger'>*</span>
                                    </label>
                                </div>
                                <div className='col-lg-9'>
                                    <select className="form-select" id="input_type" aria-label="Input type" value={blankField.type} onChange={ev => {
                                        setBlankField({ ...blankField, type: ev.target.value })
                                    }}>
                                        <option value="" disabled> Select type </option>
                                        <option value="text">Text</option>
                                        <option value="radio">Radio</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="dropdown">Dropdown</option>
                                        <option value="date">Date</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="textarea">Textarea</option>
                                    </select>
                                </div>
                            </div>

                            {blankField.type && blankField.type === 'radio' || blankField.type === 'checkbox' || blankField.type === 'dropdown' ? (
                                <div className="form-group row my-1 py-1">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="field_name">Options
                                            <span className='text-danger'>*</span>
                                        </label>
                                    </div>
                                    <div className='col-lg-9'>
                                        <input type="text" className="form-control" id="field_name" placeholder="Enter options separated by comma" value={blankField.options} onChange={ev => {
                                            setBlankField({ ...blankField, options: ev.target.value })
                                        }} />
                                    </div>
                                </div>
                            ) : null}

                            {/* multiple */}
                            {blankField.type && blankField.type === 'checkbox' || blankField.type === 'dropdown' ? (
                                <div className="form-group row my-1 py-1">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="field_name">Allow multiple selection?</label>
                                    </div>
                                    <div className='col-lg-9'>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={blankField.multiple} onChange={ev => {
                                                setBlankField({
                                                    ...blankField, meta: {
                                                        ...blankField.meta,
                                                        multiple: ev.target.checked
                                                    }
                                                })
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="field_desc">Description</label>
                                </div>
                                <div className='col-lg-9'>
                                    <textarea className="form-control" id="field_desc" value={blankField.description} placeholder="Field description" onChange={ev => {
                                        setBlankField({ ...blankField, description: ev.target.value })
                                    }}></textarea>
                                </div>
                            </div>
                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="field_placeholder">Placeholder</label>
                                </div>
                                <div className='col-lg-9'>
                                    <textarea className="form-control" id="field_placeholder" value={blankField.meta?.placeholder} placeholder="Placeholder" onChange={ev => {
                                        setBlankField({
                                            ...blankField, meta: {
                                                ...blankField.meta,
                                                placeholder: ev.target.value
                                            }
                                        })
                                    }}></textarea>
                                </div>
                            </div>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onClick={ev => {
                                    let sections = newFormData.sections
                                    let section = newFormData.sections[blankField.sectionId]

                                    section.fields = [...section.fields, blankField]
                                    sections[blankField.sectionId] = section
                                    setNewFormData({ ...newFormData, sections: sections })
                                    setBlankField({ name: '', description: '', type: 'text', options: [], required: false, validations: [], meta: { placeholder: '', multiple: false } })
                                    document.getElementById('addFieldModalTrigger').click()
                                }}>Add field</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --------- field modal/> ---------- */}



            {/* -----------------------   MODALS/>   ----------------------- */}
        </>
    )
}

export default NewForm