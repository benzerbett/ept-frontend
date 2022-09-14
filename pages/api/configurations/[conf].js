// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    const configs = require('../configuration.json')
    const conf = req.query.conf
    const config = configs.find((c) => c.code === conf)
    if (config) {
        res.status(200).json(config)
    }else{
        res.status(404).json({message: `Configuration ${conf} not found`})
    }
  }
  