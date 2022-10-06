// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  // get token from request
  const token = req.headers.authorization.split(' ')[1];
  console.log(':::::::::token:::::::::::::', token);
  console.log(':::::::::api_url:::::::::::::', process.env.API_URL);
  const configs = require('../configuration.json')
  res.status(200).json(Array.from(configs, (c) => {return {code: c.code, name: c.name}}))
}
