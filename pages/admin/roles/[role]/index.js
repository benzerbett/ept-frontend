import Head from 'next/head'
import React from 'react'

function ViewRole({ role }) {
  return (
    <>
      <Head>
        <title>EPT | View Role</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>ViewRole {role}</div>
    </>
  )
}

export default ViewRole