import Head from 'next/head'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { getResource } from '../../../../../utilities'

function NewForm() {
    const router = useRouter()
    const { prog } = router.query
    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);
    const [formTypes, setFormTypes] = useState([
        "survey",
        "checklist",
        "results"
    ])

    const [newFormData, setNewFormData] = useState({
        "name": "",
        "description": "",
        "target_type": "",
        "sections": [],
        "meta": {},
    })

    const [blankSection, setBlankSection] = useState({
        "name": "",
        "description": "",
        "fields": [],
        "meta": {},
    })
    const [blankOption, setBlankOption] = useState({
        "name": "",
        "value": "",
    })

    const [blankField, setBlankField] = useState({
        "name": "",
        "description": "",
        "type": "",
        "options": [],
        "validations": [],
        "meta": {
            "required": false,
            "placeholder": '',
            "multiple": false
        }
    })

    const saveForm = () => {
        setLoading(true)
        getResource('form/new', { method: 'POST', body: newFormData }).then((data) => {
            if (data.status === true) {
                setStatus('success')
                setMessage(data.message)
                setBlankField({
                    "name": "",
                    "description": "",
                    "type": "",
                    "options": [],
                    "validation": [],
                    "meta": {
                        "required": false,
                        "placeholder": '',
                        "multiple": false
                    }
                })
                setBlankSection({
                    "name": "",
                    "description": "",
                    "fields": [],
                    "meta": {},
                })
                setNewFormData({
                    "name": "",
                    "description": "",
                    "target_type": "",
                    "sections": [],
                    "meta": {},
                })
            } else {
                setStatus('error')
                setMessage(data.message)
            }
            setLoading(false)
            window.scrollTo(0, 0)
        }).catch((err) => {
            console.log(err)
            setStatus('error')
            setMessage('Error saving form: ' + err.message || err)
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
            if (prog) {
                setNewFormData({ ...newFormData, program: prog })
                fetchSchemas(prog)
                fetchForms(prog)
            }
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
                                        <label className='form-label' htmlFor="target_type">Type
                                            <span className='text-danger'>*</span>
                                        </label>
                                        <small className='d-block text-muted lh-sm my-0'>&nbsp;</small>
                                    </div>
                                    <div className='col-lg-8' id="form_type_container">
                                        <select className='form-select mb-1 text-capitalize' style={{ textTransform: 'capitalize' }} name='target_type' value={newFormData.target_type} onChange={ev => {

                                            // TODO: if target_type is 'results' then:
                                            // 1. set target_type to 'results'
                                            // 2. create a new section for results
                                            // 3. in the new section, add a 'paragraph' field with the following text:
                                            // "The questions set in this section will be posed for each sample"
                                            // DONE

                                            if (ev.target.value === 'results') {
                                                setNewFormData({
                                                    ...newFormData, target_type: ev.target.value, sections: [
                                                        ...newFormData.sections,
                                                        {
                                                            name: 'Results',
                                                            description: 'The questions set in this section will be posed for each sample',
                                                            fields: [

                                                            ],
                                                            meta: {
                                                                'isResultSection': true
                                                            }
                                                        }
                                                    ]
                                                });
                                            } else {
                                                if (newFormData.sections.filter(s => s.meta?.isResultSection).length > 0) {
                                                    setNewFormData({ ...newFormData, target_type: ev.target.value, sections: newFormData.sections.filter(s => !s.meta?.isResultSection) });
                                                } else {
                                                    setNewFormData({ ...newFormData, target_type: ev.target.value });
                                                }
                                            }


                                        }}>
                                            <option value={''}>Select form type</option>
                                            {formTypes && formTypes.map(ft => (
                                                <option key={ft} value={ft}>
                                                    {ft.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* --------------- form components ---------------- */}
                                <div className="row my-1 my-lg-3 py-2" style={{ borderBottom: '1px solid #ececec' }}>
                                    <div className='col-lg-12 py-1 d-flex flex-row justify-content-between mb-2'>
                                        <h5>Form sections</h5>
                                        <button type="button" className="hidden" style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#sectionModal" id="sectionModalTrigger"></button>
                                        <button type="button" className="btn btn-dark btn-sm" onClick={e => {
                                            e.preventDefault();
                                            setBlankSection({
                                                "name": "",
                                                "description": "",
                                                "fields": [],
                                                "meta": ""
                                            })
                                            document.getElementById('sectionModalTrigger').click();
                                        }}>
                                            Add new section
                                        </button>
                                    </div>
                                    <div className='col-lg-12 py-1'>
                                        {newFormData.sections && newFormData.sections.filter(s => {
                                            // filter out the deleted sections
                                            return !s.deleted
                                        }).map((section, index) => (
                                            <div className='card w-100 mb-3' key={index}>
                                                <div className="card-header">
                                                    <div className="row">
                                                        <div className='col-md-8'>
                                                            <h5 className="card-title mb-0" >{section?.name}</h5>
                                                            <p className='mb-0 fst-italic'>{section?.description.split(' ').slice(0, 14).join(' ')}{section.description.split(' ').length > 13 && "..."}</p>
                                                        </div>
                                                        <div className='col-md-4'>
                                                            <div className='d-flex gap-3 align-items-center h-100 justify-content-end'>
                                                                <button type="button" className="hidden" style={{ display: 'none' }} data-bs-toggle="modal" data-bs-target="#addFieldModal" id="addFieldModalTrigger"></button>
                                                                <button type="button" className="btn btn-dark btn-sm" onClick={e => {
                                                                    e.preventDefault()
                                                                    setBlankField({
                                                                        "name": "",
                                                                        "description": "",
                                                                        "type": "",
                                                                        "options": [],
                                                                        "validations": [],
                                                                        "meta": {
                                                                            "required": false,
                                                                            "placeholder": "",
                                                                            "multiple": false,
                                                                        },
                                                                        "section_id": section.id,
                                                                    })
                                                                    document.getElementById('addFieldModalTrigger').click()
                                                                }}> Add Field </button>
                                                                <button type="button" className="btn btn-outline-dark btn-sm"
                                                                    onClick={e => {
                                                                        setBlankSection({
                                                                            ...section,
                                                                            edit: true,
                                                                        })
                                                                        document.getElementById('sectionModalTrigger').click()
                                                                    }}
                                                                > <i className='fa fa-pencil-alt'></i> Edit section </button>
                                                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={e => {
                                                                    e.preventDefault();
                                                                    if (section?.uuid) {
                                                                        // delete section from database: add delete flag
                                                                        section.delete = true
                                                                    }
                                                                    window.confirm('Are you sure you want to delete this section?') && setNewFormData({
                                                                        ...newFormData,
                                                                        sections: newFormData.sections.filter((sc, i) => sc.id !== section.id)
                                                                    })
                                                                }}> <i className='fa fa-trash-alt'></i> Delete </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='card-body'>
                                                    <div className='row'>
                                                        <div className='col-lg-12'>
                                                            <h5 className='mb-2'>Fields</h5>
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
                                                                                    <textarea className='form-control' id={'field_' + field.id} placeholder={field.meta?.placeholder || field.name} />
                                                                                ) : field.type == 'select' ? (
                                                                                    // TODO: support multiple select properly (e.g. react-select)
                                                                                    <select className='form-select' id={'field_' + field.id} multiple={field.meta?.multiple || false}>
                                                                                        <option value=''>Select</option>
                                                                                        {field.options.map((option, index) => (
                                                                                            <option key={index} value={option?.value || option || ""}>{option.name}</option>
                                                                                        ))}
                                                                                    </select>
                                                                                ) : (["checkbox", "radio"].includes(field.type) ? <div className='d-flex gap-3 flex-wrap'>
                                                                                    {field.options && field.options.map(opt => (
                                                                                        <div className='form-check' key={opt.id}>
                                                                                            <input type={field.type} className={(["checkbox", "radio"].includes(field.type) ? "form-check-input" : 'form-control') + ' '} id={'field_' + field.id} placeholder={field.meta?.placeholder || field.name} />
                                                                                            <label className='form-check-label' htmlFor={'field_' + field.id}>{opt.name}</label>
                                                                                        </div>
                                                                                    ))}
                                                                                </div> : (
                                                                                    <input type={field.type} className='form-control' id={'field_' + field.id} placeholder={field.meta?.placeholder || field.name} />
                                                                                ))
                                                                                )
                                                                                }
                                                                            </div>
                                                                            <div className='col-xl-2 d-flex flex-wrap gap-1 align-items-center justify-content-center mt-2 justify-content-xl-end'>
                                                                                <button className='btn btn-outline-dark btn-sm' onClick={e => {
                                                                                    e.preventDefault();
                                                                                    setBlankField({ ...field, edit: true })
                                                                                    document.getElementById('addFieldModalTrigger').click()
                                                                                }}> <i className='fa fa-pencil-alt'></i> Edit</button>
                                                                                <button className='btn btn-outline-danger btn-sm' onClick={e => {
                                                                                    e.preventDefault();
                                                                                    if (field?.uuid) {
                                                                                        field.delete = true;
                                                                                    }
                                                                                    if (window.confirm('Are you sure you want to delete this field?')) {
                                                                                        const updatedFormData = { ...newFormData };
                                                                                        const currentSection = section
                                                                                        const currentSectionIndex = updatedFormData.sections.findIndex((section) => section.id === currentSection.id);
                                                                                        const currentSectionFields = currentSection.fields
                                                                                        const newSectionFields = currentSectionFields.filter((currentField) => currentField.id !== field.id)
                                                                                        currentSection.fields = newSectionFields;
                                                                                        updatedFormData.sections[currentSectionIndex] = currentSection;
                                                                                        setNewFormData(updatedFormData);
                                                                                    }
                                                                                }}><i className='fa fa-trash-alt'></i> Delete</button>
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
                                        <button type="submit" className="btn btn-primary" onClick={e => {
                                            e.preventDefault();
                                            saveForm()
                                        }}>Save form</button>

                                        {window && window?.location?.hostname == "localhost" && <button className="btn btn-link text-muted mx-3 btn-sm" onClick={e => {
                                            e.preventDefault();
                                            alert(JSON.stringify(newFormData, null, 4))
                                        }}>Preview</button>}
                                    </div>
                                </div>
                            </form>}
                    </div>
                </div>
            </div>








            {/* -----------------------  <MODALS   -------------------------  */}
            {/* --------- <section modal ---------- */}
            <div className="modal fade" id="sectionModal" tabIndex="-1" role="dialog" aria-labelledby="sectionModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered modal-fullscreenz" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="sectionModalTitle">{blankSection?.edit ? "Edit" : "New"} section</h5>
                            <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close" data-bs-target="#sectionModal"></button>

                        </div>
                        <div className="modal-body">
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

                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={e => {
                                    setBlankSection({ name: '', description: '' });
                                }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={ev => {
                                    if (!blankSection?.edit) {
                                        blankSection.id = Math.random().toString(36).substr(2, 9);
                                        setNewFormData({ ...newFormData, sections: [...newFormData.sections, blankSection] })
                                        setBlankSection({ name: '', description: '', meta: {} })
                                    } else {
                                        // update section
                                        let sections = newFormData.sections;
                                        sections[sections.findIndex(sec => sec.id === blankSection.id)] = blankSection;
                                        setNewFormData({ ...newFormData, sections: sections })
                                        setBlankSection({ name: '', description: '', meta: {} })
                                    }
                                    document.getElementById('sectionModalTrigger').click()
                                }} disabled={
                                    !blankSection.name || blankSection.name.length < 1
                                }>{blankSection?.edit ? "Update" : "Save"} section</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* --------- section modal/> ---------- */}



            {/* --------- <field modal ---------- */}
            <div className="modal fade" id="addFieldModal" tabIndex="-1" role="dialog" aria-labelledby="addFieldModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered modal-fullscreenz" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addFieldModalTitle">{blankField?.edit ? "Edit" : "New"} field</h5>
                            <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close" data-bs-target="#addFieldModal"></button>

                        </div>
                        <div className="modal-body">
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
                                        // disable multiple select for non-select fields
                                        if (ev.target.value !== 'select') {
                                            setBlankField({ ...blankField, type: ev.target.value, meta: { ...blankField.meta, multiple: false } })
                                        }
                                    }}>
                                        <option value="" disabled> Select type </option>
                                        <option value="text">Text</option>
                                        <option value="radio">Radio</option>
                                        {/* <option value="checkbox">Checkbox</option> */} {/*TODO: show one input here, despite the options. Values are always true/false */}
                                        <option value="select">Select/Dropdown</option>
                                        <option value="date">Date</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="phone">Phone</option>
                                        <option value="textarea">Textarea</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row my-1 py-1">
                                <div className='col-lg-3 py-1 d-flex flex-column'>
                                    <label className='form-label' htmlFor="field_name">Is it required?</label>
                                </div>
                                <div className='col-lg-9'>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="blankFieldRequiredBool" checked={blankField.meta?.required} onChange={ev => {
                                            setBlankField({
                                                ...blankField, meta: {
                                                    ...blankField.meta,
                                                    required: ev.target.checked
                                                }
                                            })
                                        }} />
                                    </div>
                                </div>
                            </div>

                            {blankField.type && blankField.type === 'radio' || blankField.type === 'checkbox' || blankField.type === 'select' ? (
                                <div className="form-group row my-1 py-1">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="field_name">Options
                                            <span className='text-danger'>*</span>
                                        </label>
                                    </div>
                                    <div className='col-lg-9'>
                                        <div className="row">
                                            <div className="col-md-12 d-flex flex-wrap">
                                                {(blankField && blankField?.options && blankField?.options.length > 0) ? blankField?.options
                                                    .slice(0, 7)
                                                    .map((opt, index) => (
                                                        <span key={index} className='badge bg-success me-2 mb-2'>
                                                            <span onClick={ev => {
                                                                if (opt && opt?.id) {
                                                                    setBlankOption(opt)
                                                                    document.getElementById('addOptModalTrigger').click()
                                                                }
                                                            }}>{opt.name}</span> &nbsp; <i className='fa fa-times' onClick={ev => {
                                                                setBlankField({
                                                                    ...blankField,
                                                                    options: blankField.options.filter((o, i) => i !== index)
                                                                })
                                                            }}></i>
                                                        </span>
                                                    )) : <i className='text-muted fs-6'>No options added</i>}
                                                &nbsp;
                                                {(blankField && blankField?.options && blankField?.options.length > 7) && <button type="button" className="btn btn-link p-0" style={{ fontSize: '0.89em' }} data-bs-toggle="modal" data-bs-target="#viewalloptsmodal" id="viewAllOptModalTrigger">View all</button>}
                                            </div>
                                            <div className="col-md-12">
                                                {(blankField && blankField?.options && blankField?.options.length > 7) && <>
                                                    <div className="modal fade" id="viewalloptsmodal" tabIndex="-1" role="dialog" aria-labelledby="viewalloptsmdltitle" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                                                        <div className="modal-dialog modal-md modal-dialog-scrollable" role="document">
                                                            <div className="modal-content" style={{ backgroundColor: '#f6f7ff' }}>
                                                                <div className="modal-header">
                                                                    <h5 className="modal-title" id="viewalloptsmdltitle">All options ({blankField?.options.length})</h5>
                                                                    <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close" data-bs-target="#viewalloptsmodal"></button>
                                                                </div>
                                                                <div className="modal-body">
                                                                    <div className="row">
                                                                        <table className='table table-striped table-hover table-sm'>
                                                                            <thead>
                                                                                <tr>
                                                                                    <th className='text-center'>Option</th>
                                                                                    <th className='text-center'>Value</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {blankField?.options && blankField?.options.length > 0 ? blankField?.options.map((opt, i) => <tr key={opt.id}>
                                                                                    <td className='text-center'>
                                                                                        <button className='btn btn-link' onClick={e => {
                                                                                            e.preventDefault();
                                                                                            if (opt && opt?.id) {
                                                                                                setBlankOption(opt)
                                                                                                document.getElementById('addOptModalTrigger').click()
                                                                                            }
                                                                                        }}>{opt.name}</button>
                                                                                    </td>
                                                                                    <td className='text-center'>{opt.value}</td>
                                                                                </tr>) : <tr><td colSpan={2}>No options</td></tr>}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>}
                                            </div>
                                            <div className="col-md-12">
                                                {/* TODO: switch to modal - DONE */}
                                                <button type="button" className="btn btn-link" data-bs-toggle="modal" data-bs-target="#addoptionmdl" id="addOptModalTrigger">
                                                    <i className='fa fa-plus'></i> Add
                                                </button>
                                                <div className="modal fade" id="addoptionmdl" tabIndex="-1" role="dialog" aria-labelledby="addoptionmdltitle" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
                                                    <div className="modal-dialog" role="document">
                                                        <div className="modal-content" style={{ backgroundColor: 'azure' }}>
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="addoptionmdltitle">{blankOption?.id ? "Update" : "Add"} option</h5>
                                                                <button type="button" className="btn-close" data-bs-toggle="modal" aria-label="Close" data-bs-target="#addoptionmdl"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <div className="row">
                                                                    <div className="col-md-12 form-group">
                                                                        <label htmlFor="field_name">Option Name <span className='text-danger'>*</span></label>
                                                                        <input type="text" className="form-control" id="field_name" placeholder="Option name" value={blankOption?.name} onChange={ev => {
                                                                            let newOpt = {
                                                                                ...blankOption
                                                                            }
                                                                            newOpt.name = ev.target.value
                                                                            // if (!newOpt?.value || newOpt?.value === '') {
                                                                            //     newOpt.value = ev.target.value.trim().toLocaleLowerCase()//.replace(/ /g, '_')
                                                                            // }
                                                                            setBlankOption({ ...newOpt })
                                                                        }} />
                                                                    </div>
                                                                    <div className="col-md-12 form-group">
                                                                        <label htmlFor="field_name">Option Value</label>
                                                                        <input type="text" className="form-control" id="field_name" placeholder="Option value" value={blankOption?.value} onChange={ev => {
                                                                            setBlankOption({ ...blankOption, value: ev.target.value })
                                                                        }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-link text-muted" data-bs-toggle="modal" data-bs-target="#addoptionmdl" onClick={e => {
                                                                    setBlankOption({ name: '', value: '' })
                                                                }}>Cancel</button>
                                                                <button type="button" className="btn btn-primary" onClick={e => {
                                                                    e.preventDefault();
                                                                    let newOpt = {
                                                                        ...blankOption
                                                                    }
                                                                    let curr_options = blankField.options || []
                                                                    if (newOpt?.id && curr_options.findIndex(opt => opt.id === newOpt.id) !== -1) {
                                                                        // existing option
                                                                        curr_options[curr_options.findIndex(opt => opt.id === newOpt.id)] = newOpt
                                                                        setBlankOption({ name: '', value: '' })
                                                                    } else {
                                                                        // new option
                                                                        newOpt.id = Math.random().toString(36).substr(2, 9)
                                                                        if (!newOpt.value || newOpt.value == '') {
                                                                            newOpt.value = newOpt.name.trim().toLocaleLowerCase()//.replace(/ /g, '_') 
                                                                        }
                                                                        if (curr_options.findIndex(opt => opt.value === newOpt.value) === -1) {
                                                                            curr_options.push(newOpt)
                                                                            setBlankOption({ name: '', value: '' })
                                                                        } else {
                                                                            // alert('A similar option already exists')
                                                                        }
                                                                    }
                                                                    if (!['select', 'radio', 'checkbox'].includes(blankField.type)) {
                                                                        curr_options = []
                                                                    }
                                                                    setBlankField({ ...blankField, options: curr_options })
                                                                    document.getElementById('addOptModalTrigger').click()
                                                                }}
                                                                // disabled={!blankOption || !blankOption?.name}
                                                                >{blankOption?.id ? "Update" : "Add"}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {/* multiple */}
                            {blankField.type && blankField.type === 'select' ? (
                                <div className="form-group row my-1 py-1">
                                    <div className='col-lg-3 py-1 d-flex flex-column'>
                                        <label className='form-label' htmlFor="field_name">Allow multiple selection?</label>
                                    </div>
                                    <div className='col-lg-9'>
                                        <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="blankFieldMultipleBool" checked={blankField.multiple} onChange={ev => {
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

                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={e => {
                                    e.preventDefault()
                                    setBlankField({
                                        "name": "",
                                        "description": "",
                                        "type": "",
                                        "options": [],
                                        "validations": [],
                                        "meta": {
                                            "required": false,
                                            "placeholder": '',
                                            "multiple": false
                                        }
                                    })
                                }}>Cancel</button>
                                <button type="button" className="btn btn-primary" onClick={ev => {
                                    ev.preventDefault()
                                    if (!blankField?.edit) {
                                        blankField.id = Math.random().toString(36).substr(2, 9)
                                        if (blankField.type === 'select' || blankField.type === 'radio' || blankField.type === 'checkbox') {
                                            let options = blankField.options
                                        }
                                        let sections = newFormData.sections
                                        let section = newFormData.sections.find(section => section.id === blankField.section_id)
                                        let section_index = newFormData.sections.findIndex(section => section.id === blankField.section_id)
                                        // sample fields
                                        if (section.meta?.isResultSection === true) {
                                            blankField.meta = {
                                                ...blankField.meta,
                                                isResultField: true
                                            }
                                        }
                                        section.fields = [...section.fields || [], blankField]
                                        sections[section_index] = section
                                        setNewFormData({ ...newFormData, sections: sections })
                                        setBlankField({
                                            name: '',
                                            description: '',
                                            type: '',
                                            options: [],
                                            validations: [],
                                            meta: {
                                                required: false,
                                                placeholder: '',
                                                multiple: false
                                            }
                                        })
                                    } else {
                                        let sections = newFormData.sections
                                        let section = sections.find(section => section.id === blankField.section_id)
                                        let section_index = sections.findIndex(section => section.id === blankField.section_id)
                                        let fields = section.fields
                                        let old_field_index = section.fields.findIndex(field => field.id === blankField.id)
                                        // remove edit flag
                                        delete blankField.edit
                                        // sample fields
                                        if (section.meta?.isResultSection === true) {
                                            blankField.meta = {
                                                ...blankField.meta,
                                                isResultField: true
                                            }
                                        }
                                        fields[old_field_index] = blankField
                                        section.fields = fields
                                        sections[section_index] = section
                                        setNewFormData({ ...newFormData, sections: sections })
                                        setBlankField({
                                            name: '',
                                            description: '',
                                            type: '',
                                            options: [],
                                            validations: [],
                                            meta: {
                                                required: false,
                                                placeholder: '',
                                                multiple: false
                                            }
                                        })
                                    }
                                    document.getElementById('addFieldModalTrigger').click()
                                }} disabled={
                                    blankField.name === '' || blankField.type === '' || blankField.name === null || blankField.type === null || blankField.name === undefined || blankField.type === undefined
                                }>{blankField?.edit ? "Update" : "Save"} field</button>
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