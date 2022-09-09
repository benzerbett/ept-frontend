import Head from 'next/head'
import React from 'react'

function PermissionsForm({ permission }) {
  return (
    <>
      <Head>
        <title>EPT | Edit Permission</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Permission {permission}</div>
    </>
  )
}

export default PermissionsForm