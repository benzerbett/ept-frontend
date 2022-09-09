import Head from 'next/head'
import React from 'react'

function ViewForm({ form }) {
  return (
    <>
      <Head>
        <title>EPT | View Form</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewForm {form}</div>
    </>
  )
}

export default ViewForm