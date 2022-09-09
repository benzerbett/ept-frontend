import Head from 'next/head'
import React from 'react'

function Admin() {
  return (
    <>
      <Head>
        <title>EPT | Admin Dashboard</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Admin Dashboard</div>
    </>
  )
}

export default Admin