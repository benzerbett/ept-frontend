import React from "react";

//utility to render a form field given a field object


export default function Field({ field }) {

    const [isValid, setIsValid] = React.useState(null);
    const [vlmessage, setMessage] = React.useState(null);
    // validation based on the 'validation' attribute
    if (field.validation) {
        if (field?.required)
            field.required = field.validation.required;
        if (field?.pattern)
            field.pattern = field.validation.pattern;
        if (field?.min)
            field.min = field.validation.min;
        if (field?.max)
            field.max = field.validation.max;
        if (field?.minLength)
            field.minLength = field.validation.minLength;
        if (field?.maxLength)
            field.maxLength = field.validation.maxLength;

        // listeners for validation
        field.onBlur = (e) => {
            // validation types: required, pattern/regex, min, max, minLength, maxLength
            let validations = field.validation;
            let value = e.target.value;
            let valid = null;
            let message = '';
            validations.forEach((validation) => {
                setMessage(message);
                if (validation.required && value === '') {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || 'This field is required. ';
                    setMessage(message);
                }

                // if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
                if (validation.type == 'regex') {
                    if (validation.expression && !new RegExp(validation.expression).test(value)) {
                        valid = false;
                        setIsValid(false);
                        message += validation?.message || 'Invalid value. ';
                        setMessage(message);
                    }
                }

                if (validation.min && value < validation.min) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Minimum value is ${validation.min}. `;
                    setMessage(message);
                }

                if (validation.max && value > validation.max) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Maximum value is ${validation.max}. `;
                    setMessage(message);
                }

                if (validation.minLength && value.length < validation.minLength) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Minimum length is ${validation.minLength}. `;
                    setMessage(message);
                }

                if (validation.maxLength && value.length > validation.maxLength) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Maximum length is ${validation.maxLength}. `;
                    setMessage(message);
                }

                if (valid == false) {
                    // console.log("::INValid")
                    setIsValid(false);
                    setMessage(message);
                    field.updateSectionValidity(field.code, false);
                } else {
                    // console.log("::Valid")
                    setIsValid(true);
                    message += ' ';
                    setMessage(message);
                    field.updateSectionValidity(field.code, true);
                }
                // TODO: check if field has been skipped
                field['data-valid'] = valid;
                // console.log("onBlur():::  Field: ", field?.name, " Valid: ", valid, " Message: ", message);
            });
        };
    }

    const fieldProps = Object.assign({}, field);
    delete fieldProps.validation;
    delete fieldProps.updateSectionValidity;
    delete fieldProps['Description'];
    // console.log("Field: ", fieldProps);
    // return <>{JSON.stringify(field)}</>
    return (<React.Fragment key={field.code+"_____"+field.name}>
        {field.type === 'text' ? React.createElement('input', { ...fieldProps, type: 'text', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
            field.type === 'number' ? React.createElement('input', { ...fieldProps, type: 'number', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                field.type === 'date' ? React.createElement('input', { ...fieldProps, type: 'date', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                    (field.type === 'select' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('select', { ...fieldProps, className: ('form-select form-select-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name, ...fieldProps }, field.options.map((option, k) => (
                        <React.Fragment key={k + "_" + option.value+"_"+option.name}>
                            {k == 0 ? (<option value={""} disabled> - Selectz - {/*field.name*/}</option>) : null}
                            <option value={option.value}>{option.name}</option>
                        </React.Fragment>
                    ))) : (field.type === 'radio' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, /*...fieldProps,*/ field.options.map((option, k) => (
                        <div key={k + "_" + option.value+"_"+option.name} style={{ marginBottom: '10px', display: 'inline-flex', gap: 3, marginInlineEnd: '12px' }}>
                            <input type="radio" name={field.code} value={option.value} 
                            // {...fieldProps} 
                            /> {option.name}
                        </div>
                    ))) : (field.type === 'checkbox' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, ...fieldProps, field.options.map((option, k) => (
                        <div key={k + "_" + option.value+"_"+option.name} style={{ marginBottom: '10px' }}>
                            <input type="checkbox" name={field.code} value={option.value} 
                            // {...field}
                             /> {option.name}
                        </div>
                    ))) : field.type === 'textarea' ? React.createElement('textarea', { ...fieldProps, className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                        React.createElement(field.type, {
                            ...fieldProps,
                            key: field.code+"_"+field.name,
                            id: field.code,
                            name: field.name,
                            style: { margin: '0px', minWidth: '50%' },
                            children: ((field.type === 'h1' || field.type === 'h2' || field.type === 'h3' || field.type === 'h4' || field.type === 'h5' || field.type === 'h6') ? field.description || field.name || field.label :
                                "This question could not be loaded")
                        })}
        {isValid == false ? (<span className="text-danger">{vlmessage}</span>) : null}
    </React.Fragment>);
}
