import React, { useEffect, useState} from "react";

import { useRouter } from 'next/router';
import Link from 'next/link'


import {configuration}  from './config'

function Home() {
    return (<>
        <div>
            <h1 style={{ marginTop: 9 }}>Please pick a surveys above.</h1>
            <pre>
                {JSON.stringify(configuration, null, 2)}
            </pre>
        </div>
    </>)
}

//utility to render a form field given a field object
function renderField(field) {
    console.log("renderField", field.type);
    return (<>
        {field.type === 'text' ? React.createElement('input', { type: 'text', placeholder: field.name, ...field }) :
            field.type === 'number' ? React.createElement('input', { type: 'number', placeholder: field.name, ...field }) :
                field.type === 'date' ? React.createElement('input', { type: 'date', placeholder: field.name, ...field }) :
                    (field.type === 'select' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('select', { placeholder: field.name, ...field }, field.options.map(option => (
                        <option key={option.value} value={option.value}>{option.name}</option>
                    ))) : (field.type === 'radio' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, field.options.map(option => (
                        <div key={option.value} style={{ marginBottom: '10px' }}>
                            <input type="radio" name={field.code} value={option.value} {...field} /> {option.name}
                        </div>
                    ))) : (field.type === 'checkbox' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, field.options.map(option => (
                        <div key={option.value} style={{ marginBottom: '10px' }}>
                            <input type="checkbox" name={field.code} value={option.value} {...field} /> {option.name}
                        </div>
                    ))) : field.type === 'textarea' ? React.createElement('textarea', { placeholder: field.name, ...field }) :
                        React.createElement(field.type, {
                            key: field.code,
                            id: field.code,
                            name: field.name,
                            style: { margin: '0px', minWidth: '50%' },
                            children: ((field.type === 'h1' || field.type === 'h2' || field.type === 'h3' || field.type === 'h4' || field.type === 'h5' || field.type === 'h6') ? field.description || field.name || field.label :
                                "This question could not be loaded")
                        })}
    </>)
}

function Survey() {
    const { pID } = useRouter();
    let pt = configuration.find(item => item.code === pID);
    if (!pt) {
        return <div>
            <h1>survey not found</h1>
        </div>
    } else {
        return (
            <div>
                <h1 style={{ marginTop: 5 }}>{pt.name}</h1>
                <h6>{pt.description}</h6>
                <hr />
                <div>
                    <h3>survey Forms</h3>
                    {pt.forms && pt.forms.length > 0 ?
                        pt.forms.map(form => (
                            <div key={form.code}>
                                <a href={'/'} style={{ marginBottom: 2, color: 'steelblue', fontSize: 20, fontWeight: 'bold' }}>{form.name}</a><br />
                                <small>(Sections: <b>{form.sections.length}</b></small>{", "}<small>Questions: <b>{Array.prototype.concat.apply([], form.sections.map(section => section.fields.length)).reduce((a, b) => a + b)}</b>)</small>
                            </div>
                        ))
                        : <div>No forms found</div>}
                </div>
            </div>
        );
    }
}

function Form() {
    const { query:{pID}, query:{fID} } = useRouter();
    const [form, setForm] = useState(null);
    const [flatFormState, setFlatFormState] = useState([])
    const [formData, setFormData] = useState(
        {
            "formCode": fID,
            "formResponses": []
        }
    ) // TODO: Fetch previous form state for the user and store here

    let rounds = configuration.find(item => item.code === pID).rounds.find(item => item.checklistForm === fID);

    const flattenFormData = (formData) => {
        let flattened = [];
        formData.formResponses.forEach(response => {
            let section = response
            section.fields.forEach(field => {
                flattened.push({
                    "formCode": formData.formCode,
                    "sectionCode": section.sectionCode,
                    "fieldCode": field.fieldCode || field.code || null,
                    "value": field.fieldValue || field.value || null
                });
            })
        });
        return flattened
    }
  useEffect(()=>{      
      setForm(configuration.find(item => item.code === pID).forms.find(item => item.code === rounds.checklistForm))
    },[])
    if (!form || rounds.useChecklist == false) {
        return <div>
            <h1>Form not found</h1>
        </div>
    } else {
        return (
            <div>
                <a href={`/user/surveys`}>&larr; Back to survey</a>
                <h1 style={{ marginTop: 9 }}>{form.name}</h1>
                <h6>{form.description}</h6>
                <hr />
                <form {...form}>
                    {form.sections && form.sections.length > 0 ? form.sections.map(section => {
                        let newFormData = { ...formData };
                        let formSection = newFormData.formResponses.find(item => item.sectionCode === section.code);
                        if (!formSection) {
                            formSection = {
                                "sectionCode": section.code,
                                "fields": []
                            }
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
                            })
                        })
                        section.fields = section.fields.filter(field => field.type !== 'groupstart' && field.type !== 'groupend')





                        return (
                            <div style={{ backgroundColor: 'rgb(237, 250, 255)', border: '1px solid #cef', margin: '22px auto', padding: '12px 8px', borderRadius: 5, padding: '8px' }} key={section.code}>
                                <h4 style={{ marginBottom: 2, color: 'steelblue', textTransform: 'uppercase', textAlign: 'center' }}>{section.name}</h4>
                                {section.fields && section.fields.length > 0 ? section.fields.map(fld => {
                                    let field = fld
                                    // set default attributes for input fields
                                    let input_fields = ["text", "number", "email", "tel", "url", "date", "time", "datetime-local", "month", "week", "color", "range", "select", "radio", "checkbox", "file", "textarea"];
                                    let ignored_attributes = ["description"]
                                    let default_attributes = {
                                        title: field['description'] || field['name'] || '',
                                    } // TODO: ignore these attributes when spreading the object
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
                                        }
                                        field = { ...field, ...default_attributes };
                                        // TODO: set values from global state to the field if available
                                    }

                                    return (
                                        <div key={field.code} style={{ marginBottom: '6px', borderBottom: '1px solid #efefef', padding: '8px' }}>

                                            {/* ------ */}
                                            
                                            {input_fields.includes(field.type) ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 9 }}>
                                                <h5 style={{ margin: 0 }}>{field.name}</h5>
                                                {field.readOnly ? <small style={{ fontSize: '12px', color: 'gray' }}>(Readonly)</small> : null}
                                            </div>
                                                : null}

                                            {/* {renderField(field)} */}

                                            {/* ------ */}

                                            {/* <small style={{ color: 'gray' }}>
                                                <details>
                                                    <summary>{field.name}, {field.type}</summary>
                                                    <pre style={{ backgroundColor: 'ghostwhite' }}>{JSON.stringify(field, null, 2)}</pre>
                                                </details>
                                            </small> */}
                                            {/* </div> */}
                                        </div>
                                    )
                                }) : <div>No fields found</div>}
                            </div>
                        )

                    }) : <div style={{ backgroundColor: 'rgb(237, 250, 255)', border: '1px solid #fdb', margin: '5px auto', padding: '12px 8px', borderRadius: 5 }}>No sections found</div>}
                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            console.log("submit: ", formData);
                            // zustand.setState({ form: { ...zustand.state.form, ...form } });
                        }}>Submit</button>
                        <button type="reset" onClick={(ev) => {
                            ev.preventDefault();
                            ev.stopPropagation();
                            console.log("reset: ", formData);
                            // zustand.setState({ form: { ...zustand.state.form, ...form } });
                        }}>Cancel</button>
                    </div>
                </form>
            </div>
        );
    }
}

function App() {
    return (
        <section>
            <div>
                <header style={{ padding: '10px 15px' }}>
                    <nav>
                        <h3><u>New Survey form</u></h3>
                        <Link href="/">Home</Link>
                    </nav>
                    <nav>
                        <ul>
                            {
                               configuration.map((item, ix) => (
                                    <li key={item.code}>
                                        <a href={`/`}>{ix + 1}. {item.name}</a>
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                </header>
                <article style={{ padding: '10px 15px' }}>
                   
                      <Link href="/" exact>
                            <Form />
                       </Link>
                       {/* <Link href="/">
                            <Survey />
                       </Link> */}
                       {/* <Link href="/">
                            <Home />
                       </Link>
                       <Link href="/">
                            <Home />
                       </Link> */}
                    
                </article>
            </div>
        </section>
    );
}


export default App;
