import { useDroppable } from '@dnd-kit/core'
import React from 'react'

function BuilderSection({section}) {

    const { setNodeRef: setSectionNodeRef, isOver: isSectionOver, over } = useDroppable({
        id: 'section_'+section.id,
        data: {
            type: 'section',
            id: section.id,
            accepts: ['field']
        }
    })

    return (
        <div className='card' data-type='section' data-id={section.id} key={section.id}
            ref={setSectionNodeRef} 
            // {...attributes} {...listeners} 
            style={{ 
                // cursor: dragSection ? "not-allowed" : "initial", 
            backgroundColor: (isSectionOver) ? "aliceblue" : "white" }}
        >
            <div className='card-header d-flex'>
                <h6 className='card-title w-100 mb-0 d-flex align-items-center' contentEditable suppressContentEditableWarning={true} onInput={e => {
                    setForm({
                        ...form,
                        components: form.components.map(c => {
                            if (c.id == section.id) {
                                c.name = e.target.innerText
                            }
                            return c
                        })
                    })
                }}>{section.name}</h6>
                <div className='d-flex flex-row align-items-end'>
                    <button className='btn text-muted btn-xs fs-6 py-1 px-3' title="Drag">
                        <span className=''>&#8645;</span>
                    </button>
                    <button className='btn text-muted btn-xs fs-6 py-1 px-3' title="Edit">
                        <i className='fa fa-pencil'></i>
                    </button>
                    <button className='btn text-danger btn-xs fs-6 py-1 px-3' title="Delete">
                        <i className='fa fa-trash-alt'></i>
                    </button>
                </div>
            </div>
            <div className='card-body px-2'>
                <div className='row justify-content-center' >
                    {section.components.map(field => (
                        <div className='col-md-10 rounded border shadow-sm border-default py-2 mb-3 position-relative' key={field.id}>
                            <div className='text-muted text-capitalize position-absolute rounded-sm bg-white' style={{ top: '-14px' }}>
                                <small>{field.type}</small>
                            </div>
                            <div className='d-flex align-items-center py-1'>
                                <div className='d-flex flex-row align-items-center gap-2 w-100 mb-2'>
                                    {/* <span className=' py-1 px-2'>Name: </span> */}
                                    <label className='form-label w-100 border rounded py-1 px-2 fst-italic mb-0' style={{ backgroundColor: '#f8f8f8' }} contentEditable suppressContentEditableWarning={true} onInput={e => {
                                        setForm(form => {
                                            form.sections = form.sections.map(c => {
                                                if (c.id == section.id) {
                                                    c.components = c.components.map(f => {
                                                        if (f.id == field.id) {
                                                            f.name = e.target.innerText
                                                        }
                                                        return f
                                                    })
                                                }
                                                return c
                                            })
                                            return form
                                        })
                                    }}>{field.name}</label>
                                </div>
                                <div className='d-flex flex-row align-items-center mx-1'>
                                    <button type='button' className='btn text-muted btn-xs fs-6 py-1 px-2' title="Drag">
                                        <span className=''>&#8645;</span>
                                    </button>
                                    <button type='button' className='btn text-muted btn-xs fs-6 py-1 px-2' title="Edit" data-bs-toggle="modal" data-bs-target="#newInputModal">
                                        <i className='fa fa-pencil'></i>
                                    </button>
                                    <button type='button' className='btn text-danger btn-xs fs-6 py-1 px-2' title="Delete">
                                        <i className='fa fa-trash-alt'></i>
                                    </button>
                                </div>
                            </div>
                            <div className=''>
                                {field.type == 'paragraph' ? (
                                    <>
                                        <p className='form-text fs-6 px-2' title='Edit text' contentEditable suppressContentEditableWarning={true} onInput={e => {
                                            setForm(forms => {
                                                forms[formIndex].components = forms[formIndex].components.map(c => {
                                                    if (c.id == component.id) {
                                                        c.components = c.components.map(f => {
                                                            if (f.id == field.id) {
                                                                f.description = e.target.innerText
                                                            }
                                                            return f
                                                        })
                                                    }
                                                    return c
                                                })
                                                return forms
                                            })
                                        }}>{field.description}</p>
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
                                )))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BuilderSection