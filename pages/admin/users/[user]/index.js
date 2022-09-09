import Head from 'next/head'
import React from 'react'

function ViewUser({ user }) {
  return (
    <>
      <Head>
        <title>EPT | View User</title>
        <meta name="description" content="EPT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='container'>View User {user}</div>
    </>
  )
}

export default ViewUser