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
export const sendPasswordResetLink = async (email, rtr) => {
    if (typeof window !== 'undefined') {
        return fetch(api_url + '/auth/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        }).then(res => res.json()).then(data => {
            if (debug) console.log('/auth/forgot-password data::', data)
            if (data.status === false) {
                if (debug) console.log('/auth/forgot-password error::', data)
                return data
            } else {
                // rtr.push('/login', undefined, { unstable_skipClientCache: true })
                return data
            }
        }).catch(err => {
            if (debug) console.error('/auth/forgot-password error::', err)
            return err
        })
    }
}
export const doPasswordReset = async (email, password, password_confirmation, token, rtr) => {
    if (typeof window !== 'undefined') {
        return fetch(api_url + '/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, password_confirmation, token })
        }).then(res => res.json()).then(data => {
            if (debug) console.log('/auth/reset-password data::', data)
            if (data.status === false) {
                if (debug) console.log('/auth/reset-password error::', data)
                return data
            } else {
                // rtr.push('/login', undefined, { unstable_skipClientCache: true })
                return data
            }
        }).catch(err => {
            if (debug) console.error('/auth/reset-password error::', err)
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

// get user
export const doGetSession = async () => {
    if (typeof window !== 'undefined') {
        // TODO: first check if the user is logged in i.e. check the session storage / cookie - DONE
        let isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn || isLoggedIn == 'false') {
            if (debug) console.log("User is not logged in");
            return null;
        }
        return fetch(api_url+'/auth/user', {
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
                    user: { ...data.user, type: data.role?.name, permissions: Array.from(data?.permissions, p=>p?.name), programs: Array.from(data?.programs, p=>{
                        return {uuid: p?.uuid, name: p?.name}
                    }) },
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

export const getActiveSession = (sessionID) => {
    console.log("getActiveSession", sessionID)
    if (sessionID) {
        return fetch(`/api/configurations/${sessionID}?details`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
            }
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.uuid) {
                    if (typeof window !== 'undefined') {
                        window.sessionStorage.setItem('activeProgramCode', data?.uuid)
                    }
                    return data?.uuid
                }
            })
    } /*else {
        return null;
    }*/
}

export const getProgramConfig = (id) => {
    return fetch(`/api/configurations/${id}?details`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        }
    })
        .then((res) => res.json())
        .then((data) => {
            return data
        })
}


export const getPrograms = () => {
    return fetch(`/api/configurations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        }
    })
        .then((res) => res.json())
}

export const submitFormData = (data) => {
    return fetch(api_url + '/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + window.sessionStorage.getItem('token')
        },
        body: JSON.stringify(data),
    }).then((res) => res.json())
}

export const getResource = (resource, options) => {
    // check if resource is a url
    let url
    if (resource.startsWith("http://") || resource.startsWith("https://")) {
        url = resource
    }else {
        url = api_url + '/' + resource
    }
    let request_options = {};
    request_options.method = options?.method || 'GET';
    request_options.headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.sessionStorage.getItem('token'),
        ...options?.headers || {}
    };
    if (options?.body) request_options.body = JSON.stringify(options?.body);
    return fetch(url, request_options)
        .then((res) => res.json())
}
