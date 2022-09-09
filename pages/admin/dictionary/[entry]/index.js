import Head from 'next/head'
import React from 'react'

function ViewDictionaryEntry({ entry }) {
  return (
    <>
      <Head>
        <title>EPT | View Dictionary Entry</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>View Dictionary Entry {entry}</div>
    </>
  )
}

export default ViewDictionaryEntry