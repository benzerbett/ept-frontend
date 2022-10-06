// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    // const configs = require('../configuration.json')
    const conf = req.query.conf
    const token = req.headers.authorization.split(' ')[1];
    const api_url = process.env.API_URL;
    return fetch(api_url+'/program/'+conf, {
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
  