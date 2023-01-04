import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import ProgramsNavbar from '../../../../../components/common/ProgramsNavbar'
import { getResource } from '../../../../../utilities'
import { DndContext, useDroppable, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import BuilderSection from '../../../../../components/form/BuilderSection'

const Draggable = ({ id, children, type }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: {
            id: 'el_' + id,
            type: type == 'section' ? 'form' : 'section',
        },
    });
    // data-bs-toggle="modal" data-bs-target="#newInputModal"

    let style = {
        zIndex: 2,
    };
    style = transform ? {
        ...style,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : style;

    return <div ref={setNodeRef} {...listeners} {...attributes} className="btn btn-default bg-white d-flex flex-row align-items-center gap-2 w-100" style={style}>
        {children}
    </div>;
}

function NewForm() {
    const router = useRouter()
    const { prog } = router.query
    const [programData, setProgramData] = useState(null)

    const [status, setStatus] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(true);

    const [formComponents, setFormComponents] = useState([]) // sections, questions (text, radio, checkbox, dropdown, date, time, number, file, textarea), options (for radio, checkbox, dropdown), validations (required, min, max, min length, max length, email, phone, url, regex, file type, file size, date, time, number, range, custom)

    const [form, setForm] = useState({
        name: 'Readiness checklist',
        description: '',
        type: '',
        components: [
            {
                id: 168491,
                type: 'section',
                name: 'Section 1',
                description: '',
                components: [
                    {
                        id: 10468765,
                        type: 'paragraph',
                        name: 'Instructions',
                        description: 'Please answer the following questions to the best of your ability. If you are unsure of the answer, please leave it blank.'
                    },
                    {
                        id: 6094676,
                        type: 'text',
                        name: 'How many testing kits do you have?',
                        description: '',
                        validations: []
                    },
                    {
                        id: 29097914,
                        type: 'text',
                        name: 'What is your current testing capacity?',
                        description: '',
                        options: [
                            {
                                name: 'Less than 100 tests per day'
                            }
                        ],
                        validations: []
                    },
                    {
                        id: 57402,
                        type: 'select',
                        name: 'Is the lab ready?',
                        description: '',
                        options: [
                            {
                                name: 'Less than 100 tests per day'
                            }
                        ],
                        validations: []
                    }
                ]
            }
        ]
    })

    const [dragSection, setDragSection] = useState(false);
    const [dragQuestion, setDragQuestion] = useState(false);

    function handleDragEnd(event) {
        console.log("onDragEnd", event)
        if (event.over) {
            // if ((event.over.data.current.accepts.includes(active.data.current.type)) && (active.data.current.type === 'section')) {
            //     // add section to form, launch modal
            // } else if ((event.over.data.current.accepts.includes(active.data.current.type)) && (active.data.current.type === 'field')) {
            //     // add field to section, launch modal
            // }
        }
        setDragQuestion(false);
        setDragSection(false);
    }

    // form droppable (accepts sections only)
    const { setNodeRef: setFormNodeRef, isOver: isFormOver, over } = useDroppable({
        id: 'form',
        data: {
            type: 'form',
            accepts: ['section']
        }
    })


    const fetchProgram = (resource) => {
        getResource(resource).then((data) => {
            if (data.status === true) {
                setProgramData(data?.data)
                setStatus('')   // ('success')
                setMessage('')  // 
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

    useEffect(() => {
        let mounted = true
        if (mounted) {
            let rsc = 'program/' + prog
            fetchProgram(rsc)

            // basic form components
            setFormComponents([
                { id: 1, name: 'Section', type: 'section', icon: 'fas fa-layer-group', options: [] },
                { id: 2, name: 'Text', type: 'text', icon: 'fas fa-font', options: [] },
                { id: 3, name: 'Radio', type: 'radio', icon: 'fas fa-dot-circle', options: [] },
                { id: 4, name: 'Checkbox', type: 'checkbox', icon: 'fas fa-check-square', options: [] },
                { id: 5, name: 'Dropdown', type: 'dropdown', icon: 'fas fa-caret-square-down', options: [] },
                { id: 6, name: 'Date', type: 'date', icon: 'fas fa-calendar-alt', options: [] },
                { id: 7, name: 'Time', type: 'time', icon: 'fas fa-clock', options: [] },
                { id: 8, name: 'Number', type: 'number', icon: 'fas fa-hashtag', options: [] },
                { id: 9, name: 'File', type: 'file', icon: 'fas fa-file', options: [] },
                { id: 10, name: 'Textarea', type: 'textarea', icon: 'fas fa-text-height', options: [] },
            ])
        }
        return () => mounted = false
    }, [prog])


    if (loading) return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </main>

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={e => {
            console.log("onDragStart", JSON.stringify(e.active.data))
            if (e.active.data.current.type === 'form') {
                setDragQuestion(false)
                setDragSection(true)
            } else if (e.active.data.current.type === 'section') {
                setDragQuestion(true)
                setDragSection(false)
            }
        }} onDragCancel={e => {
            console.log("onDragCancel", JSON.stringify(e.active.data))
            setDragQuestion(false)
            setDragSection(false)
        }}>
            <Head>
                <title>EPT | New Form</title>
                <meta name="description" content="EPT" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className='container p-0'>
                {/* <div className="row">
                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
                        <div className="d-flex w-100 flex-row flex-wrap justify-content-center justify-content-lg-between align-items-center gap-lg-4">
                            <button className="btn btn-link btn-sm" onClick={() => router.back()}>&larr; Back</button>
                            <ProgramsNavbar program={programData} router={router} />
                            <Link href={`/admin/programs/${prog}/forms`}>
                                <a className="btn btn-default text-muted">&nbsp; Cancel &nbsp;</a>
                            </Link>
                        </div>
                    </div>
                </div>
                <hr /> */}
                <div className="row">
                    <div className='col-lg-2 h-100'>
                        <div className="card">
                            <div className="card-header">
                                <h5 className="card-title mb-0">Form Components</h5>
                                <p className="card-text text-muted">Drag and drop items to add to form</p>
                            </div>
                            <div className="card-body">
                                <div className="list-group list-group-flush w-100" style={{ '--bs-list-group-item-padding-x': '0.1rem', '--bs-list-group-item-padding-y': '0.2rem' }}>
                                    {formComponents.map((component, index) => (
                                        <div className="list-group-item w-100" key={index}>
                                            <div className="d-flex flex-row justify-content-between align-items-center py-1 rounded w-100" >
                                                <Draggable id={component.id} type={component.type}>
                                                    <>
                                                        <i className={component.icon}></i>
                                                        <span>{component.name}</span>
                                                    </>
                                                </Draggable>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-10'>
                        <div className="card h-100" style={{ display: 'flex', flexDirection: 'column', backgroundColor: ((dragSection) ? "azure" : "white") }} ref={setFormNodeRef}>
                            <div className="card-header">
                                {/* <h5 className="card-title mb-0">Form Preview</h5> */}
                                <h5 className="card-title mb-0" contentEditable suppressContentEditableWarning={true} onInputCapture={e => {
                                }}>{form?.name}</h5>
                            </div>
                            <div className="card-body" style={{ overflowY: 'auto' }}>
                                <div className='w-100 d-flex flex-column'>
                                    {dragSection && (
                                        <div className='w-100 d-flex flex-row justify-content-center align-items-center border border-2 rounded border-primary my-3' style={{ height: '80px', backgroundColor: 'azure', 'border-style': 'dotted' }}>
                                            <i className="bi bi-plus-circle-fill" style={{ fontSize: '50px' }}></i>
                                        </div>
                                    )}
                                    {form.components.filter(c => c.type == "section").map(section => {
                                        // drag and drop section vertically
                                        // const { attributes, listeners, setNodeRef: setSectionNodeRef, } = useDraggable({
                                        //     id: section.id,
                                        //     data: section,
                                        // });
                                        return (
                                            <BuilderSection section={section} key={section.id} />
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-primary btn">Save form</button>
                                <button className="btn btn-default btn-sm">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="newInputModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">New input</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <section className="modal-main">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <select className="form-select" id="input_type" aria-label="Input type">
                                                    <option value="" disabled> - </option>
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
                                                <label htmlFor="input_type">Input Type</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="input_name" />
                                                <label htmlFor="input_name">Input Label</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="input_placeholder" placeholder="Input Placeholder" />
                                                <label htmlFor="input_placeholder">Input Placeholder</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="input_desc" />
                                                <label htmlFor="input_desc">Input Description</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group mb-3">
                                                <input type="checkbox" className="form-check-input" id="input_required" />&nbsp;
                                                <label className="form-check-label" htmlFor="input_required">Required</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-group mb-3">
                                                <input type="checkbox" className="form-check-input" id="input_disabled" />&nbsp;
                                                <label className="form-check-label" htmlFor="input_disabled">Disabled</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <input type="text" className="form-control" id="input_default" />
                                                <label htmlFor="input_default">Default value</label>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="form-floating mb-3">
                                                <select className="form-select" id="input_validation" aria-label="Input validation">
                                                    <option value="none">None</option>
                                                </select>
                                                <label htmlFor="input_validation">Input validation</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </DndContext>
    )
}

export default NewForm