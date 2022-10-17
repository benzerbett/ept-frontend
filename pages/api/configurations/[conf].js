// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
    const conf = req.query.conf
    const token = req.headers.authorization.split(' ')[1];
    const api_url = process.env.API_URL;
    if (process.env.USE_MOCK_API === 'true') {
        const configs = require('../configuration.json')
        const config = configs.find((c) => c.uuid === conf)
        if (config) {
            res.status(200).json(config)
        }else{
            res.status(404).json({message: `Configuration ${conf} not found`})
        }
        return
    }
    return fetch(api_url+'/program/'+conf+'?details=1', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    }).then(rs => rs.json()).then(data => {
        if (data) {
            res.status(200).json(data);
        } else {
            res.status(401).json({ message: 'Unauthorized' })
        }
    }).catch(err => {
        res.status(500).json({ statusCode: 500, message: err.message })
    })
  }
  