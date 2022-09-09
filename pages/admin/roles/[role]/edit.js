import Head from 'next/head'
import React from 'react'

function RolesForm({ role }) {
  return (
    <>
      <Head>
        <title>EPT | Edit Role</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>Edit Role {role}</div>
    </>
  )
}

export default RolesForm