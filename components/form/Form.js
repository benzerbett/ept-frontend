import React, { useEffect, useState } from "react";
import { doGetSession, submitFormData } from '../../utilities';
import Field from "./Field";
import Link from 'next/link';
import { flushSync } from "react-dom";

export function Form({ formId, form }) {
    const [fID, setFID] = useState(formId);
    const [flatFormState, setFlatFormState] = useState([]);
    const [currentSection, setCurrentSection] = useState(0);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [message, setMsg] = useState('');
    const [formData, setFormData] = useState(
        {
            "formCode": fID,
            "formResponses": []
        }
    ); // TODO: Fetch previous form state for the user and store here

    // TODO: add formresponses to global dictionary

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            doGetSession().then(session => {
                if (session) {
                    if (form) {
                        setFID(form?.code);
                    }
                    setLoading(false);
                } else {
                    window.location.href = '/auth/login';
                    window.location.reload();
                }
            }).catch(err => {
                setLoading(false);
                console.log(err);
                setStatus('error');
                setMsg('Error fetching session');
            })
        }
        return () => mounted = false;
    }, []);

    const flattenFormData = (formData) => {
        let flattened = [];
        formData.formResponses.forEach(response => {
            let section = response;
            section.fields.forEach(field => {
                flattened.push({
                    "formCode": formData.formCode,
                    "sectionCode": section.sectionCode,
                    "fieldCode": field.fieldCode || field.code || null,
                    "value": field.fieldValue || field.value || null
                });
            });
        });
        return flattened;
    };
    let [invalidFields, setInvalidFields] = useState([]);
    let [completeSections, setCompleteSections] = useState([]);

    const submitForm = (form_data) => {
        console.log("Submitting form data", form_data);
        submitFormData(form_data).then((response) => {
            console.log("Form submitted: ", response);
            if (response.status === true) {
                setStatus('success');
                setMsg(response.message);
            }
        }).catch((error) => {
            console.log("Form submission failed", error);
            setStatus('error');
            setMsg(error.message);
        });
    }

    if (loading) return <div style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h5 className='mb-0'>Loading...</h5>
    </div>

    if (!form || !form.sections || form.sections.length === 0) {
        return <main style={{ width: '100%', height: '85vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="alert alert-warning" role="alert">
                <h4 className="alert-heading">Form not found</h4>
                <hr />
                <p className="mb-0">Form with code <strong>{formId}</strong> not found. Please refresh the page and try again.</p>
                <p className="mb-0">If the problem persists, please contact the administrator.</p>
            </div>
        </main>;
    } else {
        return (
            <div>
                <div className="row">
                    <div className="col-md-2 d-flex align-items-center">
                        <Link href="/user/surveys"><a className="">&larr; Back</a></Link>
                    </div>
                    <div className="col-md-10 d-flex align-items-center justify-content-center">
                        {status && <div className={`py-3 mb-0 px-3 fs-6 alert w-100 text-center alert-${status === 'success' ? 'success' : ['danger', 'error', 'failed'].includes(status) ? 'danger' : status}`} role="alert">
                            {message}
                        </div>}
                    </div>
                    <hr className="mt-3 mb-3" style={{ borderColor: '#ccc' }} />
                </div>
                <h1 style={{ marginTop: 9 }}>{form.name}</h1>
                <h6>{form.description} &middot; <span className="text-muted">{form?.sections.length || 0} sections</span></h6>
                <hr className="mt-2 mb-2" style={{ borderColor: '#ccc' }} />
                <form {...form}>
                    <ul className="nav"
                    >
                        {form.sections && form.sections.length > 0 ? form.sections.map((section, index) => (
                            <li key={section.code + "_" + index + "_" + section.name} className="nav-link p-0 mx-2">
                                <a className={"btn btn-outline btn-sm fs-6 mx-2 my-1 " + (currentSection === index ? "btn-primary" : "btn-outline-secondary")} onClick={(ev) => {
                                    if (invalidFields.length > 0) {
                                        ev.preventDefault();
                                        alert("Please fill in all required fields before proceeding.");
                                    } else {
                                        ev.preventDefault(); ev.stopPropagation(); setCurrentSection(index);
                                    }
                                }}>{section.name}</a>
                            </li>
                        )) : <div>No sections found</div>}
                    </ul>
                    <hr />
                    <section>
                        {form.sections && form.sections.length > 0 ? [form.sections[currentSection]].map(
                            (section, s_index) => {
                                let newFormData = { ...formData };
                                let formSection = newFormData.formResponses.find(item => item.sectionCode === section.code);
                                if (!formSection) {
                                    formSection = {
                                        "sectionCode": section.code,
                                        "fields": []
                                    };
                                    newFormData.formResponses.push(formSection);
                                }


                                // find questions in groups (loops), explode the fields array into individual fields
                                // find all the 'groupstart' objects and get the index to get all groups in the section
                                let groups = [];
                                for (let i = 0; i < section.fields.length; i++) {
                                    if (section.fields[i].type === 'groupstart') {
                                        groups.push(
                                            {
                                                index: i,
                                                code: section.fields[i].code,
                                                data: section.fields[i].options || []
                                            }
                                        );
                                    }
                                }
                                // get the closest 'groupend' object and get the index
                                for (let i = 0; i < groups.length; i++) {
                                    for (let j = groups[i].index + 1; j < section.fields.length; j++) {
                                        if (section.fields[j].type === 'groupend') {
                                            groups[i].endIndex = j;
                                            break;
                                        }
                                    }
                                    // get all fields between the groupstart and groupend
                                    let groupFields = section.fields.slice(groups[i].index + 1, groups[i].endIndex);
                                    groups[i].fields = groupFields;
                                    // splice the fields array to replace the group fields with the individual fields for each data item in the group
                                }
                                groups.forEach((group, gx) => {
                                    group.data.forEach((data, dx) => {
                                        group.fields.forEach((field, fx) => {
                                            let newField = { ...field };
                                            newField.code = `${field.code}_${data.code}`;
                                            newField.name = `${field.name} (${data.name})`;
                                            section.fields = section.fields.filter(item => item.code !== field.code); // remove the group field from the section fields array
                                            section.fields.push(newField);
                                        });
                                    });
                                });
                                section.fields = section.fields.filter(field => field.type !== 'groupstart' && field.type !== 'groupend');

                                // callback function to update isSectionValid
                                const updateSectionValidity = (fieldCode, valid) => {
                                    if (fieldCode) {
                                        if (valid) {
                                            // invalidFields.delete(fieldCode);
                                            setInvalidFields(invalidFields.filter(item => item.field !== fieldCode));
                                            // complete the section if all fields are valid
                                            if (invalidFields.length === 0 && currentSection < form.sections.length - 1) {
                                                setCompleteSections([...completeSections, section.code]);
                                            } else {
                                                setCompleteSections(completeSections.filter(item => item !== section.code));
                                            }
                                        } else {
                                            // invalidFields.add(fieldCode);
                                            if (!Array.from(invalidFields, f => f.field).includes(fieldCode)) setInvalidFields([...invalidFields, {
                                                field: fieldCode,
                                                section: section.code
                                            }]);
                                            // incomplete the section if any field is invalid
                                            if (completeSections.includes(section.code)) {
                                                setCompleteSections(completeSections.filter(item => item !== section.code));
                                            } else {
                                                setCompleteSections([...completeSections]);
                                            }
                                        }
                                    }
                                    return valid;
                                };


                                return (
                                    <div className="alert alert-secondary px-3 d-flex flex-column align-items-start justify-content-start" style={{ height: '100%', /*maxHeight: '600px',*/ overflow: 'scroll', backgroundColor: '#eef5f9' }} key={section.code + "_" + currentSection}>
                                        <div className="d-flex flex-column align-items-center justify-content-between w-100">
                                            <h4 className="w-100" style={{ marginBottom: 2, color: 'steelblue', textTransform: 'uppercase', textAlign: 'center' }}>{section.name} </h4>
                                            {Array.from(invalidFields, f => f.section).length > 0 && Array.from(invalidFields, f => f.section).includes(form.sections[currentSection].code) && <div className="alert alert-danger py-1 px-2 mb-1 text-center" role="alert">
                                                <small className="mb-0">Please check that all fields have been filled correctly.</small>
                                            </div>}
                                        </div>
                                        <hr className="border-top border-primary w-100" />
                                        {section.fields && section.fields.length > 0 ? section.fields.map((fld, fx) => {
                                            let field = fld;
                                            // set default attributes for input fields
                                            let input_fields = ["text", "number", "email", "tel", "url", "date", "time", "datetime-local", "month", "week", "color", "range", "select", "radio", "checkbox", "file", "textarea"];
                                            let ignored_attributes = ["description"];
                                            let default_attributes = {
                                                title: field['description'] || field['name'] || '', className: (fld.type && fld.type=='select' ? 'form-select':'form-control'), updateSectionValidity: updateSectionValidity
                                            }; // TODO: ignore these attributes when spreading the object
                                            if (input_fields.includes(field.type)) {
                                                // onchange if not in the set attributes
                                                // SKIPPING set onChange check since we're deprecating setting events on fields
                                                default_attributes.onChange = (e) => {
                                                    console.log("onChange: ", field.code, e.target.value);
                                                    let newFormData = { ...formData };
                                                    let formResponse = newFormData.formResponses.find(fr => fr.sectionCode === section.code);
                                                    let fieldResponse = formResponse.fields.find(fr => fr.fieldCode === field.code);
                                                    if (fieldResponse) {
                                                        fieldResponse.fieldValue = e.target.value;
                                                    } else {
                                                        formResponse.fields.push({
                                                            "fieldCode": field.code,
                                                            "fieldValue": e.target.value || null
                                                        });
                                                    }
                                                    setFormData(newFormData);
                                                    let nf = flattenFormData(newFormData);
                                                    setFlatFormState(nf);
                                                    console.log("state", JSON.stringify(nf, null, 2));

                                                    // zustand.setState({ [field.code]: e.target.value }); // TODO: set value to global state
                                                };

                                                field = { ...field, ...default_attributes };
                                                // TODO: set values from global state to the field if available
                                            }

                                            return (<React.Fragment key={fld.code + "___" + fx}>
                                                <div className="form-group col-md-6" key={field.code} style={{ marginBottom: '6px', borderBottom: '1px solid #efefef', padding: '8px', display: 'flex', alignItems: 'center', width: '100%' }}>

                                                    {/* ------ */}

                                                    {input_fields.includes(field.type) ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 10, width: '80%' }}>
                                                        <label className={"form-label mb-1 fw-bold mx-1 " + (Array.from(invalidFields, f => f.field).includes(field.code) ? "text-danger" : "")}>{field.name}</label>
                                                        {field.readOnly ? <small style={{ fontSize: '12px', color: 'gray' }}>(Readonly)</small> : null}
                                                    </div>
                                                        : null}
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', fontSize: '0.8em' }}>
                                                        <Field field={field} />
                                                        {/* <small className="text-muted">
                                                            <details open> <summary>Field Details</summary>
                                                                <pre> {JSON.stringify(field, null, 2)} </pre>
                                                            </details>
                                                        </small> */}
                                                    </div>

                                                    {/* ------ */}
                                                </div>
                                            </React.Fragment>
                                            );
                                        }) : <div className="alert alert-warning">No fields found</div>}
                                    </div>
                                );

                            }) : <div className="alert alert-warning">No sections found</div>}
                    </section>
                    <div id={"form-footer_" + form.code} style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <button className="btn btn-secondary btn-dark"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (currentSection > 0) {
                                        setCurrentSection(currentSection - 1);
                                    }
                                }} type={currentSection !== 0 ? "submit" : ""} disabled={currentSection === 0
                                    || Array.from(invalidFields, f => f.section).includes(form.sections[currentSection].code)
                                }> &larr; Previous</button>
                            <label>
                                {currentSection + 1} of {form.sections.length}
                            </label>
                            <button className="btn btn-secondary btn-dark"
                                onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (currentSection < form.sections.length - 1) {
                                        setCurrentSection(currentSection + 1);
                                    }
                                }} type={currentSection !== form.sections.length - 1 ? "submit" : ""} disabled={(currentSection === form.sections.length - 1
                                    || Array.from(invalidFields, f => f.section).includes(form.sections[currentSection].code)
                                )}> Next
                                {/* ({form.sections[currentSection].name}) */}
                                {" "} &rarr;</button>
                        </div>
                        {currentSection === form.sections.length - 1 && <>
                            <hr /><hr />
                            <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <button className="btn btn-primary bg-purple" type="submit" onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    console.log("submit: ", formData);
                                    submitForm(formData);
                                    // zustand.setState({ form: { ...zustand.state.form, ...form } });
                                }}
                                    disabled={(currentSection === form.sections.length - 1
                                        || Array.from(invalidFields, f => f.section).includes(form.sections[currentSection].code)
                                        || (completeSections.length !== form.sections.length && !completeSections.includes(form.sections[currentSection].code))
                                    )}>Submit</button>
                                <button className="btn" type="reset" onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    console.log("reset: ", formData);
                                    // zustand.setState({ form: { ...zustand.state.form, ...form } });
                                }}>Cancel</button>
                            </div></>}
                    </div>
                </form>
            </div>
        );
    }
}
