// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const config = require('../configuration.json')
  res.status(200).json(Array.from(config, (c) => {return {code: c.code, name: c.name}}))
}
