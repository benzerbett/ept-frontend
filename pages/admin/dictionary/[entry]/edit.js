import Head from 'next/head'
import React from 'react'

function EditDictEntry({ entry }) {
  return (
    <>
      <Head>
        <title>EPT | Edit Dictionary Entry</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>EditDictEntry {entry}</div>
    </>
  )
}

export default EditDictEntry