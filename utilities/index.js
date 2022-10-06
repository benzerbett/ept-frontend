import React from "react";
import useSWR from "swr";

const debug = process.env.APP_ENV || false;
const api_url = process.env.API_URL || "http://localhost:8000/api";

export const doLogin = async (email, password, rtr) => {
    if (typeof window !== 'undefined') {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');

        return fetch(api_url + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        }).then(res => res.json()).then(data => {
            if (debug) console.log('/auth/login data::', data)
            if (data.status === false) {
                if (debug) console.log('/auth/login 401 error::', data)
                return data
            } else {
                window.sessionStorage.setItem('isLoggedIn', true)
                window.sessionStorage.setItem('token', data.token)
                // get user details
                return fetch(api_url + '/auth/user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.token}`
                    }
                }).then(res => res.json()).then(data => {
                    if (debug) console.log('/auth/user data (doLogin) ::', data)
                    if (data.status === true) {
                        // window.sessionStorage.setItem('user', JSON.stringify({ ...data.user, type: (data.user.role == 1 ? "admin" : "participant") }))
                        window.sessionStorage.setItem('user', JSON.stringify({ ...data.user, type: data.role?.name }))
                        // redirect to admin or user dashboard
                        if (data.role?.name == "superadmin" || data.role?.name == "super_admin" || data.role?.name == "admin") {
                            rtr.push('/admin', undefined, { unstable_skipClientCache: true })
                        } else {
                            rtr.push('/user', undefined, { unstable_skipClientCache: true })
                        }
                        window.location.reload()
                    } else {
                        // show error
                        if (debug) console.error('/auth/user error (doLogin) ::', data)
                        window.sessionStorage.setItem('isLoggedIn', false)
                        window.sessionStorage.removeItem('token')
                        window.sessionStorage.removeItem('user')
                        rtr.push('/login', undefined, { unstable_skipClientCache: true })
                    }
                    return data
                }).catch(error => {
                    if (debug) console.error('/auth/user error::', error)
                    return error
                })
            }
        }).catch(err => {
            if (debug) console.error('/auth/login error::', err)
            return err
        })
    }
}
export const doSignup = async (name, email, phone, password,role,rtr) => {
    if (typeof window !== 'undefined') {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');

        return fetch(api_url + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password,role })
        }).then(res => res.json()).then(data => {
            if (data.status === false) {
                if (debug) console.log('/auth/register error::', data)
                return data
            } else {
                if (debug) console.log('/auth/register success::', data)
                return data
            }
        }).catch(err => {
            if (debug) console.error('/auth/register error::', err)
            return err
        })
    }
}

export const doLogout = async (rtr) => {
    if (typeof window !== 'undefined') {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        window.sessionStorage.removeItem('token');
        fetch(api_url + '/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.sessionStorage.getItem('token')}`
            }
        }).then(res => res.json()).then(data => {
            if (debug) console.log('/auth/logout data::', data)
            if (data.status === true) {
                window.location.reload()
            } else {
                if (debug) console.error('/auth/logout error (doLogout) ::', data)
            }
            rtr.push('/auth/login', undefined, { unstable_skipClientCache: true })
            rtr.reload()
            // return data
        }).catch(err => {
            if (debug) console.error('/auth/logout error (doLogout) ::', err)
            rtr.push('/auth/login', undefined, { unstable_skipClientCache: true })
            rtr.reload()
            // return err
        })
    }
}


