import Head from 'next/head'
import React from 'react'

function ViewScheme({ scheme }) {
  return (
    <>
      <Head>
        <title>EPT | View Scheme</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewScheme {scheme}</div>
    </>
  )
}

export default ViewScheme