import Head from 'next/head'
import React from 'react'

function ViewPermission({ permission }) {
  return (
    <>
      <Head>
        <title>EPT | View Permission</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewPermission {permission}</div>
    </>
  )
}

export default ViewPermission