export const loadConfig = (json, session) => {
    const user = session?.user || null;
    let dataDictionary = {};
    if (json && json.dataDictionary) {
        dataDictionary = json.dataDictionary;
    } else {
        if (debug) console.log("No dataDictionary found in config");
    }
    if (debug) console.log("Loading config");
    if (debug) console.log("Dictionary: " + Object.keys(dataDictionary).length);
    // if(debug) console.log("Loading config", Object.keys(json), ", Dictionary: ", Object.keys(dataDictionary));
    if (json && Object.keys(json).length > 0 && dataDictionary && Object.keys(dataDictionary).length > 0) {
        let json_str = JSON.stringify(json);
        let regexp = /@ref\(([^)]+)\)/gmi
        let matches = json_str.match(regexp);
        // replace the occurences of @ref(dict: with the value of the key in the object
        for (let i = 0; i < matches.length; i++) {
            let key = matches[i].replace(regexp, '$1');
            // remove quotes and spaces
            key = key.replace(/['"]+/g, '').replace(/\s+/g, '');
            // for keys with a prefix of dict:, replace with the value of the key in the dictionary
            if (key.startsWith("dict:")) {
                let value = (dataDictionary[key.replace("dict:", "")]);
                if (value) {
                    // if(debug) console.log("Value for " + key + ": " + JSON.stringify(value));
                    if (typeof value == "object") {
                        json_str = json_str.replace('"' + matches[i] + '"', JSON.stringify(value));
                    } else {
                        json_str = json_str.replace('"' + matches[i] + '"', value);
                    }
                } else {
                    if (debug) console.log("No value found for dict:key: ", key);
                    json_str = json_str.replace(matches[i], null);
                }
            }
            // for keys with a prefix of user:, replace with the value of the key in the user object
            if (key.startsWith("user:")) {
                json_str = json_str.replace(matches[i], null);
                json_str = json_str.replace('"' + matches[i] + '"', JSON.stringify(user));
            }
            // TODO: for keys without a prefix (probably form fields), replace with the value of the key in the form object from the global zustand state
            if (!key.startsWith("dict:") && !key.startsWith("user:")) {
                // check for value in context / state
                let value = null; //window.zustand.getState()[key];
                if (debug) console.log("Match: " + matches[i] + " Key: " + key, " Value: ", value);
                json_str = json_str.replace(matches[i], null); // TODO: replace with value from zustand state
            }
        }
        return JSON.parse(json_str);
    } else {
        if (!json || json.length == 0) {
            if (debug) console.log("No config json found");
        }
        if (!dataDictionary || Object.keys(dataDictionary).length == 0) {
            if (debug) console.log("No data dictionary found");
        }
        return [];
    }
}


//utility to render a form field given a field object
export function renderField(field) {

    const [isValid, setIsValid] = React.useState(null);
    const [vlmessage, setMessage] = React.useState(null);
    // validation based on the 'validation' attribute
    if (field.validation) {
        if (field?.required) field.required = field.validation.required;
        if (field?.pattern) field.pattern = field.validation.pattern;
        if (field?.min) field.min = field.validation.min;
        if (field?.max) field.max = field.validation.max;
        if (field?.minLength) field.minLength = field.validation.minLength;
        if (field?.maxLength) field.maxLength = field.validation.maxLength;

        // listeners for validation
        field.onBlur = (e) => {
            // validation types: required, pattern/regex, min, max, minLength, maxLength
            let validations = field.validation;
            let value = e.target.value;
            let valid = null;
            let message = '';
            validations.forEach((validation) => {
                setMessage(message)
                if (validation.required && value === '') {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || 'This field is required; ';
                    setMessage(message)
                }

                // if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
                if (validation.type == 'regex') {
                    if (validation.expression && !new RegExp(validation.expression).test(value)) {
                        valid = false;
                        setIsValid(false);
                        message += validation?.message || 'Invalid value; ';
                        setMessage(message)
                    }
                }

                if (validation.min && value < validation.min) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Minimum value is ${validation.min}; `;
                    setMessage(message)
                }

                if (validation.max && value > validation.max) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Maximum value is ${validation.max}; `;
                    setMessage(message)
                }

                if (validation.minLength && value.length < validation.minLength) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Minimum length is ${validation.minLength}; `;
                    setMessage(message)
                }

                if (validation.maxLength && value.length > validation.maxLength) {
                    valid = false;
                    setIsValid(false);
                    message += validation?.message || `Maximum length is ${validation.maxLength}; `;
                    setMessage(message)
                }

                if (valid == false) {
                    console.log("::INValid")
                    setIsValid(false);
                    setMessage(message)
                } else {
                    console.log("::Valid")
                    setIsValid(true);
                    message += ' ';
                    setMessage(message)
                }
                // TODO: check if field has been skipped

                field['data-valid'] = valid;
                console.log("onBlur():::  Field: ", field?.name, " Valid: ", valid, " Message: ", message);
            });
        }
    }
    // return <>{JSON.stringify(field)}</>
    return (<>
        {field.type === 'text' ? React.createElement('input', { ...field, type: 'text', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
            field.type === 'number' ? React.createElement('input', { ...field, type: 'number', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                field.type === 'date' ? React.createElement('input', { ...field, type: 'date', className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                    (field.type === 'select' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('select', { ...field, className: ('form-select form-select-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name, ...field }, field.options.map((option, k) => (
                        <>
                            {k == 0 ? (<option key={k} value={""} disabled> - Select - {/*field.name*/}</option>) : null}
                            <option key={k + "_" + option.value} value={option.value}>{option.name}</option>
                        </>
                    ))) : (field.type === 'radio' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, ...field, field.options.map((option, k) => (
                        <div key={k + "_" + option.value} style={{ marginBottom: '10px', display: 'inline-flex', gap: 3, marginInlineEnd: '12px' }}>
                            <input type="radio" name={field.code} value={option.value} {...field} /> {option.name}
                        </div>
                    ))) : (field.type === 'checkbox' && field.options && field.options.length > 0 && typeof field.options == "object") ? React.createElement('div', {}, ...field, field.options.map((option, k) => (
                        <div key={k + "_" + option.value} style={{ marginBottom: '10px' }}>
                            <input type="checkbox" name={field.code} value={option.value} {...field} /> {option.name}
                        </div>
                    ))) : field.type === 'textarea' ? React.createElement('textarea', { ...field, className: ('form-control form-control-lgz' + (isValid == true ? ' is-valid' : (isValid == false ? ' is-invalid' : ''))), placeholder: field.name }) :
                        React.createElement(field.type, {
                            ...field,
                            key: field.code,
                            id: field.code,
                            name: field.name,
                            style: { margin: '0px', minWidth: '50%' },
                            children: ((field.type === 'h1' || field.type === 'h2' || field.type === 'h3' || field.type === 'h4' || field.type === 'h5' || field.type === 'h6') ? field.description || field.name || field.label :
                                "This question could not be loaded")
                        })}
        {isValid == false ? (<span className="text-danger">{vlmessage}</span>) : null}
    </>)
}

// get user
export const doGetSession = async () => {
    if (typeof window !== 'undefined') {
        return fetch('http://localhost:8000/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
            }
        }).then(res => res.json()).then(data => {
            if (debug) console.log('/auth/user data (doGetSession) ::', data)
            // if (data) {
            if (debug) console.log('/auth/user data (doGetSession) ::', data)
            if (data.status === true) {
                // return user info
                let session = {
                    // user: { ...data.user, type: (data.user.role == 1 ? "admin" : "participant") },
                    user: { ...data.user, type: data.role?.name },
                    isLoggedIn: true,
                    token: window.sessionStorage.getItem('token'),
                    activeProgramCode: window.sessionStorage.getItem('activeProgramCode') || null,
                }
                return session
            } else {
                // return null
                return null
            }
            // }
        }).catch(error => {
            if (debug) console.error('/auth/user error (doGetSession) ::', error)
        })
    }
    return null;
}

export const simulateActiveSession = (sessionID) => {
    if (sessionID) {
        return fetch(`/api/configurations/${sessionID}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.code) {
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('activeProgramCode', data?.code)
                    }
                    return data?.code
                }
            })
    } else {
        return null;
    }
}

export const getProgramConfig = (id) => {
    return fetch(`/api/configurations/${id}`)
        .then((res) => res.json())
        .then((data) => {
            return data
        })
}