const debug = false;

// simulate login
export const simulateLogin = (username, password,rtr) => {
    if (typeof window !== 'undefined') {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        // generate user id
        const id = Math.floor(Math.random() * 1000000);
        if (username === 'admin' && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({id: id, type: 'admin', name: 'Mkuu L. Wabara', email: 'mkadmin@email.net' }))
            rtr.push('/admin', undefined, { unstable_skipClientCache: true })
        } else if (username.length > 0 && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({id: id, type: 'participant', name: 'Mwana Maabara', email: 'participant@mail.ke' }))
            rtr.push('/user', undefined, { unstable_skipClientCache: true })
        }
        window.location.reload()
    }
}


export const loadConfig = (json,session) => {
    const user = session?.user || null;
    let dataDictionary = {};
    if (json && json.dataDictionary) {
        dataDictionary = json.dataDictionary;
    } else {
        if(debug) console.log("No dataDictionary found in config");
    }
    if(debug) console.log("Loading config");
    if(debug) console.log("Dictionary: " + Object.keys(dataDictionary).length);
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
                    if(debug) console.log("No value found for dict:key: ", key);
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
                if(debug) console.log("Match: " + matches[i] + " Key: " + key, " Value: ", value);
                json_str = json_str.replace(matches[i], null); // TODO: replace with value from zustand state
            }
        }
        return JSON.parse(json_str);
    } else {
        if (!json || json.length == 0) {
            if(debug) console.log("No config json found");
        }
        if (!dataDictionary || Object.keys(dataDictionary).length == 0) {
            if(debug) console.log("No data dictionary found");
        }
        return [];
    }
}

// simulate logout
export const simulateLogout = (rtr) => {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        rtr.push('/auth/login', undefined, { unstable_skipClientCache: true })
        rtr.reload()
    }
}


// get user
export const simulateGetSession = () => {
    if (typeof window !== 'undefined') {
        let user = window.sessionStorage.getItem('user');
        let isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
        let activeProgramCode = window.sessionStorage.getItem('activeProgramCode');
        if (user && isLoggedIn) {
            return {
                isLoggedIn: true,
                user: JSON.parse(user),
                activeProgramCode: activeProgramCode
            }
        }
    }
    return null;
}

export const getProgramConfig = (id) => {
    return fetch(`/api/configurations/${id}`)
        .then((res) => res.json())
        .then((data) => {
            return data
        })
}