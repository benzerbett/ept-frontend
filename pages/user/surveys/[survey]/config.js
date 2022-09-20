
const configuration_o = require("./../../../api/configuration.json");

let user = {
    "id": "5af8560f-d2d8-5b15-b2eb-9b0bef30b26b",
    "code": "5db79734-7759-5233-85c7-fe1fb05ade8d",
    "name": "John Doe",
    "email": "jdoeson@googlemail.net",
    "created": "2020-08-22T11:00:00.000Z",
    "modified": "2020-08-22T11:00:00.000Z"
}

function loadConfig(json) {
    let dataDictionary = {};
    if (json && json.dataDictionary) {
        dataDictionary = json.dataDictionary;
    } else {
        console.log("No dataDictionary found in config");
    }
    ////console.log("Loading config");
    ////console.log("Dictionary: " + Object.keys(dataDictionary).length);
    // ////console.log("Loading config", Object.keys(json), ", Dictionary: ", Object.keys(dataDictionary));
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
                    // ////console.log("Value for " + key + ": " + JSON.stringify(value));
                    if (typeof value == "object") {
                        json_str = json_str.replace('"' + matches[i] + '"', JSON.stringify(value));
                    } else {
                        json_str = json_str.replace('"' + matches[i] + '"', value);
                    }
                } else {
                    ////console.log("No value found for dict:key: ", key);
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
                ////console.log("Match: " + matches[i] + " Key: " + key, " Value: ", value);
                json_str = json_str.replace(matches[i], null); // TODO: replace with value from zustand state
            }
        }
        return JSON.parse(json_str);
    } else {
        if (!json || json.length == 0) {
            ////console.log("No config json found");
        }
        if (!dataDictionary || Object.keys(dataDictionary).length == 0) {
            ////console.log("No data dictionary found");
        }
        return [];
    }
}

function resolveDynamicValues(json, customDictionary) {
    let json_str = JSON.stringify(json);
    let regexp = /@ref\(([^)]+)\)/gmi
    let matches = json_str.match(regexp);
    // replace the occurences of @ref(dict: with the value of the key in the object
    for (let i = 0; i < matches.length; i++) {
        let key = matches[i].replace(regexp, '$1');
        // remove quotes and spaces
        key = key.replace(/['"]+/g, '').replace(/\s+/g, '');

        let value = (customDictionary[key]);
        if (value) {
            // ////console.log("Value for " + key + ": " + JSON.stringify(value));
            if (typeof value == "object") {
                json_str = json_str.replace('"' + matches[i] + '"', JSON.stringify(value));
            } else {
                json_str = json_str.replace('"' + matches[i] + '"', value);
            }
        } else {
            ////console.log("No value found for key: ", key);
            json_str = json_str.replace(matches[i], null);
        }
    }
    return JSON.parse(json_str);
}


    let configuration = []
    configuration_o.forEach(function (cfg) {
        let cf = loadConfig(cfg);
        configuration.push(cf);
    });

    module.exports = { configuration, user, loadConfig };