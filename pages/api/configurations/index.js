// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { doGetSession } from "../../../utilities";

export default async function handler(req, res) {
    // get token from request
    const token = req.headers.authorization.split(' ')[1];
    const api_url = process.env.API_URL;
    if (process.env.USE_MOCK_API === 'true') {
        const configs = require('../configuration.json')
        res.status(200).json(Array.from(configs, (c) => { return { code: c.code, name: c.name } }))
        return
    }
    return fetch(api_url + '/auth/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(res => res.json()).then(data => {
        if (data) {
            res.status(200).json(Array.from(data.programs, program => {
                return {
                    code: program.uuid,
                    name: program.name,
                }
            }));
        } else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }).catch(err => {
        res.status(500).json({ statusCode: 500, message: err.message })
    })
}
