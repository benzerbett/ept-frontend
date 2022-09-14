import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

function SchemeForm() {
  const router = useRouter()
  const {scheme} = router.query
  return (
    <>
      <Head>
        <title>EPT | Edit Scheme</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditScheme {scheme}</div>
    </>
  )
}

export default SchemeForm